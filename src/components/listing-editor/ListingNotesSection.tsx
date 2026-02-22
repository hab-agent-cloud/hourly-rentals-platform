import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const BRIEF_TEMPLATE = `=== БРИФ ОБЪЕКТА ===

📍 ОБЩАЯ ИНФОРМАЦИЯ
Название объекта: 
Адрес (точный): 
Район / метро / мин. пешком: 
Тип объекта (квартира, студия, лофт...): 

📞 КОНТАКТЫ ВЛАДЕЛЬЦА
Имя владельца: 
Телефон: 
Telegram: 
Удобное время для связи: 

🏠 ОПИСАНИЕ ОБЪЕКТА
Площадь общая (м²): 
Количество комнат / залов: 
Этаж / этажей в здании: 
Есть лифт: 
Состояние ремонта: 

🚗 ПАРКОВКА
Есть парковка: да / нет
Тип (подземная / наземная / улица): 
Цена парковки (руб/час): 
Количество мест: 

💰 ЦЕНЫ И УСЛОВИЯ
Минимальная аренда (часов): 
Цена в будни (руб/час): 
Цена в выходные: 
Цена в праздники: 
Есть надбавка в дневное время: да / нет

🛋️ НОМЕРА / ЗАЛЫ
Зал 1 — название: 
  Площадь: 
  Цена: 
  Вместимость: 
  Что входит: 

Зал 2 — название: 
  Площадь: 
  Цена: 
  Вместимость: 
  Что входит: 

🎁 УДОБСТВА И ФИШКИ
Wi-Fi: 
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

interface ListingNotesSectionProps {
  notes: string;
  onChange: (value: string) => void;
}

export default function ListingNotesSection({ notes, onChange }: ListingNotesSectionProps) {
  const [expanded, setExpanded] = useState(true);

  const handleFillBrief = () => {
    if (!notes || notes.trim() === '') {
      onChange(BRIEF_TEMPLATE);
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
            placeholder="Нажмите «Заполнить бриф» чтобы получить шаблон опросника, или пишите заметки в свободной форме..."
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
