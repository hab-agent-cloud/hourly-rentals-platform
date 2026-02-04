import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useDocumentsLibrary } from '@/hooks/useDocumentsLibrary';
import { categoryLabels, categoryIcons } from './documents/DocumentsLibraryConstants';
import DocumentsLibraryView from './documents/DocumentsLibraryView';

interface DocumentsLibraryDialogProps {
  show: boolean;
  onClose: () => void;
  token: string;
}

export default function DocumentsLibraryDialog({
  show,
  onClose,
  token,
}: DocumentsLibraryDialogProps) {
  const {
    filteredDocuments,
    showAddForm,
    setShowAddForm,
    editingDoc,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    formData,
    setFormData,
    handleAddDocument,
    handleUpdateDocument,
    handleDeleteDocument,
    handleDownloadDocument,
    startEdit,
    resetForm,
  } = useDocumentsLibrary(show);

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="Library" size={28} className="text-blue-600" />
            Библиотека документов
          </DialogTitle>
        </DialogHeader>

        <DocumentsLibraryView
          showAddForm={showAddForm}
          searchQuery={searchQuery}
          filterCategory={filterCategory}
          formData={formData}
          editingDoc={editingDoc}
          filteredDocuments={filteredDocuments}
          categoryLabels={categoryLabels}
          categoryIcons={categoryIcons}
          onSearchChange={setSearchQuery}
          onCategoryChange={setFilterCategory}
          onAddClick={() => setShowAddForm(true)}
          onFormChange={setFormData}
          onSubmit={editingDoc ? handleUpdateDocument : handleAddDocument}
          onCancel={resetForm}
          onDownload={handleDownloadDocument}
          onEdit={startEdit}
          onDelete={handleDeleteDocument}
        />
      </DialogContent>
    </Dialog>
  );
}
