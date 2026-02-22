import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AdminListingBasicInfoProps {
  formData: any;
  setFormData: (data: any) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  logoInputRef: React.RefObject<HTMLInputElement>;
  uploadingPhoto: boolean;
  uploadingLogo: boolean;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  owners: any[];
  loadingOwners: boolean;
  listingId?: number;
  onGenerateDescription?: () => void;
  generating?: boolean;
}

export default function AdminListingBasicInfo({
  formData,
  setFormData,
  fileInputRef,
  logoInputRef,
  uploadingPhoto,
  uploadingLogo,
  handlePhotoUpload,
  handleLogoUpload,
  owners,
  loadingOwners,
  listingId,
  onGenerateDescription,
  generating,
}: AdminListingBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Основная информация</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Название</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Тип</label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel">Отель</SelectItem>
                <SelectItem value="apartment">Апартаменты</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Город</label>
            <Input
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Адрес</label>
          <Input
            placeholder="ул. Ленина, 25"
            value={formData.district}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Icon name="Phone" size={16} className="text-green-600" />
              Телефон
              {formData.phone && (
                <Badge variant="secondary" className="ml-auto">
                  <Icon name="Check" size={12} className="mr-1 text-green-600" />
                  Заполнено
                </Badge>
              )}
            </label>
            <Input
              placeholder="+79991234567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={formData.phone ? 'border-green-300 bg-green-50' : ''}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Icon name="Send" size={16} className="text-blue-600" />
              Telegram (username или ссылка)
              {formData.telegram && (
                <Badge variant="secondary" className="ml-auto">
                  <Icon name="Check" size={12} className="mr-1 text-green-600" />
                  Заполнено
                </Badge>
              )}
            </label>
            <Input
              placeholder="@username или https://t.me/username"
              value={formData.telegram}
              onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
              className={formData.telegram ? 'border-blue-300 bg-blue-50' : ''}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
            <Icon name="User" size={16} className="text-purple-600" />
            Владелец объекта
            {formData.owner_id && (
              <Badge variant="secondary" className="ml-auto">
                <Icon name="Check" size={12} className="mr-1 text-green-600" />
                Привязан
              </Badge>
            )}
          </label>
          <Select
            value={formData.owner_id?.toString() || 'none'}
            onValueChange={(value) => setFormData({ ...formData, owner_id: value === 'none' ? null : parseInt(value) })}
            disabled={loadingOwners}
          >
            <SelectTrigger className={formData.owner_id ? 'border-purple-300 bg-purple-50' : ''}>
              <SelectValue placeholder={loadingOwners ? 'Загрузка...' : 'Выберите владельца'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Без владельца</SelectItem>
              {owners.map((owner) => (
                <SelectItem key={owner.id} value={owner.id.toString()}>
                  {owner.name} ({owner.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Описание объекта</label>
            {listingId && onGenerateDescription && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onGenerateDescription}
                disabled={generating}
                className="text-xs h-7"
              >
                {generating ? (
                  <><Icon name="Loader2" size={14} className="mr-1 animate-spin" />Генерация...</>
                ) : (
                  <><Icon name="Sparkles" size={14} className="mr-1" />Сгенерировать</>
                )}
              </Button>
            )}
          </div>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5}
            placeholder="Описание объекта для посетителей..."
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Тип паркинга</label>
          <Select
            value={formData.parking_type}
            onValueChange={(value) => setFormData({ ...formData, parking_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Нет паркинга</SelectItem>
              <SelectItem value="free">Паркинг бесплатный</SelectItem>
              <SelectItem value="paid">Паркинг платный</SelectItem>
              <SelectItem value="street">Стихийная парковка</SelectItem>
            </SelectContent>
          </Select>
          {formData.parking_type === 'paid' && (
            <div className="mt-2">
              <label className="text-sm font-medium mb-1 block">Стоимость паркинга (₽/час)</label>
              <Input
                type="number"
                value={formData.parking_price_per_hour}
                onChange={(e) => setFormData({ ...formData, parking_price_per_hour: parseInt(e.target.value) || 0 })}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Цена (₽/час)</label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Мин. часов</label>
            <Input
              type="number"
              value={formData.min_hours}
              onChange={(e) => setFormData({ ...formData, min_hours: parseInt(e.target.value) })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Позиция</label>
            <Input
              type="number"
              value={formData.auction}
              onChange={(e) => setFormData({ ...formData, auction: parseInt(e.target.value) })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Главное фото</label>
            <div className="flex flex-col gap-3">
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover rounded" />
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e)}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="w-full"
              >
                {uploadingPhoto ? (
                  <>
                    <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Icon name="Upload" size={18} className="mr-2" />
                    Загрузить фото
                  </>
                )}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Логотип (PNG с прозрачностью)</label>
            <div className="flex flex-col gap-3">
              {formData.logo_url && (
                <div className="w-full h-32 border rounded flex items-center justify-center bg-gray-50">
                  <img src={formData.logo_url} alt="Logo" className="max-w-full max-h-full object-contain p-2" />
                </div>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/svg+xml,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingLogo}
                className="w-full"
              >
                {uploadingLogo ? (
                  <>
                    <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Icon name="Upload" size={18} className="mr-2" />
                    Загрузить логотип
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="parking"
              checked={formData.has_parking}
              onChange={(e) => setFormData({ ...formData, has_parking: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="parking" className="text-sm font-medium">Есть парковка</label>
          </div>
          
          <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50 space-y-3">
            <div className="flex items-center gap-2">
              <Icon name="AlertTriangle" size={18} className="text-red-600" />
              <span className="text-sm font-semibold text-red-700">Ценовые предупреждения</span>
            </div>
            
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="priceWarningHolidays"
                checked={formData.price_warning_holidays}
                onChange={(e) => setFormData({ ...formData, price_warning_holidays: e.target.checked })}
                className="w-5 h-5 mt-0.5 cursor-pointer"
              />
              <label htmlFor="priceWarningHolidays" className="text-sm font-medium text-red-700 cursor-pointer flex-1">
                Внимание: Цены в праздничные и выходные дни могут отличаться
              </label>
            </div>
            
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="priceWarningDaytime"
                checked={formData.price_warning_daytime}
                onChange={(e) => setFormData({ ...formData, price_warning_daytime: e.target.checked })}
                className="w-5 h-5 mt-0.5 cursor-pointer"
              />
              <label htmlFor="priceWarningDaytime" className="text-sm font-medium text-red-700 cursor-pointer flex-1">
                Цены указаны на дневной тариф
              </label>
            </div>
            
            <p className="text-xs text-red-600">
              Эти отметки будут показаны красным цветом на странице объекта
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}