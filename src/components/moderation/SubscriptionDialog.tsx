import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Listing {
  id: number;
  title: string;
  city: string;
  district: string;
}

interface SubscriptionDialogProps {
  listing: Listing | null;
  subscriptionDays: number;
  open: boolean;
  onClose: () => void;
  onDaysChange: (days: number) => void;
  onSubmit: () => void;
}

export default function SubscriptionDialog({
  listing,
  subscriptionDays,
  open,
  onClose,
  onDaysChange,
  onSubmit,
}: SubscriptionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Установить подписку</DialogTitle>
        </DialogHeader>
        
        {listing && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{listing.title}</h4>
              <p className="text-sm text-muted-foreground">
                {listing.city}, {listing.district}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Количество дней</label>
              <Input
                type="number"
                min="1"
                value={subscriptionDays}
                onChange={(e) => onDaysChange(parseInt(e.target.value) || 30)}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={onSubmit}>
            Установить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
