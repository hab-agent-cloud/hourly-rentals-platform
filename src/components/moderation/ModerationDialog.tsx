import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Listing {
  id: number;
  title: string;
  city: string;
  district: string;
}

interface ModerationDialogProps {
  listing: Listing | null;
  moderationStatus: 'approved' | 'rejected' | 'pending';
  moderationComment: string;
  onClose: () => void;
  onStatusChange: (status: 'approved' | 'rejected' | 'pending') => void;
  onCommentChange: (comment: string) => void;
  onSubmit: () => void;
}

export default function ModerationDialog({
  listing,
  moderationStatus,
  moderationComment,
  onClose,
  onStatusChange,
  onCommentChange,
  onSubmit,
}: ModerationDialogProps) {
  return (
    <Dialog open={!!listing} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Модерация объекта</DialogTitle>
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
              <label className="text-sm font-medium">Статус модерации</label>
              <div className="flex gap-2">
                <Button
                  variant={moderationStatus === 'approved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onStatusChange('approved')}
                  className="flex-1"
                >
                  <Icon name="CheckCircle" size={16} className="mr-2" />
                  Одобрить
                </Button>
                <Button
                  variant={moderationStatus === 'rejected' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => onStatusChange('rejected')}
                  className="flex-1"
                >
                  <Icon name="XCircle" size={16} className="mr-2" />
                  Отклонить
                </Button>
                <Button
                  variant={moderationStatus === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onStatusChange('pending')}
                  className="flex-1"
                >
                  <Icon name="Clock" size={16} className="mr-2" />
                  На проверке
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Комментарий {moderationStatus === 'rejected' && <span className="text-red-500">(обязательно)</span>}
              </label>
              <Textarea
                value={moderationComment}
                onChange={(e) => onCommentChange(e.target.value)}
                placeholder={
                  moderationStatus === 'rejected'
                    ? 'Укажите причину отклонения...'
                    : 'Добавьте комментарий (необязательно)...'
                }
                rows={4}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button
            onClick={onSubmit}
            disabled={moderationStatus === 'rejected' && !moderationComment.trim()}
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
