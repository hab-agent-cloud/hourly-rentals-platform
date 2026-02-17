import Icon from '@/components/ui/icon';
import DocumentCard from './DocumentCard';

interface Document {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'instruction' | 'contract' | 'regulation' | 'other';
  createdAt: string;
  updatedAt: string;
}

interface DocumentsListProps {
  documents: Document[];
  categoryLabels: Record<string, string>;
  categoryIcons: Record<string, string>;
  onDownload: (doc: Document) => void;
  onDownloadPdf?: (doc: Document) => void;
  onEdit: (doc: Document) => void;
  onDelete: (id: string) => void;
}

export default function DocumentsList({
  documents,
  categoryLabels,
  categoryIcons,
  onDownload,
  onDownloadPdf,
  onEdit,
  onDelete,
}: DocumentsListProps) {
  if (documents.length === 0) {
    return (
      <div className="col-span-2 text-center py-12 text-muted-foreground">
        <Icon name="FileSearch" size={48} className="mx-auto mb-4 opacity-50" />
        <p>Документы не найдены</p>
      </div>
    );
  }

  return (
    <>
      {documents.map(doc => (
        <DocumentCard
          key={doc.id}
          doc={doc}
          categoryLabels={categoryLabels}
          categoryIcons={categoryIcons}
          onDownload={onDownload}
          onDownloadPdf={onDownloadPdf}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}