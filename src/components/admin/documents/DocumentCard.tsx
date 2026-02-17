import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface DocumentCardProps {
  doc: Document;
  categoryLabels: Record<string, string>;
  categoryIcons: Record<string, string>;
  onDownload: (doc: Document) => void;
  onDownloadPdf?: (doc: Document) => void;
  onEdit: (doc: Document) => void;
  onDelete: (id: string) => void;
}

export default function DocumentCard({
  doc,
  categoryLabels,
  categoryIcons,
  onDownload,
  onDownloadPdf,
  onEdit,
  onDelete,
}: DocumentCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
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
            onClick={() => onDownload(doc)}
            className="flex-1"
          >
            <Icon name="Download" size={14} className="mr-1" />
            TXT
          </Button>
          {onDownloadPdf && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownloadPdf(doc)}
              className="flex-1"
            >
              <Icon name="FileText" size={14} className="mr-1" />
              PDF
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(doc)}
          >
            <Icon name="Edit" size={14} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(doc.id)}
          >
            <Icon name="Trash2" size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}