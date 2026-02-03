import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface DocumentFiltersProps {
  searchQuery: string;
  filterCategory: string;
  categoryLabels: Record<string, string>;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onAddClick: () => void;
}

export default function DocumentFilters({
  searchQuery,
  filterCategory,
  categoryLabels,
  onSearchChange,
  onCategoryChange,
  onAddClick,
}: DocumentFiltersProps) {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Поиск документов..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
      <select
        value={filterCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-3 rounded-md border border-input bg-background"
      >
        <option value="all">Все категории</option>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
      <Button onClick={onAddClick}>
        <Icon name="Plus" size={18} className="mr-2" />
        Добавить документ
      </Button>
    </div>
  );
}
