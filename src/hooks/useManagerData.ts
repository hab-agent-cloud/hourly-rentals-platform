import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const FUNC_URLS = {
  managerData: 'https://functions.poehali.dev/ccbc7231-4004-46e0-9caa-8afc6d0fa9db',
  paymentHistory: 'https://functions.poehali.dev/e3d0194a-0a92-4570-ad62-6c0a6308045b'
};

interface ManagerData {
  name: string;
  role: string;
  level?: string;
  objects_count?: number;
  object_limit?: number;
  balance: number;
  month_commission?: number;
  total_owner_payments?: number;
  subscription_active?: boolean;
  total_objects?: number;
  week_tasks_completed?: number;
  om_rank?: number | string;
  manager_rank?: number | string;
  total_listings?: number;
  total_earned?: number;
  pending_withdrawals?: number;
  copywriter_earnings?: string | number;
}

interface PaymentHistory {
  payments?: Array<Record<string, unknown>>;
}

export function useManagerData(adminId: number | null) {
  const [managerData, setManagerData] = useState<ManagerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const fetchManagerData = async () => {
    try {
      console.log('[MANAGER] Загрузка данных для admin_id:', adminId);
      const response = await fetch(`${FUNC_URLS.managerData}?admin_id=${adminId}`);
      console.log('[MANAGER] Ответ получен, status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            variant: 'destructive',
            title: 'Ошибка авторизации',
            description: 'Сессия истекла. Войдите в систему заново.'
          });
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[MANAGER] Данные получены:', data);
      
      if (data.error) {
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: data.error
        });
        return;
      }
      
      setManagerData(data);
    } catch (error) {
      console.error('[MANAGER] Ошибка загрузки данных:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка загрузки данных',
        description: 'Не удалось загрузить данные. Попробуйте позже.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch(`${FUNC_URLS.paymentHistory}?manager_id=${adminId}`);
      const data = await response.json();
      setPaymentHistory(data);
    } catch (error) {
      console.error('[PAYMENT HISTORY] Ошибка:', error);
    }
  };

  useEffect(() => {
    if (adminId) {
      fetchManagerData();
      fetchPaymentHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminId]);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await Promise.all([fetchManagerData(), fetchPaymentHistory()]);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchEndY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = () => {
    if (window.scrollY === 0) {
      const pullDistance = touchEndY.current - touchStartY.current;
      if (pullDistance > 100) {
        handleRefresh();
      }
    }
    touchStartY.current = 0;
    touchEndY.current = 0;
  };
  
  return {
    managerData,
    loading,
    paymentHistory,
    refreshing,
    fetchManagerData,
    fetchPaymentHistory,
    handleRefresh,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}
