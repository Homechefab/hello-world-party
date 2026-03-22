import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface Chef {
  id: string;
  business_name: string;
  full_name: string | null;
  contact_email: string | null;
  application_status: string | null;
}

interface AdminChefSelectorProps {
  onChefSelected: (chefId: string) => void;
  selectedChefId: string | null;
}

export const AdminChefSelector = ({ onChefSelected, selectedChefId }: AdminChefSelectorProps) => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChefs = async () => {
      const { data, error } = await supabase
        .from('chefs')
        .select('id, business_name, full_name, contact_email, application_status')
        .order('business_name');

      if (!error && data) {
        setChefs(data);
      }
      setLoading(false);
    };
    fetchChefs();
  }, []);

  if (loading) return null;

  return (
    <Card className="border-primary/40 bg-primary/5 mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-primary">Administratörsläge – Visa kockens dashboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedChefId || ''} onValueChange={onChefSelected}>
          <SelectTrigger className="w-full md:w-96">
            <SelectValue placeholder="Välj en kock att visa..." />
          </SelectTrigger>
          <SelectContent>
            {chefs.map((chef) => (
              <SelectItem key={chef.id} value={chef.id}>
                <div className="flex items-center gap-2">
                  <span>{chef.full_name || chef.business_name}</span>
                  <span className="text-muted-foreground text-xs">({chef.business_name})</span>
                  {chef.contact_email && (
                    <span className="text-muted-foreground text-xs">– {chef.contact_email}</span>
                  )}
                  <Badge variant={chef.application_status === 'approved' ? 'default' : 'secondary'} className="text-[10px] ml-1">
                    {chef.application_status === 'approved' ? 'Godkänd' : chef.application_status}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
