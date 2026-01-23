import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ListingBasicFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function ListingBasicFields({ formData, setFormData }: ListingBasicFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Название *</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Название объекта"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Тип *</label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите тип" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hotel">Отель</SelectItem>
            <SelectItem value="apartment">Апартаменты</SelectItem>
            <SelectItem value="hostel">Хостел</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Город *</label>
        <Input
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          placeholder="Москва"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Район</label>
        <Input
          value={formData.district}
          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
          placeholder="Центральный"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Цена от (₽)</label>
        <Input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          placeholder="1000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Приоритет (Auction) *</label>
        <Input
          type="number"
          value={formData.auction}
          onChange={(e) => setFormData({ ...formData, auction: Number(e.target.value) })}
          placeholder="999"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Адрес</label>
        <Input
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Полный адрес"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Телефон</label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+7 (999) 123-45-67"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="info@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Веб-сайт</label>
        <Input
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Заезд</label>
        <Input
          value={formData.check_in}
          onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
          placeholder="14:00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Выезд</label>
        <Input
          value={formData.check_out}
          onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
          placeholder="12:00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Рейтинг</label>
        <Input
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
          placeholder="4.5"
        />
      </div>
    </div>
  );
}
