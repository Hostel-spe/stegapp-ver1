import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye, History } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="relative inline-block mb-6">
            <Shield className="h-24 w-24 text-primary mx-auto animate-glow" />
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
            SteganoApp
          </h1>
          <p className="text-2xl font-semibold mb-4 text-primary">
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
            <div className="p-8 rounded-xl bg-card/80 backdrop-blur-sm border border-primary/20 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                <Lock className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary">12 Encryption Algorithms</h3>
              <p className="text-muted-foreground">
                Caesar, Vigenère, Playfair, RSA, DES, and more
              </p>
            </div>
            <div className="p-8 rounded-xl bg-card/80 backdrop-blur-sm border border-secondary/20 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center mx-auto mb-4">
                <Eye className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-secondary">9 Stego Methods</h3>
              <p className="text-muted-foreground">
                LSB, PVD, Whitespace, and advanced techniques
              </p>
            </div>
            <div className="p-8 rounded-xl bg-card/80 backdrop-blur-sm border border-accent/20 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center mx-auto mb-4">
                <History className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-accent">Complete History</h3>
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
