import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface SearchHeroFeaturesProps {
  selectedFeatures: string[];
  setSelectedFeatures: (value: string[]) => void;
  onFilterChange?: () => void;
}

const popularFeatures = [
  { name: 'Джакузи', icon: 'Bath' },
  { name: 'Кухня', icon: 'ChefHat' },
  { name: 'PlayStation', icon: 'Gamepad2' },
];

export default function SearchHeroFeatures({
  selectedFeatures,
  setSelectedFeatures,
  onFilterChange,
}: SearchHeroFeaturesProps) {
  const toggleFeature = (feature: string) => {
    setSelectedFeatures(
      selectedFeatures.includes(feature)
        ? selectedFeatures.filter(f => f !== feature)
        : [...selectedFeatures, feature]
    );
    onFilterChange?.();
  };

  return (
    <>
      <div className="flex items-center gap-2 mt-2">
        <Icon name="Sparkles" size={16} className="text-purple-600" />
        <span className="text-sm font-semibold text-purple-700">Удобства в номере:</span>
        {selectedFeatures.length > 0 && (
          <button
            onClick={() => setSelectedFeatures([])}
            className="text-xs text-purple-600 hover:text-purple-800 underline"
          >
            Очистить ({selectedFeatures.length})
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {popularFeatures.map((feature) => {
          const isSelected = selectedFeatures.includes(feature.name);
          return (
            <Badge
              key={feature.name}
              variant={isSelected ? "default" : "secondary"}
              className={`cursor-pointer group relative ${isSelected ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'hover:bg-purple-100'}`}
              onClick={() => toggleFeature(feature.name)}
            >
              <Icon name={feature.icon} size={14} className="mr-1" />
              {feature.name}
              {isSelected && (
                <Icon name="X" size={12} className="ml-1" />
              )}
            </Badge>
          );
        })}
      </div>
    </>
  );
}
