import DocumentFilters from './DocumentFilters';
import DocumentsList from './DocumentsList';
import DocumentForm from './DocumentForm';
import { Document } from './DocumentsLibraryConstants';

interface DocumentsLibraryViewProps {
  showAddForm: boolean;
  searchQuery: string;
  filterCategory: string;
  formData: {
    title: string;
    description: string;
    content: string;
    category: Document['category'];
  };
  editingDoc: Document | null;
  filteredDocuments: Document[];
  categoryLabels: Record<string, string>;
  categoryIcons: Record<string, string>;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAddClick: () => void;
  onFormChange: (data: { title: string; description: string; content: string; category: Document['category'] }) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onDownload: (doc: Document) => void;
  onDownloadPdf?: (doc: Document) => void;
  onEdit: (doc: Document) => void;
  onDelete: (id: string) => void;
}

export default function DocumentsLibraryView({
  showAddForm,
  searchQuery,
  filterCategory,
  formData,
  editingDoc,
  filteredDocuments,
  categoryLabels,
  categoryIcons,
  onSearchChange,
  onCategoryChange,
  onAddClick,
  onFormChange,
  onSubmit,
  onCancel,
  onDownload,
  onDownloadPdf,
  onEdit,
  onDelete,
}: DocumentsLibraryViewProps) {
  return (
    <div className="space-y-4">
      {!showAddForm ? (
        <>
          <DocumentFilters
            searchQuery={searchQuery}
            filterCategory={filterCategory}
            categoryLabels={categoryLabels}
            onSearchChange={onSearchChange}
            onCategoryChange={onCategoryChange}
            onAddClick={onAddClick}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            <DocumentsList
              documents={filteredDocuments}
              categoryLabels={categoryLabels}
              categoryIcons={categoryIcons}
              onDownload={onDownload}
              onDownloadPdf={onDownloadPdf}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </>
      ) : (
        <DocumentForm
          formData={formData}
          editingDoc={editingDoc}
          categoryLabels={categoryLabels}
          onFormChange={onFormChange}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      )}
    </div>
  );
}