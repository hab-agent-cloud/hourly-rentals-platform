import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Document {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'instruction' | 'contract' | 'regulation' | 'other';
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  description: string;
  content: string;
  category: Document['category'];
}

interface DocumentFormProps {
  formData: FormData;
  editingDoc: Document | null;
  categoryLabels: Record<string, string>;
  onFormChange: (formData: FormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function DocumentForm({
  formData,
  editingDoc,
  categoryLabels,
  onFormChange,
  onSubmit,
  onCancel,
}: DocumentFormProps) {
  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div>
        <label className="block text-sm font-medium mb-1">Название документа *</label>
        <Input
          value={formData.title}
          onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
          placeholder="Например: Инструкция для копирайтера"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Категория</label>
        <select
          value={formData.category}
          onChange={(e) => onFormChange({ ...formData, category: e.target.value as Document['category'] })}
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
          onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
          placeholder="Краткое описание документа"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Содержимое документа *</label>
        <textarea
          value={formData.content}
          onChange={(e) => onFormChange({ ...formData, content: e.target.value })}
          className="w-full min-h-[300px] px-3 py-2 rounded-md border border-input bg-background font-mono text-sm"
          placeholder="Введите текст документа..."
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={onSubmit} className="flex-1">
          <Icon name={editingDoc ? "Save" : "Plus"} size={18} className="mr-2" />
          {editingDoc ? 'Сохранить изменения' : 'Добавить документ'}
        </Button>
        <Button onClick={onCancel} variant="outline">
          Отмена
        </Button>
      </div>
    </div>
  );
}
