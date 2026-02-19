import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import OwnerForm from '@/components/admin-owners/OwnerForm';
import AssignListingsModal from '@/components/admin-owners/AssignListingsModal';
import OwnerCard from '@/components/admin-owners/OwnerCard';
import BonusDialog from '@/components/admin-owners/BonusDialog';

interface Owner {
  id: number;
  email: string;
  login?: string;
  full_name: string;
  phone?: string;
  balance: number;
  bonus_balance: number;
  hotels_count: number;
  hotels?: Array<{ id: number; title: string; city: string }>;
  created_at: string;
  last_login?: string;
  is_archived: boolean;
}

interface Listing {
  id: number;
  title: string;
  city: string;
  district: string;
  owner_id: number | null;
  owner_name?: string;
}

export default function AdminOwnersTab({ token }: { token: string }) {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showBonusDialog, setShowBonusDialog] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [bonusAmount, setBonusAmount] = useState('');
  const [availableListings, setAvailableListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ownersSearch, setOwnersSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedListingIds, setSelectedListingIds] = useState<number[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    login: '',
    password: '',
    loginType: 'phone' as 'phone' | 'email',
    full_name: '',
    phone: '',
  });

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    setIsLoading(true);
    try {
      const data = await api.getOwners(token);
      if (data.error) throw new Error(data.error);
      setOwners(data);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось загрузить владельцев',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOwners = useMemo(() => {
    return owners.filter(o => {
      if (!showArchived && o.is_archived) return false;
      if (showArchived && !o.is_archived) return false;
      if (!ownersSearch) return true;
      const q = ownersSearch.toLowerCase();
      return (
        o.full_name?.toLowerCase().includes(q) ||
        o.email?.toLowerCase().includes(q) ||
        o.phone?.toLowerCase().includes(q) ||
        o.login?.toLowerCase().includes(q) ||
        o.hotels?.some(h => h.title?.toLowerCase().includes(q) || h.city?.toLowerCase().includes(q))
      );
    });
  }, [owners, ownersSearch, showArchived]);

  const handleCreate = () => {
    setSelectedOwner(null);
    setFormData({ email: '', login: '', password: '', loginType: 'phone', full_name: '', phone: '' });
    setShowForm(true);
  };

  const handleEdit = (owner: Owner) => {
    setSelectedOwner(owner);
    const loginType = owner.login?.includes('@') ? 'email' : 'phone';
    setFormData({
      email: owner.email,
      login: owner.login || '',
      password: '',
      loginType: loginType,
      full_name: owner.full_name,
      phone: owner.phone || '',
    });
    setShowForm(true);
  };

  const handleArchive = async (owner: Owner) => {
    try {
      await api.archiveOwner(token, owner.id);
      toast({
        title: 'Успешно',
        description: owner.is_archived ? 'Владелец восстановлен из архива' : 'Владелец перемещён в архив',
      });
      loadOwners();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось изменить статус',
        variant: 'destructive',
      });
    }
  };

  const handleAddBonus = async () => {
    if (!selectedOwner || !bonusAmount) return;
    
    const amount = parseFloat(bonusAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Ошибка',
        description: 'Введите корректную сумму',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.adminAddBonus(token, selectedOwner.id, amount);
      toast({
        title: 'Успешно',
        description: `Начислено ${amount} бонусных рублей`,
      });
      setShowBonusDialog(false);
      setBonusAmount('');
      loadOwners();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось начислить бонусы',
        variant: 'destructive',
      });
    }
  };

  const handleAssignListings = async (owner: Owner) => {
    setSelectedOwner(owner);
    setShowAssignModal(true);
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedListingIds([]);
    try {
      const data = await api.getAvailableListings(token);
      setAvailableListings(data);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось загрузить список отелей',
        variant: 'destructive',
      });
    }
  };

  const handleAssignListing = async (listing: Listing) => {
    if (!selectedOwner) return;
    
    try {
      await api.assignListingToOwner(token, listing.id, selectedOwner.id);
      toast({
        title: 'Успешно',
        description: `Отель "${listing.title}" привязан к владельцу ${selectedOwner.full_name}`,
      });
      
      const data = await api.getAvailableListings(token);
      setAvailableListings(data);
      loadOwners();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось привязать отель',
        variant: 'destructive',
      });
    }
  };

  const handleUnassignListing = async (listing: Listing) => {
    try {
      await api.assignListingToOwner(token, listing.id, null);
      toast({
        title: 'Успешно',
        description: `Отель "${listing.title}" отвязан от владельца`,
      });
      
      const data = await api.getAvailableListings(token);
      setAvailableListings(data);
      loadOwners();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось отвязать отель',
        variant: 'destructive',
      });
    }
  };

  const handleBulkAssign = async () => {
    if (!selectedOwner || selectedListingIds.length === 0) return;
    
    try {
      await Promise.all(
        selectedListingIds.map(id => 
          api.assignListingToOwner(token, id, selectedOwner.id)
        )
      );
      toast({
        title: 'Успешно',
        description: `Привязано отелей: ${selectedListingIds.length}`,
      });
      
      setSelectedListingIds([]);
      const data = await api.getAvailableListings(token);
      setAvailableListings(data);
      loadOwners();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось привязать отели',
        variant: 'destructive',
      });
    }
  };

  const handleToggleListing = (listingId: number) => {
    setSelectedListingIds(prev => 
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  const handleToggleAll = () => {
    const filteredListings = availableListings.filter((listing) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        listing.title.toLowerCase().includes(query) ||
        listing.city.toLowerCase().includes(query) ||
        listing.district.toLowerCase().includes(query);
      
      const matchesCity = selectedCity === 'all' || listing.city === selectedCity;
      
      return matchesSearch && matchesCity;
    });
    
    const unassignedListings = filteredListings.filter(l => l.owner_id === null);
    if (selectedListingIds.length === unassignedListings.length) {
      setSelectedListingIds([]);
    } else {
      setSelectedListingIds(unassignedListings.map(l => l.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedOwner) {
        await api.updateOwner(token, { ...formData, id: selectedOwner.id });
        toast({ title: 'Успешно', description: 'Владелец обновлён' });
      } else {
        await api.createOwner(token, formData);
        toast({ title: 'Успешно', description: 'Владелец создан' });
      }
      setShowForm(false);
      loadOwners();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось сохранить владельца',
        variant: 'destructive',
      });
    }
  };

  if (showAssignModal && selectedOwner) {
    return (
      <AssignListingsModal
        selectedOwner={selectedOwner}
        availableListings={availableListings}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedListingIds={selectedListingIds}
        handleToggleListing={handleToggleListing}
        handleToggleAll={handleToggleAll}
        handleAssignListing={handleAssignListing}
        handleUnassignListing={handleUnassignListing}
        handleBulkAssign={handleBulkAssign}
        onClose={() => setShowAssignModal(false)}
      />
    );
  }

  if (showForm) {
    return (
      <OwnerForm
        selectedOwner={selectedOwner}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold">Владельцы отелей</h2>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            {filteredOwners.length} из {owners.filter(o => showArchived ? o.is_archived : !o.is_archived).length}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={showArchived ? 'default' : 'outline'}
            onClick={() => setShowArchived(!showArchived)}
          >
            <Icon name="Archive" size={18} className="mr-2" />
            {showArchived ? 'Скрыть архив' : 'Архив'}
          </Button>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={handleCreate}
          >
            <Icon name="Plus" size={18} className="mr-2" />
            Добавить владельца
          </Button>
        </div>
      </div>

      <div className="relative">
        <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Поиск по имени, email, телефону, логину, названию отеля..."
          value={ownersSearch}
          onChange={(e) => setOwnersSearch(e.target.value)}
          className="pl-10"
        />
        {ownersSearch && (
          <button onClick={() => setOwnersSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <Icon name="X" size={18} />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Icon name="Loader2" size={48} className="animate-spin text-purple-600" />
        </div>
      ) : filteredOwners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
          <Icon name="SearchX" size={40} />
          <p>Ничего не найдено</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOwners.map((owner) => (
            <OwnerCard
              key={owner.id}
              owner={owner}
              onEdit={handleEdit}
              onArchive={handleArchive}
              onAssignListings={handleAssignListings}
              onAddBonus={(owner) => {
                setSelectedOwner(owner);
                setShowBonusDialog(true);
              }}
            />
          ))}
        </div>
      )}

      <BonusDialog
        open={showBonusDialog}
        onOpenChange={setShowBonusDialog}
        selectedOwner={selectedOwner}
        bonusAmount={bonusAmount}
        setBonusAmount={setBonusAmount}
        onAddBonus={handleAddBonus}
      />
    </div>
  );
}