import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye, History } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="h-20 w-20 text-primary mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">
            SteganoApp
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Professional Steganography Platform
          </p>
          <p className="text-lg mb-12 max-w-2xl mx-auto">
            Hide and extract secret messages using advanced encryption and steganography algorithms.
            Secure, reliable, and production-ready.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')}>
              View Demo
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 rounded-lg bg-card border">
              <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">12 Encryption Algorithms</h3>
              <p className="text-muted-foreground">
                Caesar, Vigenère, Playfair, RSA, DES, and more
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">9 Stego Methods</h3>
              <p className="text-muted-foreground">
                LSB, PVD, Whitespace, and advanced techniques
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <History className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Complete History</h3>
              <p className="text-muted-foreground">
                Track all your operations with detailed logs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
