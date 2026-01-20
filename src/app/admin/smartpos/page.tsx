'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';

interface SmartPOSProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Mapping {
  siteProductId: string;
  smartposProductId: number;
  productName: string;
}

export default function SmartPOSPage() {
  const [smartPosProducts, setSmartPosProducts] = useState<SmartPOSProduct[]>([]);
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [loading, setLoading] = useState(false);
  const { products: siteProducts } = useProducts();
  
  const loadMappings = async () => {
      try {
          const res = await fetch('/api/smartpos/mappings');
          const data = await res.json();
          if (data.success) setMappings(data.mappings);
      } catch (e) {
          console.error(e);
      }
  };

  useEffect(() => {
      loadMappings();
  }, []);

  const fetchSmartPOS = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/smartpos/sync');
      const data = await res.json();
      if (data.success) {
        setSmartPosProducts(data.products);
        toast.success('Produtos SmartPOS carregados');
      } else {
        toast.error('Erro ao carregar produtos do SmartPOS');
      }
    } catch (e) {
      toast.error('Erro de conexão com SmartPOS');
    } finally {
      setLoading(false);
    }
  };

  const handleMap = async (smartPosId: number, siteProductId: string, productName: string) => {
    try {
        if (!siteProductId) return;

        const res = await fetch('/api/smartpos/sync', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                mapping: {
                    siteProductId,
                    smartposProductId: smartPosId,
                    productName
                }
            })
        });
        if (res.ok) {
            toast.success(`Mapeado: ${productName}`);
            loadMappings(); // Refresh mappings
        } else {
            toast.error('Erro ao salvar mapeamento');
        }
    } catch (e) {
        toast.error('Erro ao salvar');
    }
  };

  // Helper to find mapped site product ID for a given SmartPOS ID
  const getMappedSiteId = (smartPosId: number) => {
      const mapping = mappings.find(m => m.smartposProductId === smartPosId);
      return mapping ? mapping.siteProductId : "";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold font-serif">Integração SmartPOS</h1>
            <p className="text-muted-foreground">Gerencie a sincronização de estoque com o SmartPOS</p>
        </div>
        <Button onClick={fetchSmartPOS} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Buscar Produtos SmartPOS
        </Button>
      </div>

      <div className="grid gap-4">
        {smartPosProducts.length === 0 && !loading && (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">Clique em "Buscar Produtos SmartPOS" para iniciar.</p>
            </div>
        )}

        {smartPosProducts.map(sp => {
           const isMapped = mappings.some(m => m.smartposProductId === sp.id);
           
           return (
           <Card key={sp.id} className={isMapped ? "border-green-500/20 bg-green-50/50" : ""}>
             <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="font-bold">{sp.name}</p>
                        {isMapped && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">ID: {sp.id} | Estoque SmartPOS: {sp.stock}</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">Mapear para:</span>
                    <select 
                        className="p-2 border rounded-md w-full sm:w-64 bg-background"
                        value={getMappedSiteId(sp.id)}
                        onChange={(e) => handleMap(sp.id, e.target.value, sp.name)}
                    >
                        <option value="">-- Selecione --</option>
                        {siteProducts.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
             </CardContent>
           </Card>
        )})}
      </div>
    </div>
  );
}
