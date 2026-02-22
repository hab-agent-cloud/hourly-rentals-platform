import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface FormDataType {
  name?: string;
  address?: string;
  district?: string;
  metro_station?: string;
  type?: string;
  contact_phone?: string;
  contact_telegram?: string;
  square_meters?: string;
  parking_type?: string;
  parking_price_per_hour?: string;
  price_per_day?: string;
  rooms?: { type?: string; price?: number; square_meters?: number; description?: string }[];
}

interface ListingNotesSectionProps {
  notes: string;
  onChange: (value: string) => void;
  formData?: FormDataType;
}

const PARKING_LABELS: Record<string, string> = {
  free: 'бесплатная',
  paid: 'платная',
  street: 'улица / стихийная',
  none: 'нет',
};

function buildBrief(formData?: FormDataType): string {
  const f = formData || {};

  const parking = PARKING_LABELS[f.parking_type || ''] || '';
  const parkingPrice = f.parking_price_per_hour && f.parking_type === 'paid'
    ? f.parking_price_per_hour + ' руб/час'
    : '';

  let roomsBlock = '';
  if (f.rooms && f.rooms.length > 0) {
    roomsBlock = f.rooms.map((r, i) => {
      const lines = [`Зал ${i + 1} — ${r.type || 'название не указано'}:`];
      if (r.square_meters) lines.push(`  Площадь: ${r.square_meters} м²`);
      if (r.price) lines.push(`  Цена: ${r.price} руб/час`);
      lines.push(`  Вместимость: ⚠️ уточнить у владельца`);
      lines.push(`  Что входит: ⚠️ уточнить у владельца`);
      return lines.join('\n');
    }).join('\n\n');
  } else {
    roomsBlock = `Зал 1 — название: ⚠️ уточнить у владельца
  Площадь: 
  Цена: 
  Вместимость: 
  Что входит: `;
  }

  return `=== БРИФ ОБЪЕКТА ===
⚠️ ВНИМАНИЕ МЕНЕДЖЕРУ: данные заполнены автоматически из карточки объекта.
Обязательно сверьте каждый пункт с владельцем и исправьте при необходимости.

📍 ОБЩАЯ ИНФОРМАЦИЯ
Название объекта: ${f.name || '⚠️ уточнить'}
Адрес (точный): ${f.address || '⚠️ уточнить'}
Район / метро / мин. пешком: ${[f.district, f.metro_station].filter(Boolean).join(' / ') || '⚠️ уточнить'}
Тип объекта: ${f.type || '⚠️ уточнить'}

📞 КОНТАКТЫ ВЛАДЕЛЬЦА
Имя владельца: ⚠️ уточнить у владельца
Телефон: ${f.contact_phone || '⚠️ уточнить'}
Telegram: ${f.contact_telegram || '⚠️ уточнить'}
Удобное время для связи: ⚠️ уточнить у владельца

🏠 ОПИСАНИЕ ОБЪЕКТА
Площадь общая (м²): ${f.square_meters || '⚠️ уточнить'}
Количество комнат / залов: ${f.rooms?.length ? f.rooms.length : '⚠️ уточнить'}
Этаж / этажей в здании: ⚠️ уточнить у владельца
Есть лифт: ⚠️ уточнить у владельца
Состояние ремонта: ⚠️ уточнить у владельца

🚗 ПАРКОВКА
Есть парковка: ${parking || '⚠️ уточнить'}
Тип (подземная / наземная / улица): ${parking || '⚠️ уточнить'}
Цена парковки (руб/час): ${parkingPrice || (f.parking_type === 'free' ? 'бесплатно' : '⚠️ уточнить')}
Количество мест: ⚠️ уточнить у владельца

💰 ЦЕНЫ И УСЛОВИЯ
Минимальная аренда (часов): ${f.price_per_day || '⚠️ уточнить'}
Цена в будни (руб/час): ⚠️ уточнить у владельца
Цена в выходные: ⚠️ уточнить у владельца
Цена в праздники: ⚠️ уточнить у владельца
Есть надбавка в дневное время: ⚠️ уточнить у владельца

🛋️ НОМЕРА / ЗАЛЫ
${roomsBlock}

🎁 УДОБСТВА И ФИШКИ
Wi-Fi: ⚠️ уточнить у владельца
Проектор / экран: 
Звук / музыка: 
Кухня / барная зона: 
Мангал / BBQ: 
Баня / сауна: 
Бассейн: 
Кальян: 
Своя посуда: 
Что ещё важного: 

📸 ФОТОГРАФИИ
Фото сделаны: да / нет / нужен фотограф
Ссылка на фото (если есть): 

📝 ДОПОЛНИТЕЛЬНО
Особые условия аренды: 
Что нельзя (шум, алкоголь, животные...): 
Пожелания по тексту объявления: 
`;
}

export default function ListingNotesSection({ notes, onChange, formData }: ListingNotesSectionProps) {
  const [expanded, setExpanded] = useState(true);

  const handleFillBrief = () => {
    if (!notes || notes.trim() === '') {
      onChange(buildBrief(formData));
    }
  };

  return (
    <Card className="border-amber-200 bg-amber-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Icon name="NotebookPen" size={20} />
            Заметки менеджера
          </CardTitle>
          <div className="flex items-center gap-2">
            {(!notes || notes.trim() === '') && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={handleFillBrief}
              >
                <Icon name="ClipboardList" size={14} className="mr-1.5" />
                Заполнить бриф
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-amber-600"
              onClick={() => setExpanded(!expanded)}
            >
              <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
            </Button>
          </div>
        </div>
        <p className="text-xs text-amber-600">
          Видно только менеджерам. Заполните бриф при первом звонке владельцу.
        </p>
      </CardHeader>

      {expanded && (
        <CardContent>
          <Textarea
            value={notes || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Нажмите «Заполнить бриф» чтобы получить шаблон с данными объекта, или пишите заметки в свободной форме..."
            className="min-h-[300px] font-mono text-sm bg-white border-amber-200 focus-visible:ring-amber-400 resize-y"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Сохраняется вместе с объектом по кнопке «Сохранить изменения»
          </p>
        </CardContent>
      )}
    </Card>
  );
}
