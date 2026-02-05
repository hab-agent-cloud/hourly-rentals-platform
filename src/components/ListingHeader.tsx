import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ThemeSwitcher from '@/components/ThemeSwitcher';

interface ListingHeaderProps {
  title: string;
  city: string;
  district: string;
  logoUrl?: string;
  onBack: () => void;
}

export default function ListingHeader({ title, city, district, logoUrl, onBack }: ListingHeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-purple-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">{city}, {district}</p>
          </div>
          <ThemeSwitcher />
          {logoUrl && (
            <div className="w-16 h-16 border rounded-lg bg-white p-1 flex items-center justify-center">
              <img src={logoUrl} alt={`${title} logo`} className="max-w-full max-h-full object-contain" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}