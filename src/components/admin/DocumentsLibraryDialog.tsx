import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'instruction' | 'contract' | 'regulation' | 'other';
  createdAt: string;
  updatedAt: string;
}

interface DocumentsLibraryDialogProps {
  show: boolean;
  onClose: () => void;
  token: string;
}

const categoryLabels = {
  instruction: 'Инструкция',
  contract: 'Договор',
  regulation: 'Регламент',
  other: 'Прочее',
};

const categoryIcons = {
  instruction: 'BookOpen',
  contract: 'FileText',
  regulation: 'Scale',
  other: 'File',
};

export default function DocumentsLibraryDialog({
  show,
  onClose,
  token,
}: DocumentsLibraryDialogProps) {
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
        setDocuments(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse documents:', e);
      }
    }
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

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="Library" size={28} className="text-blue-600" />
            Библиотека документов
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!showAddForm ? (
            <>
              <div className="flex gap-2">
                <Input
                  placeholder="Поиск документов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 rounded-md border border-input bg-background"
                >
                  <option value="all">Все категории</option>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <Button onClick={() => setShowAddForm(true)}>
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить документ
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                {filteredDocuments.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">
                    <Icon name="FileSearch" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Документы не найдены</p>
                  </div>
                ) : (
                  filteredDocuments.map(doc => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
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
                            onClick={() => handleDownloadDocument(doc)}
                            className="flex-1"
                          >
                            <Icon name="Download" size={14} className="mr-1" />
                            Скачать
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(doc)}
                          >
                            <Icon name="Edit" size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium mb-1">Название документа *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Например: Инструкция для копирайтера"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Категория</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Document['category'] }))}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                >
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Описание</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Краткое описание документа"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Содержимое документа *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full min-h-[300px] px-3 py-2 rounded-md border border-input bg-background font-mono text-sm"
                  placeholder="Введите текст документа..."
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={editingDoc ? handleUpdateDocument : handleAddDocument} className="flex-1">
                  <Icon name={editingDoc ? "Save" : "Plus"} size={18} className="mr-2" />
                  {editingDoc ? 'Сохранить изменения' : 'Добавить документ'}
                </Button>
                <Button onClick={resetForm} variant="outline">
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
