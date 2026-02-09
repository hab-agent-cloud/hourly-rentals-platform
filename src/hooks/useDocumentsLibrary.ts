import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Document, getTraineeInstructionContent, getManagerSalesScriptContent, getBusinessPlan2026Content } from '@/components/admin/documents/DocumentsLibraryConstants';

export function useDocumentsLibrary(show: boolean) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'instruction' as Document['category'],
  });

  useEffect(() => {
    if (show) {
      loadDocuments();
    }
  }, [show]);

  const loadDocuments = () => {
    const stored = localStorage.getItem('documents_library');
    if (stored) {
      try {
        const docs = JSON.parse(stored);
        setDocuments(docs);
        
        const hasTraineeInstruction = docs.some((doc: Document) => 
          doc.title === 'Инструкция для стажёров-копирайтеров'
        );
        const hasManagerSalesScript = docs.some((doc: Document) =>
          doc.title === 'Скрипты продаж для менеджеров'
        );
        const hasBusinessPlan = docs.some((doc: Document) =>
          doc.title === 'Бизнес-план проекта 120 МИНУТ на 2026 год'
        );
        
        if (!hasTraineeInstruction) {
          addTraineeInstruction(docs);
        }
        if (!hasManagerSalesScript) {
          addManagerSalesScript(docs);
        }
        if (!hasBusinessPlan) {
          addBusinessPlan(docs);
        }
      } catch (e) {
        console.error('Failed to parse documents:', e);
        const emptyDocs: Document[] = [];
        addTraineeInstruction(emptyDocs);
        addManagerSalesScript(emptyDocs);
      }
    } else {
      const emptyDocs: Document[] = [];
      addTraineeInstruction(emptyDocs);
      addManagerSalesScript(emptyDocs);
      addBusinessPlan(emptyDocs);
    }
  };

  const addTraineeInstruction = (existingDocs: Document[]) => {
    const instructionContent = getTraineeInstructionContent();

    const newInstruction: Document = {
      id: 'trainee-instruction-' + Date.now(),
      title: 'Инструкция для стажёров-копирайтеров',
      description: 'Полное руководство по добавлению объектов размещения на сайт. Условия оплаты, пошаговые инструкции, частые вопросы.',
      content: instructionContent,
      category: 'instruction',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedDocs = [...existingDocs, newInstruction];
    localStorage.setItem('documents_library', JSON.stringify(updatedDocs));
    setDocuments(updatedDocs);
  };

  const addManagerSalesScript = (existingDocs: Document[]) => {
    const scriptContent = getManagerSalesScriptContent();

    const newScript: Document = {
      id: 'manager-sales-script-' + Date.now(),
      title: 'Скрипты продаж для менеджеров',
      description: 'Готовые скрипты, возражения, техники мотивации владельцев к размещению и оплате подписки',
      content: scriptContent,
      category: 'instruction',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const stored = localStorage.getItem('documents_library');
    let currentDocs = existingDocs;
    
    if (stored) {
      try {
        currentDocs = JSON.parse(stored);
      } catch (e) {
        currentDocs = existingDocs;
      }
    }

    const updatedDocs = [...currentDocs, newScript];
    localStorage.setItem('documents_library', JSON.stringify(updatedDocs));
    setDocuments(updatedDocs);
  };

  const addBusinessPlan = (existingDocs: Document[]) => {
    const planContent = getBusinessPlan2026Content();

    const newPlan: Document = {
      id: 'business-plan-2026-' + Date.now(),
      title: 'Бизнес-план проекта 120 МИНУТ на 2026 год',
      description: 'Финансовые прогнозы, модель монетизации, структура расходов, команда менеджеров, драйверы роста, метрики KPI',
      content: planContent,
      category: 'business',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const stored = localStorage.getItem('documents_library');
    let currentDocs = existingDocs;
    
    if (stored) {
      try {
        currentDocs = JSON.parse(stored);
      } catch (e) {
        currentDocs = existingDocs;
      }
    }

    const updatedDocs = [...currentDocs, newPlan];
    localStorage.setItem('documents_library', JSON.stringify(updatedDocs));
    setDocuments(updatedDocs);
  };

  const saveDocuments = (docs: Document[]) => {
    localStorage.setItem('documents_library', JSON.stringify(docs));
    setDocuments(docs);
  };

  const handleAddDocument = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заполните название и содержимое документа',
        variant: 'destructive',
      });
      return;
    }

    const newDoc: Document = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveDocuments([...documents, newDoc]);
    resetForm();
    toast({
      title: 'Успешно',
      description: 'Документ добавлен в библиотеку',
    });
  };

  const handleUpdateDocument = () => {
    if (!editingDoc || !formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заполните название и содержимое документа',
        variant: 'destructive',
      });
      return;
    }

    const updated = documents.map(doc =>
      doc.id === editingDoc.id
        ? { ...doc, ...formData, updatedAt: new Date().toISOString() }
        : doc
    );

    saveDocuments(updated);
    resetForm();
    toast({
      title: 'Успешно',
      description: 'Документ обновлён',
    });
  };

  const handleDeleteDocument = (id: string) => {
    if (!confirm('Удалить документ из библиотеки?')) return;
    
    saveDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: 'Успешно',
      description: 'Документ удалён',
    });
  };

  const handleDownloadDocument = (doc: Document) => {
    const blob = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zа-яё0-9]/gi, '_')}_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const startEdit = (doc: Document) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      description: doc.description,
      content: doc.content,
      category: doc.category,
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      category: 'instruction',
    });
    setEditingDoc(null);
    setShowAddForm(false);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return {
    documents,
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
  };
}