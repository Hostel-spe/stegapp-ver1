import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { encryptMessage, encryptionAlgorithms, type EncryptionAlgorithm } from '@/lib/encryption';
import { z } from 'zod';
import { imageAlgorithms, textAlgorithms, type SteganographyAlgorithm } from '@/lib/steganography';
import { encodeLSB } from '@/lib/steganography/lsb';
import { encodeWhitespace } from '@/lib/steganography/whitespace';
import { hashPassphrase, embedHashInMessage } from '@/lib/utils/crypto';
import { Upload, Download, Lock } from 'lucide-react';

const messageSchema = z.string()
  .min(1, 'Message cannot be empty')
  .max(10000, 'Message too long (max 10KB)')
  .refine(
    val => !val.includes('\0'),
    'Invalid characters detected'
  );

const Encode = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'text'>('image');
  const [message, setMessage] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [encryptionAlgo, setEncryptionAlgo] = useState<EncryptionAlgorithm>('caesar');
  const [stegoAlgo, setStegoAlgo] = useState<SteganographyAlgorithm>('lsb');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const type = selectedFile.type.startsWith('image/') ? 'image' : 'text';
      setFileType(type);
      
      if (type === 'image') {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      }
    }
  };

  const handleEncode = async () => {
    if (!file || !message || !user) return;

    // Validate message
    const messageValidation = messageSchema.safeParse(message);
    if (!messageValidation.success) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: messageValidation.error.errors[0].message
      });
      return;
    }

    if (!passphrase) {
      toast({
        variant: 'destructive',
        title: 'Passphrase Required',
        description: 'Please enter a passphrase to protect your message.'
      });
      return;
    }

    setLoading(true);
    try {
      // Hash the passphrase
      const passphraseHash = await hashPassphrase(passphrase);
      
      // Encrypt the message
      const encryptedMessage = encryptMessage(message, encryptionAlgo, encryptionKey);
      
      // Embed hash with encrypted message
      const protectedMessage = embedHashInMessage(passphraseHash, encryptedMessage);
      
      let stegoBlob: Blob;
      let stegoFilename = `stego_${file.name}`;

      if (fileType === 'image' && stegoAlgo === 'lsb') {
        const img = new Image();
        img.src = previewUrl;
        await new Promise((resolve) => { img.onload = resolve; });

        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const encodedData = await encodeLSB(imageData, protectedMessage);
        ctx.putImageData(encodedData, 0, 0);
        
        stegoBlob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => resolve(blob!), 'image/png');
        });
      } else if (fileType === 'text' && stegoAlgo === 'whitespace') {
        const coverText = await file.text();
        const encodedText = encodeWhitespace(coverText, protectedMessage);
        stegoBlob = new Blob([encodedText], { type: 'text/plain' });
        stegoFilename = `stego_${file.name}`;
      } else {
        throw new Error('Algorithm not implemented yet');
      }

      // Upload to storage
      const userId = user.id;
      const originalPath = `${userId}/${Date.now()}_${file.name}`;
      const stegoPath = `${userId}/${Date.now()}_${stegoFilename}`;

      const { error: uploadError } = await supabase.storage
        .from('original-files')
        .upload(originalPath, file);

      if (uploadError) throw uploadError;

      const { error: stegoUploadError } = await supabase.storage
        .from('stego-files')
        .upload(stegoPath, stegoBlob);

      if (stegoUploadError) throw stegoUploadError;

      // Save to database
      const { data: fileData, error: fileError } = await supabase
        .from('files')
        .insert({
          user_id: userId,
          original_filename: file.name,
          stego_filename: stegoFilename,
          file_type: fileType,
          file_path: originalPath,
          stego_file_path: stegoPath,
          passphrase_hash: passphraseHash
        })
        .select()
        .single();

      if (fileError) throw fileError;

      await supabase.from('operations').insert({
        user_id: userId,
        file_id: fileData.id,
        operation_type: 'encode',
        stego_algorithm: stegoAlgo,
        encryption_algorithm: encryptionAlgo,
        status: 'success'
      });

      // Download stego file
      const url = URL.createObjectURL(stegoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = stegoFilename;
      a.click();

      toast({
        title: 'Success!',
        description: 'Message encoded and file downloaded successfully.'
      });

      setFile(null);
      setMessage('');
      setPassphrase('');
      setPreviewUrl('');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Encoding failed',
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <Card className="shadow-card border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Encode Message</CardTitle>
              <CardDescription>
                Hide your secret message inside an image or text file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file">Upload Cover File (PNG, BMP, JPEG, TXT)</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/png,image/bmp,image/jpeg,text/plain"
                  onChange={handleFileChange}
                />
              </div>

              {previewUrl && (
                <div className="border rounded-lg p-4">
                  <img src={previewUrl} alt="Preview" className="max-w-full h-auto max-h-64 mx-auto" />
                </div>
              )}

              <div className="space-y-2">
                <Label>Steganography Algorithm</Label>
                <Select value={stegoAlgo} onValueChange={(v) => setStegoAlgo(v as SteganographyAlgorithm)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Image Algorithms</SelectLabel>
                      {imageAlgorithms.map((algo) => (
                        <SelectItem key={algo.value} value={algo.value}>
                          {algo.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Text Algorithms</SelectLabel>
                      {textAlgorithms.map((algo) => (
                        <SelectItem key={algo.value} value={algo.value}>
                          {algo.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Encryption Algorithm</Label>
                <Select value={encryptionAlgo} onValueChange={(v) => setEncryptionAlgo(v as EncryptionAlgorithm)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {encryptionAlgorithms.map((algo) => (
                      <SelectItem key={algo.value} value={algo.value}>
                        {algo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {['vigenere', 'playfair'].includes(encryptionAlgo) && (
                <div className="space-y-2">
                  <Label htmlFor="key">Encryption Key</Label>
                  <Input
                    id="key"
                    type="text"
                    placeholder="Enter encryption key"
                    value={encryptionKey}
                    onChange={(e) => setEncryptionKey(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="passphrase" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Passphrase (Required)
                </Label>
                <Input
                  id="passphrase"
                  type="password"
                  placeholder="Enter a passphrase to protect your message"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="border-primary/50 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  You will need this passphrase to decode the message later
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Secret Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your secret message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={10000}
                />
                <p className="text-xs text-muted-foreground">
                  {message.length}/10,000 characters
                </p>
              </div>

              <Button
                onClick={handleEncode}
                disabled={!file || !message || !passphrase || loading}
                className="w-full"
              >
                {loading ? 'Encoding...' : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Encode & Download
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Encode;
