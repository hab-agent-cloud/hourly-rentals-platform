import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function useManagerAuth() {
  const [adminId, setAdminId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Ошибка авторизации',
        description: 'Токен не найден. Войдите в систему заново.'
      });
      navigate('/admin/login');
      return;
    }
    
    const decoded = decodeJWT(token);
    console.log('[AUTH] Decoded token:', decoded);
    
    if (decoded?.admin_id) {
      setAdminId(decoded.admin_id);
    } else {
      toast({
        variant: 'destructive',
        title: 'Ошибка авторизации',
        description: 'Недействительный токен. Войдите в систему заново.'
      });
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  }, [navigate, toast]);
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };
  
  return { adminId, handleLogout };
}
