import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { decryptMessage, encryptionAlgorithms, type EncryptionAlgorithm } from '@/lib/encryption';
import { imageAlgorithms, textAlgorithms, type SteganographyAlgorithm } from '@/lib/steganography';
import { decodeLSB } from '@/lib/steganography/lsb';
import { decodeWhitespace } from '@/lib/steganography/whitespace';
import { hashPassphrase, extractHashFromMessage } from '@/lib/utils/crypto';
import { Upload, Eye, Lock } from 'lucide-react';

const Decode = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'text'>('image');
  const [passphrase, setPassphrase] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [encryptionAlgo, setEncryptionAlgo] = useState<EncryptionAlgorithm>('caesar');
  const [stegoAlgo, setStegoAlgo] = useState<SteganographyAlgorithm>('lsb');
  const [loading, setLoading] = useState(false);
  const [decodedMessage, setDecodedMessage] = useState('');

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
    }
  };

  const handleDecode = async () => {
    if (!file || !user) return;

    if (!passphrase) {
      toast({
        variant: 'destructive',
        title: 'Passphrase Required',
        description: 'Please enter the passphrase to decode this message.'
      });
      return;
    }

    setLoading(true);
    try {
      let protectedMessage = '';

      if (fileType === 'image' && stegoAlgo === 'lsb') {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => { img.onload = resolve; });

        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        protectedMessage = decodeLSB(imageData);
      } else if (fileType === 'text' && stegoAlgo === 'whitespace') {
        const stegoText = await file.text();
        protectedMessage = decodeWhitespace(stegoText);
      } else {
        throw new Error('Algorithm not implemented yet');
      }

      // Extract hash and encrypted message
      const extracted = extractHashFromMessage(protectedMessage);
      
      if (!extracted) {
        throw new Error('Invalid file format. This file may not be password protected.');
      }

      // Verify passphrase
      const enteredPassphraseHash = await hashPassphrase(passphrase);
      
      if (enteredPassphraseHash !== extracted.hash) {
        toast({
          variant: 'destructive',
          title: 'Incorrect Passphrase',
          description: 'The passphrase you entered is incorrect.'
        });
        setLoading(false);
        return;
      }

      // Decrypt the message
      const decryptedMessage = decryptMessage(extracted.message, encryptionAlgo, encryptionKey);
      setDecodedMessage(decryptedMessage);

      await supabase.from('operations').insert({
        user_id: user.id,
        operation_type: 'decode',
        stego_algorithm: stegoAlgo,
        encryption_algorithm: encryptionAlgo,
        status: 'success'
      });

      toast({
        title: 'Success!',
        description: 'Message decoded successfully.'
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Decoding failed',
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
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Decode Message</CardTitle>
              <CardDescription>
                Extract hidden message from a stego file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file">Upload Stego File</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/png,image/bmp,image/jpeg,text/plain"
                  onChange={handleFileChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Steganography Algorithm Used</Label>
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
                <Label>Encryption Algorithm Used</Label>
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
                  <Label htmlFor="key">Decryption Key</Label>
                  <Input
                    id="key"
                    type="text"
                    placeholder="Enter decryption key"
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
                  placeholder="Enter the passphrase to unlock the message"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="border-primary/50 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the same passphrase used during encoding
                </p>
              </div>

              <Button
                onClick={handleDecode}
                disabled={!file || !passphrase || loading}
                className="w-full"
              >
                {loading ? 'Decoding...' : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Decode Message
                  </>
                )}
              </Button>

              {decodedMessage && (
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-lg">Decoded Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap break-words">{decodedMessage}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Decode;
