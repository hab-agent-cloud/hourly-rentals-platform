import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface AddListingsDialogProps {
  adminId: number;
  currentCount: number;
  objectLimit: number;
  onSuccess: () => void;
}

const CITIES = [
  'Волгоград',
  'Екатеринбург', 
  'Казань',
  'Краснодар',
  'Красноярск',
  'Москва',
  'Нижний Новгород',
  'Новосибирск',
  'Ростов-на-Дону',
  'Самара',
  'Санкт-Петербург',
  'Тверь'
];

const FUNC_URLS = {
  availableListings: 'https://functions.poehali.dev/5b32d012-f4bf-4544-8fba-4495a89cb57d',
  batchAdd: 'https://functions.poehali.dev/a751cc09-fbdf-4794-b6cc-3492abd05772'
};

export default function AddListingsDialog({ adminId, currentCount, objectLimit, onSuccess }: AddListingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [listings, setListings] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedCity && open) {
      fetchListings();
    }
  }, [selectedCity, open]);

  useEffect(() => {
    if (!open) {
      setSelectedCity('');
      setListings([]);
      setSelectedIds(new Set());
    }
  }, [open]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${FUNC_URLS.availableListings}?city=${encodeURIComponent(selectedCity)}`);
      const data = await response.json();
      
      if (response.ok) {
        setListings(data.listings || []);
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось загрузить объекты',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при загрузке',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (listingId: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(listingId)) {
      newSelected.delete(listingId);
    } else {
      if (currentCount + newSelected.size >= objectLimit) {
        toast({
          title: 'Превышен лимит',
          description: `Вы можете добавить максимум ${objectLimit} объектов. Текущее количество: ${currentCount}`,
          variant: 'destructive'
        });
        return;
      }
      newSelected.add(listingId);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    const availableSlots = objectLimit - currentCount;
    if (listings.length > availableSlots) {
      toast({
        title: 'Превышен лимит',
        description: `Можно добавить только ${availableSlots} объектов из ${listings.length}`,
        variant: 'destructive'
      });
      
      const limitedIds = new Set(listings.slice(0, availableSlots).map(l => l.id));
      setSelectedIds(limitedIds);
    } else {
      const allIds = new Set(listings.map(l => l.id));
      setSelectedIds(allIds);
    }
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleAdd = async () => {
    if (selectedIds.size === 0) {
      toast({
        title: 'Ошибка',
        description: 'Выберите хотя бы один объект',
        variant: 'destructive'
      });
      return;
    }

    setAdding(true);
    try {
      const response = await fetch(FUNC_URLS.batchAdd, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manager_id: adminId,
          listing_ids: Array.from(selectedIds)
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно',
          description: `Добавлено объектов: ${data.added}${data.skipped > 0 ? `, пропущено: ${data.skipped}` : ''}`
        });
        setOpen(false);
        onSuccess();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось добавить объекты',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при добавлении',
        variant: 'destructive'
      });
    } finally {
      setAdding(false);
    }
  };

  const availableSlots = objectLimit - currentCount;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить объекты
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Добавить объекты в сопровождение</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Доступно слотов: {availableSlots} / {objectLimit}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Выберите город</Label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите город" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCity && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {loading ? 'Загрузка...' : `Найдено объектов: ${listings.length}`}
                  {selectedIds.size > 0 && ` (выбрано: ${selectedIds.size})`}
                </p>
                {!loading && listings.length > 0 && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleSelectAll}
                      disabled={selectedIds.size === listings.length}
                    >
                      Выбрать все
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleDeselectAll}
                      disabled={selectedIds.size === 0}
                    >
                      Снять все
                    </Button>
                  </div>
                )}
              </div>

              <ScrollArea className="h-[400px] border rounded-lg p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Icon name="Loader2" size={32} className="animate-spin" />
                  </div>
                ) : listings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="Building" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Нет доступных объектов в этом городе</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {listings.map(listing => (
                      <div
                        key={listing.id}
                        className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                        onClick={() => handleToggle(listing.id)}
                      >
                        <Checkbox
                          checked={selectedIds.has(listing.id)}
                          onCheckedChange={() => handleToggle(listing.id)}
                        />
                        {listing.photo && (
                          <img 
                            src={listing.photo}
                            alt={listing.name}
                            className="w-16 h-16 object-cover rounded flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{listing.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            📍 {listing.district || listing.city}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {!loading && listings.length > 0 && (
                <Button 
                  onClick={handleAdd} 
                  disabled={selectedIds.size === 0 || adding}
                  className="w-full"
                >
                  {adding ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Добавление...
                    </>
                  ) : (
                    <>
                      <Icon name="Check" size={16} className="mr-2" />
                      Добавить выбранные ({selectedIds.size})
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}