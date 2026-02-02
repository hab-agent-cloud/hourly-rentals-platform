import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'instruction' | 'contract' | 'regulation' | 'other';
  createdAt: string;
  updatedAt: string;
}

interface DocumentsLibraryDialogProps {
  show: boolean;
  onClose: () => void;
  token: string;
}

const categoryLabels = {
  instruction: 'Инструкция',
  contract: 'Договор',
  regulation: 'Регламент',
  other: 'Прочее',
};

const categoryIcons = {
  instruction: 'BookOpen',
  contract: 'FileText',
  regulation: 'Scale',
  other: 'File',
};

export default function DocumentsLibraryDialog({
  show,
  onClose,
  token,
}: DocumentsLibraryDialogProps) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'instruction' as Document['category'],
  });

  useEffect(() => {
    if (show) {
      loadDocuments();
    }
  }, [show]);

  const loadDocuments = () => {
    const stored = localStorage.getItem('documents_library');
    if (stored) {
      try {
        const docs = JSON.parse(stored);
        setDocuments(docs);
        
        // Проверяем, есть ли уже инструкция для стажёров
        const hasTraineeInstruction = docs.some((doc: Document) => 
          doc.title === 'Инструкция для стажёров-копирайтеров'
        );
        
        // Если нет - добавляем автоматически
        if (!hasTraineeInstruction) {
          addTraineeInstruction(docs);
        }
      } catch (e) {
        console.error('Failed to parse documents:', e);
        // Если ошибка парсинга - создаём инструкцию
        addTraineeInstruction([]);
      }
    } else {
      // Если библиотека пустая - добавляем инструкцию
      addTraineeInstruction([]);
    }
  };

  const addTraineeInstruction = (existingDocs: Document[]) => {
    const instructionContent = `ИНСТРУКЦИЯ ДЛЯ КОПИРАЙТЕРА
Добро пожаловать в программу "Копирайтер"!
========================================

📋 ОБЩАЯ ИНФОРМАЦИЯ
------------------
Вы подключены к программе "Копирайтер" — это возможность заработать, добавляя объекты размещения на наш сайт.

🔐 ВХОД В СИСТЕМУ
-----------------
1. Откройте главную страницу сайта
2. Прокрутите страницу вниз до подвала сайта
3. Найдите и нажмите кнопку входа в админ-панель
4. Введите логин и пароль (получите у менеджера)
5. Ознакомьтесь с интерфейсом личного кабинета

💰 УСЛОВИЯ ОПЛАТЫ
-----------------
Ваш заработок зависит от типа объекта:

• Добавление отеля с несколькими категориями номеров: 200 ₽ за объект
• Добавление апартамента: 100 ₽ за объект

Оплата производится после проверки и одобрения объектов модератором.

📊 ПЛАН РАБОТЫ ПО ГОРОДАМ
--------------------------
Перед добавлением объектов выберите город, которого ЕЩЁ НЕТ на сайте.

Количество объектов для добавления зависит от населения города:
• До 200 000 жителей → 20 объектов
• От 200 000 до 1 000 000 → 50 объектов  
• От 1 000 000 до 2 000 000 → 100 объектов
• Более 2 000 000 → 200 объектов

🔍 ПОИСК ОБЪЕКТОВ
-----------------
Перед добавлением объекта на сайт необходимо найти:
✓ Объект с качественными фотографиями
✓ Контактный телефон собственника
✓ Адрес объекта

ВАЖНО! Фотографии с водяными знаками ЗАПРЕЩЕНЫ!
Исключение: если водяной знак внизу фото — обрежьте его в Paint.

💡 РЕКОМЕНДАЦИЯ: Создайте на рабочем столе папку "Отели и Апартаменты" для удобства работы.

➕ ДОБАВЛЕНИЕ ОБЪЕКТА
---------------------
1. Войдите в личный кабинет
2. Перейдите в раздел "Объекты"
3. Нажмите кнопку "Добавить объект"

📝 ЗАПОЛНЕНИЕ ОСНОВНОЙ ФОРМЫ:
-----------------------------
• Название объекта (например: "Отель Комфорт")
• Тип объекта: Отель / Апартаменты / Хостел
• Город и район
• Адрес (полный, с указанием улицы и дома)
• Телефон собственника (обязательно!)
• Telegram (если есть)
• Владелец объекта: выберите "Без владельца"
• Паркинг: укажите при наличии

💵 РАЗДЕЛ "ЦЕНА - МИН.ЧАСОВ - ПОЗИЦИЯ":
---------------------------------------
• Цена: указывается за ОДИН ЧАС
• Минимум часов: укажите минимальное время аренды (обычно 2 часа)
  ВАЖНО! 90% собственников предпочитают сдачу от 2 часов
• Позицию: НЕ ТРОГАЙТЕ (оставьте по умолчанию)

📸 ЗАГРУЗКА ФОТОГРАФИЙ:
-----------------------
• Главное фото объекта: выберите самую привлекательную фотографию
• Логотип: загрузите при наличии

🏨 КАТЕГОРИИ НОМЕРОВ
--------------------
Это САМАЯ ВАЖНАЯ часть! Здесь вы создаёте карточки номеров.

Для каждой категории укажите:
• Название номера (Эконом, Стандарт, Комфорт, Полулюкс, Люкс)
• Цена за час
• Площадь (примерная):
  - Эконом: ~12 кв.м
  - Стандарт/Комфорт: 15-18 кв.м
  - Улучшенный/Полулюкс: 25-30 кв.м
  - Люкс: 30-45 кв.м

⏰ ВРЕМЯ АРЕНДЫ КАТЕГОРИИ:
--------------------------
Укажите минимальное количество часов для ЭТОЙ конкретной категории.
У разных номеров могут быть разные условия!

💳 МЕТОД ОПЛАТЫ И УСЛОВИЯ ОТМЕНЫ:
----------------------------------
ПРОПУСТИТЕ эти поля! Точные правила пропишет менеджер после уточнения у владельца.

🛏️ УДОБСТВА В НОМЕРЕ:
---------------------
Проставьте МИНИМУМ удобств (только то, что точно есть).
Менеджер добавит подробности после общения с владельцем.

Основные удобства:
✓ WiFi
✓ Двуспальная кровать / 2 односпальные
✓ Телевизор / Смарт ТВ
✓ Кондиционер
✓ Душевая кабина / Ванная
✓ Холодильник
✓ Чайник
✓ Фен

📷 ФОТОГРАФИИ НОМЕРА:
---------------------
Загрузите 3-5 качественных фотографий номера:
• Общий вид комнаты
• Кровать
• Ванная комната
• Дополнительные удобства

Вы можете:
• Загружать несколько фото сразу
• Менять порядок фотографий (перетаскиванием)
• Заменять фото (нажмите на фото → выберите новое)
• Удалять ненужные фото

✏️ РЕДАКТИРОВАНИЕ КАТЕГОРИЙ:
-----------------------------
После создания категории вы можете:
• Изменить информацию (кнопка "Редактировать")
• Дублировать категорию для создания похожей (кнопка "Дублировать")
• Удалить категорию (кнопка "Удалить")
• Изменить порядок категорий (перетащите за значок ≡)

⚠️ ВАЖНО! ПОРЯДОК ДЕЙСТВИЙ:
----------------------------
1. Заполните ВСЕ поля категории номера
2. Нажмите "Добавить категорию" ✓
3. Добавьте другие категории (если нужно)
4. Только после этого нажмите "СОХРАНИТЬ" внизу формы!

Если не нажать "Добавить категорию" — данные не сохранятся!

✅ ОТПРАВКА НА МОДЕРАЦИЮ
------------------------
После нажатия кнопки "Сохранить":
• Объект автоматически отправится на проверку
• Вы увидите уведомление "Объект отправлен в отдел модерации"
• Статус объекта изменится на "На модерации"
• После проверки модератором вам начислится оплата

📊 ОТСЛЕЖИВАНИЕ ЗАРАБОТКА
-------------------------
В личном кабинете есть вкладка "Мой заработок", где вы можете:
• Посмотреть общую сумму заработка
• Увидеть выплаченные суммы
• Проверить суммы к выплате
• Посмотреть историю всех действий

❓ ЧАСТЫЕ ВОПРОСЫ
-----------------
В: Что делать, если не могу найти нужный город?
О: Напишите менеджеру — город будет добавлен в систему.

В: Можно ли редактировать уже добавленный объект?
О: Да! Найдите объект в списке и нажмите "Редактировать".

В: Когда придёт оплата?
О: Оплата производится после одобрения объектов модератором.

В: Сколько объектов можно добавить за день?
О: Ограничений нет! Работайте в удобном темпе.

📞 ТЕХНИЧЕСКАЯ ПОДДЕРЖКА
------------------------
При возникновении вопросов или технических проблем:
• Свяжитесь с менеджером
• Опишите проблему максимально подробно
• Приложите скриншот (если возможно)

🎯 СОВЕТЫ ДЛЯ ЭФФЕКТИВНОЙ РАБОТЫ
---------------------------------
✓ Работайте последовательно — город за городом
✓ Проверяйте качество фотографий перед загрузкой
✓ Указывайте точную информацию
✓ Перечитывайте данные перед сохранением
✓ Сохраняйте контакты собственников для связи менеджера

🚀 ЖЕЛАЕМ УСПЕШНОЙ РАБОТЫ И ХОРОШИХ ЗАРАБОТКОВ!
===============================================

Версия инструкции: 1.0
Дата: ${new Date().toLocaleDateString('ru-RU')}`;

    const newInstruction: Document = {
      id: 'trainee-instruction-' + Date.now(),
      title: 'Инструкция для стажёров-копирайтеров',
      description: 'Полное руководство по добавлению объектов размещения на сайт. Условия оплаты, пошаговые инструкции, частые вопросы.',
      content: instructionContent,
      category: 'instruction',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedDocs = [...existingDocs, newInstruction];
    localStorage.setItem('documents_library', JSON.stringify(updatedDocs));
    setDocuments(updatedDocs);
  };

  const saveDocuments = (docs: Document[]) => {
    localStorage.setItem('documents_library', JSON.stringify(docs));
    setDocuments(docs);
  };

  const handleAddDocument = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заполните название и содержимое документа',
        variant: 'destructive',
      });
      return;
    }

    const newDoc: Document = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveDocuments([...documents, newDoc]);
    resetForm();
    toast({
      title: 'Успешно',
      description: 'Документ добавлен в библиотеку',
    });
  };

  const handleUpdateDocument = () => {
    if (!editingDoc || !formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заполните название и содержимое документа',
        variant: 'destructive',
      });
      return;
    }

    const updated = documents.map(doc =>
      doc.id === editingDoc.id
        ? { ...doc, ...formData, updatedAt: new Date().toISOString() }
        : doc
    );

    saveDocuments(updated);
    resetForm();
    toast({
      title: 'Успешно',
      description: 'Документ обновлён',
    });
  };

  const handleDeleteDocument = (id: string) => {
    if (!confirm('Удалить документ из библиотеки?')) return;
    
    saveDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: 'Успешно',
      description: 'Документ удалён',
    });
  };

  const handleDownloadDocument = (doc: Document) => {
    const blob = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zа-яё0-9]/gi, '_')}_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const startEdit = (doc: Document) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      description: doc.description,
      content: doc.content,
      category: doc.category,
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      category: 'instruction',
    });
    setEditingDoc(null);
    setShowAddForm(false);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="Library" size={28} className="text-blue-600" />
            Библиотека документов
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!showAddForm ? (
            <>
              <div className="flex gap-2">
                <Input
                  placeholder="Поиск документов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 rounded-md border border-input bg-background"
                >
                  <option value="all">Все категории</option>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <Button onClick={() => setShowAddForm(true)}>
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить документ
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                {filteredDocuments.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">
                    <Icon name="FileSearch" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Документы не найдены</p>
                  </div>
                ) : (
                  filteredDocuments.map(doc => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <Icon 
                              name={categoryIcons[doc.category]} 
                              size={24} 
                              className="text-blue-600 mt-1" 
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg mb-1 truncate">{doc.title}</h3>
                              <Badge variant="outline" className="mb-2">
                                {categoryLabels[doc.category]}
                              </Badge>
                              {doc.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {doc.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground mb-3">
                          Создан: {new Date(doc.createdAt).toLocaleString('ru-RU')}
                          {doc.updatedAt !== doc.createdAt && (
                            <> • Обновлён: {new Date(doc.updatedAt).toLocaleString('ru-RU')}</>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadDocument(doc)}
                            className="flex-1"
                          >
                            <Icon name="Download" size={14} className="mr-1" />
                            Скачать
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(doc)}
                          >
                            <Icon name="Edit" size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium mb-1">Название документа *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Например: Инструкция для копирайтера"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Категория</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Document['category'] }))}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                >
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Описание</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Краткое описание документа"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Содержимое документа *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full min-h-[300px] px-3 py-2 rounded-md border border-input bg-background font-mono text-sm"
                  placeholder="Введите текст документа..."
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={editingDoc ? handleUpdateDocument : handleAddDocument} className="flex-1">
                  <Icon name={editingDoc ? "Save" : "Plus"} size={18} className="mr-2" />
                  {editingDoc ? 'Сохранить изменения' : 'Добавить документ'}
                </Button>
                <Button onClick={resetForm} variant="outline">
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}