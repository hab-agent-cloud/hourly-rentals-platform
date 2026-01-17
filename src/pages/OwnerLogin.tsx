import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import Icon from '@/components/ui/icon';

export default function OwnerLogin() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.ownerLogin(login, password);

      if (response.error) {
        throw new Error(response.error);
      }

      localStorage.setItem('ownerToken', response.token);
      localStorage.setItem('ownerId', response.owner.id.toString());
      localStorage.setItem('ownerData', JSON.stringify(response.owner));

      toast({
        title: 'Вход выполнен',
        description: `Добро пожаловать, ${response.owner.full_name}!`,
      });

      navigate('/owner/dashboard');
    } catch (error: any) {
      toast({
        title: 'Ошибка входа',
        description: error.message || 'Не удалось войти',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img 
            src="https://cdn.poehali.dev/projects/1a35ca30-983f-4a91-b0b4-3c6fa1c9a65b/files/69bb67c0-3011-44dd-8807-0323986ac305.jpg" 
            alt="120 минут" 
            className="h-20 w-20 object-contain mx-auto mb-4"
          />
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Вход для владельцев
          </CardTitle>
          <CardDescription>
            Управляйте своими объявлениями
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">Логин (номер телефона)</Label>
              <Input
                id="login"
                type="text"
                placeholder="89991234567"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Логин выдаёт администратор
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Вход...
                </>
              ) : (
                'Войти'
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <Link to="/owner/forgot-password" className="text-purple-600 hover:underline">
                Забыли пароль?
              </Link>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Нет аккаунта?{' '}
              <Link to="/owner/register" className="text-purple-600 hover:underline">
                Зарегистрироваться
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}