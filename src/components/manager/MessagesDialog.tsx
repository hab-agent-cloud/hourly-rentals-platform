import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface MessagesDialogProps {
  adminId: number;
  role: 'manager' | 'om' | 'um' | 'superadmin';
}

const FUNC_URL = 'https://functions.poehali.dev/43b26aef-407e-4fcb-9a6c-df92bda05452';

export default function MessagesDialog({ adminId, role }: MessagesDialogProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchMessages();
    }
  }, [open]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${FUNC_URL}?admin_id=${adminId}`);
      const data = await response.json();
      
      if (response.ok) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: 'Ошибка',
          description: `Файл ${file.name} слишком большой (макс. 10МБ)`,
          variant: 'destructive'
        });
        return false;
      }
      return true;
    });
    
    setAttachments(prev => [...prev, ...validFiles]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (attachments.length === 0) return [];

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      const UPLOAD_URL = 'https://functions.poehali.dev/3ecc5e66-2ea4-44e6-ac8d-35fdec8dc27e';
      
      for (const file of attachments) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.readAsDataURL(file);
        });

        const base64 = await base64Promise;
        const response = await fetch(UPLOAD_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64,
            filename: file.name
          })
        });

        const data = await response.json();
        if (data.url) {
          uploadedUrls.push(data.url);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки файлов:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить файлы',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }

    return uploadedUrls;
  };

  const handleSend = async () => {
    if (!newMessage.trim() && attachments.length === 0) {
      toast({
        title: 'Ошибка',
        description: 'Введите текст или прикрепите файл',
        variant: 'destructive'
      });
      return;
    }

    setSending(true);
    try {
      const fileUrls = await uploadFiles();
      
      const response = await fetch(FUNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: adminId,
          message: newMessage,
          attachments: fileUrls
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Отправлено',
          description: 'Сообщение отправлено'
        });
        setNewMessage('');
        setAttachments([]);
        setUploadedUrls([]);
        fetchMessages();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось отправить сообщение',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при отправке',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  const getRecipientLabel = () => {
    if (role === 'manager') return 'ОМ (офис-менеджер)';
    if (role === 'om') return 'УМ или суперадмин';
    return 'Вышестоящий руководитель';
  };

  const unreadCount = messages.filter(m => !m.is_read && m.is_incoming).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative px-2">
          <Icon name="MessageCircle" size={16} />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Icon name="MessageCircle" size={20} className="sm:size-6" />
            <span className="truncate">Сообщения с {getRecipientLabel()}</span>
          </DialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Пишите вопросы, получайте задачи и уведомления
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* История сообщений */}
          <ScrollArea className="h-[300px] sm:h-[400px] border rounded-lg p-3 sm:p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Icon name="Loader2" size={32} className="animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="MessageCircle" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Нет сообщений</p>
                <p className="text-sm mt-2">Напишите первое сообщение</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => {
                  const isOverdue = msg.message_type === 'task_overdue';
                  const isTaskCompleted = msg.message_type === 'task_completed';
                  
                  return (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      isOverdue
                        ? 'bg-red-50 border-2 border-red-300'
                        : msg.sender_id === adminId
                        ? 'bg-gray-50 border border-gray-200 ml-12'
                        : isTaskCompleted
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {isOverdue ? (
                          <Icon name="AlertCircle" size={16} className="text-red-600" />
                        ) : isTaskCompleted ? (
                          <Icon name="CheckCircle" size={16} className="text-green-600" />
                        ) : (
                          <Icon 
                            name={msg.sender_id === adminId ? 'ArrowUp' : 'ArrowDown'} 
                            size={16}
                            className={msg.sender_id === adminId ? 'text-gray-600' : 'text-blue-600'}
                          />
                        )}
                        <span className={`font-semibold text-sm ${isOverdue ? 'text-red-700' : ''}`}>
                          {msg.sender_id === adminId ? 'Вы' : msg.sender_name}
                        </span>
                        {!msg.is_read && msg.sender_id !== adminId && (
                          <Badge variant="destructive" className="text-xs">Новое</Badge>
                        )}
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs">ПРОСРОЧЕНО</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className={`text-sm whitespace-pre-wrap ${isOverdue ? 'text-red-800 font-medium' : ''}`}>
                      {msg.message}
                    </p>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.attachments.map((url: string, idx: number) => {
                          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                          return (
                            <div key={idx}>
                              {isImage ? (
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                  <img 
                                    src={url} 
                                    alt="Вложение" 
                                    className="max-w-full max-h-48 rounded border cursor-pointer hover:opacity-80"
                                  />
                                </a>
                              ) : (
                                <a 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                                >
                                  <Icon name="FileText" size={16} />
                                  Скачать файл
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Форма отправки */}
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Send" size={16} />
              <span>Отправить сообщение {getRecipientLabel()}</span>
            </div>
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Напишите ваше сообщение..."
              rows={3}
              disabled={sending || uploading}
            />
            
            {/* Прикрепленные файлы */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Прикрепленные файлы:</p>
                <div className="space-y-1">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border">
                      <div className="flex items-center gap-2">
                        <Icon name={file.type.startsWith('image/') ? 'Image' : 'File'} size={16} />
                        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} КБ)</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveAttachment(idx)}
                        disabled={sending || uploading}
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  disabled={sending || uploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={sending || uploading}
                >
                  <Icon name="Paperclip" size={16} className="mr-2" />
                  Файл
                </Button>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {newMessage.length} / 1000
                </span>
              </div>
              <Button 
                onClick={handleSend}
                disabled={sending || uploading || (!newMessage.trim() && attachments.length === 0)}
              >
                {sending || uploading ? (
                  <>
                    <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                    {uploading ? 'Загрузка...' : 'Отправка...'}
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={18} className="mr-2" />
                    Отправить
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}