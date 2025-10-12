import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Operation {
  id: string;
  operation_type: string;
  stego_algorithm: string;
  encryption_algorithm: string;
  status: string;
  created_at: string;
}

const History = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchOperations();
    }
  }, [user, authLoading, navigate]);

  const fetchOperations = async () => {
    const { data, error } = await supabase
      .from('operations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOperations(data);
    }
    setLoading(false);
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Operation History</CardTitle>
            <CardDescription>
              View all your encoding and decoding operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {operations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No operations yet. Start encoding or decoding messages!
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Stego Algorithm</TableHead>
                    <TableHead>Encryption</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operations.map((op) => (
                    <TableRow key={op.id}>
                      <TableCell>
                        <Badge variant={op.operation_type === 'encode' ? 'default' : 'secondary'}>
                          {op.operation_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{op.stego_algorithm}</TableCell>
                      <TableCell className="font-mono text-sm">{op.encryption_algorithm}</TableCell>
                      <TableCell>
                        <Badge variant={op.status === 'success' ? 'default' : 'destructive'}>
                          {op.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(op.created_at), 'PPp')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
