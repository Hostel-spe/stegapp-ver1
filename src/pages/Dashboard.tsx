import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage, FileText, History, Shield } from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome to SteganoApp</h1>
            <p className="text-muted-foreground">
              Choose an operation to get started with steganography
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/encode')}>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Encode Message</CardTitle>
                <CardDescription>
                  Hide a secret message inside an image or text file using steganography
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Start Encoding</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/decode')}>
              <CardHeader>
                <FileImage className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Decode Message</CardTitle>
                <CardDescription>
                  Extract hidden messages from stego files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Start Decoding</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/history')}>
              <CardHeader>
                <History className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Operation History</CardTitle>
                <CardDescription>
                  View your past encoding and decoding operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">View History</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Supported Formats</CardTitle>
                <CardDescription>
                  PNG, BMP, JPEG images and TXT files up to 10MB
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>✓ 12 Encryption algorithms</li>
                  <li>✓ 9 Steganography methods</li>
                  <li>✓ Secure cloud storage</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
