import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface AddOwnerDialogProps {
  adminId: number;
  managedListings: any[];
  onSuccess: () => void;
}

const FUNC_URL = 'https://functions.poehali.dev/681b8831-6c0b-46b6-8535-b010c496917f';

export default function AddOwnerDialog({ adminId, managedListings, onSuccess }: AddOwnerDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    passport_series: '',
    passport_number: '',
    passport_issued_by: '',
    passport_issued_date: '',
    registration_address: '',
    actual_address: '',
    inn: '',
    username: '',
    password: '',
    listing_id: ''
  });

  const handleSubmit = async () => {
    // Валидация
    if (!formData.full_name || !formData.phone) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля: ФИО и телефон',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.username || !formData.password) {
      toast({
        title: 'Ошибка',
        description: 'Заполните логин и пароль для доступа владельца',
        variant: 'destructive'
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Ошибка',
        description: 'Пароль должен содержать минимум 6 символов',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(FUNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manager_id: adminId,
          ...formData,
          listing_id: formData.listing_id ? parseInt(formData.listing_id) : null
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно',
          description: `Владелец "${formData.full_name}" добавлен и получил доступ к системе`
        });
        setOpen(false);
        setFormData({
          full_name: '',
          phone: '',
          email: '',
          passport_series: '',
          passport_number: '',
          passport_issued_by: '',
          passport_issued_date: '',
          registration_address: '',
          actual_address: '',
          inn: '',
          username: '',
          password: '',
          listing_id: ''
        });
        onSuccess();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось добавить владельца',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при добавлении владельца',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      console.log('AddOwnerDialog state changed:', newOpen);
      setOpen(newOpen);
    }}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            console.log('AddOwnerDialog trigger clicked');
            setOpen(true);
          }}
        >
          <Icon name="UserPlus" size={16} className="sm:mr-2" />
          <span className="hidden sm:inline">Добавить владельца</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] w-[95vw] sm:w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить владельца объекта</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Создайте владельца, привяжите к объекту и настройте доступ
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Основная информация */}
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
            <h3 className="font-semibold flex items-center gap-2">
              <Icon name="User" size={18} className="text-blue-600" />
              Основная информация
            </h3>
            
            <div>
              <Label htmlFor="full_name">ФИО владельца *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Иванов Иван Иванович"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+79991234567"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="owner@example.com"
                />
              </div>
            </div>
          </div>

          {/* Паспортные данные */}
          <div className="space-y-4 p-4 border rounded-lg bg-purple-50">
            <h3 className="font-semibold flex items-center gap-2">
              <Icon name="FileText" size={18} className="text-purple-600" />
              Паспортные данные
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="passport_series">Серия паспорта</Label>
                <Input
                  id="passport_series"
                  value={formData.passport_series}
                  onChange={(e) => setFormData({ ...formData, passport_series: e.target.value })}
                  placeholder="1234"
                  maxLength={4}
                />
              </div>
              <div>
                <Label htmlFor="passport_number">Номер паспорта</Label>
                <Input
                  id="passport_number"
                  value={formData.passport_number}
                  onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
                  placeholder="567890"
                  maxLength={6}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="passport_issued_by">Кем выдан</Label>
              <Input
                id="passport_issued_by"
                value={formData.passport_issued_by}
                onChange={(e) => setFormData({ ...formData, passport_issued_by: e.target.value })}
                placeholder="УФМС России по..."
              />
            </div>

            <div>
              <Label htmlFor="passport_issued_date">Дата выдачи</Label>
              <Input
                id="passport_issued_date"
                type="date"
                value={formData.passport_issued_date}
                onChange={(e) => setFormData({ ...formData, passport_issued_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="registration_address">Адрес регистрации</Label>
              <Input
                id="registration_address"
                value={formData.registration_address}
                onChange={(e) => setFormData({ ...formData, registration_address: e.target.value })}
                placeholder="г. Москва, ул. Ленина, д. 1, кв. 1"
              />
            </div>

            <div>
              <Label htmlFor="actual_address">Фактический адрес проживания</Label>
              <Input
                id="actual_address"
                value={formData.actual_address}
                onChange={(e) => setFormData({ ...formData, actual_address: e.target.value })}
                placeholder="г. Москва, ул. Ленина, д. 1, кв. 1"
              />
            </div>

            <div>
              <Label htmlFor="inn">ИНН</Label>
              <Input
                id="inn"
                value={formData.inn}
                onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
                placeholder="123456789012"
                maxLength={12}
              />
            </div>
          </div>

          {/* Привязка к объекту */}
          <div className="space-y-4 p-4 border rounded-lg bg-green-50">
            <h3 className="font-semibold flex items-center gap-2">
              <Icon name="Building" size={18} className="text-green-600" />
              Привязка к объекту
            </h3>
            
            <div>
              <Label htmlFor="listing_id">Объект (необязательно)</Label>
              <Select 
                value={formData.listing_id} 
                onValueChange={(value) => setFormData({ ...formData, listing_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите объект или оставьте пустым" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Без объекта</SelectItem>
                  {managedListings.map((listing) => (
                    <SelectItem key={listing.id} value={listing.id.toString()}>
                      {listing.name} ({listing.district})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Можно привязать позже через редактирование объекта
              </p>
            </div>
          </div>

          {/* Доступ к системе */}
          <div className="space-y-4 p-4 border rounded-lg bg-orange-50">
            <h3 className="font-semibold flex items-center gap-2">
              <Icon name="Key" size={18} className="text-orange-600" />
              Доступ к личному кабинету *
            </h3>
            
            <div>
              <Label htmlFor="username">Логин *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="owner_login"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Владелец будет входить по этому логину
              </p>
            </div>

            <div>
              <Label htmlFor="password">Пароль *</Label>
              <Input
                id="password"
                type="text"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Минимум 6 символов"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Сообщите пароль владельцу после создания
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Создание...
                </>
              ) : (
                <>
                  <Icon name="UserPlus" size={18} className="mr-2" />
                  Создать владельца
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}