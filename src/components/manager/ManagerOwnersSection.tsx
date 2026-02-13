import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import AddOwnerDialog from './AddOwnerDialog';
import { motion } from 'framer-motion';

const FUNC_URL = 'https://functions.poehali.dev/7c4cd1b3-767c-49c5-85db-bf1b4de2cace';

interface Owner {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  username: string;
  telegram_name: string;
  manager_comment: string;
  created_at: string;
  last_login: string | null;
  balance: number;
  bonus_balance: number;
  is_archived: boolean;
  created_by_manager_id: number | null;
  manager_name: string | null;
  listings_count: number;
}

interface ManagerOwnersSectionProps {
  adminId: number;
  managedListings: { id: number; name?: string; title?: string }[];
  onRefresh: () => void;
}

export default function ManagerOwnersSection({ adminId, managedListings, onRefresh }: ManagerOwnersSectionProps) {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${FUNC_URL}?admin_id=${adminId}`);
      const data = await response.json();
      if (data.owners) {
        setOwners(data.owners);
        setRole(data.role || '');
      }
    } catch (error) {
      console.error('Failed to load owners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, [adminId]);

  const filtered = useMemo(() => {
    if (!search) return owners;
    const q = search.toLowerCase();
    return owners.filter(o =>
      (o.full_name || '').toLowerCase().includes(q) ||
      (o.phone || '').includes(q) ||
      (o.username || '').toLowerCase().includes(q) ||
      (o.email || '').toLowerCase().includes(q)
    );
  }, [owners, search]);

  const isSharedView = ['om', 'um', 'superadmin'].includes(role);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="Loader2" size={32} className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Icon name="Users" size={22} className="text-purple-600" />
            {isSharedView ? 'Все владельцы' : 'Мои владельцы'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isSharedView ? 'Общая база владельцев' : 'Владельцы, которых вы добавили'}
            {' \u2014 '}{filtered.length} {filtered.length === 1 ? 'владелец' : filtered.length < 5 ? 'владельца' : 'владельцев'}
          </p>
        </div>
        <AddOwnerDialog
          adminId={adminId}
          managedListings={managedListings}
          onSuccess={() => { fetchOwners(); onRefresh(); }}
        />
      </div>

      <Input
        placeholder="Поиск по имени, телефону, логину..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Icon name="UserX" size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-muted-foreground">
              {search ? 'Владельцы не найдены' : 'Вы ещё не добавили ни одного владельца'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((owner) => (
            <Card key={owner.id} className={owner.is_archived ? 'opacity-50' : ''}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-lg">{owner.full_name}</span>
                      {owner.is_archived && <Badge variant="secondary">Архив</Badge>}
                      {owner.listings_count > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <Icon name="Building2" size={12} className="mr-1" />
                          {owner.listings_count} {owner.listings_count === 1 ? 'объект' : owner.listings_count < 5 ? 'объекта' : 'объектов'}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Phone" size={14} />
                        {owner.phone}
                      </span>
                      {owner.username && (
                        <span className="flex items-center gap-1">
                          <Icon name="User" size={14} />
                          {owner.username}
                        </span>
                      )}
                      {owner.telegram_name && (
                        <span className="flex items-center gap-1">
                          <Icon name="Send" size={14} />
                          {owner.telegram_name}
                        </span>
                      )}
                      {isSharedView && owner.manager_name && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <Icon name="UserCheck" size={14} />
                          {owner.manager_name}
                        </span>
                      )}
                    </div>
                    {owner.manager_comment && (
                      <p className="text-xs text-muted-foreground mt-1 bg-gray-50 px-2 py-1 rounded">
                        {owner.manager_comment}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 text-sm shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Баланс:</span>
                      <span className="font-semibold text-purple-600">{owner.balance.toLocaleString()} ₽</span>
                    </div>
                    {owner.last_login ? (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Icon name="CheckCircle" size={12} />
                        Был: {new Date(owner.last_login).toLocaleDateString('ru-RU')}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Не заходил</span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      Создан: {new Date(owner.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
