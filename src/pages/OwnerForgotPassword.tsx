import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import Icon from '@/components/ui/icon';

export default function OwnerForgotPassword() {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryData, setRecoveryData] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.requestPasswordRecovery(identifier);

      if (response.error) {
        throw new Error(response.error);
      }

      setRecoveryData(response);
      toast({
        title: 'Пароль найден!',
        description: 'Используйте ваш пароль для входа',
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось найти аккаунт',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const maskPassword = (hash: string) => {
    const displayLength = 8;
    return hash.substring(0, displayLength) + '...';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🔑</div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Восстановление пароля
          </CardTitle>
          <CardDescription>
            Введите email или телефон для восстановления доступа
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!recoveryData ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Email или телефон</Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="owner@example.com или +79001234567"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
                    Поиск...
                  </>
                ) : (
                  'Найти пароль'
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <Link to="/owner/login" className="text-purple-600 hover:underline">
                  ← Вернуться к входу
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">✅ Аккаунт найден!</h3>
                <div className="space-y-2 text-sm">
                  {recoveryData.email && (
                    <div>
                      <span className="text-muted-foreground">Email:</span>{' '}
                      <span className="font-mono">{recoveryData.email}</span>
                    </div>
                  )}
                  {recoveryData.phone && (
                    <div>
                      <span className="text-muted-foreground">Телефон:</span>{' '}
                      <span className="font-mono">{recoveryData.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">🔐 Ваш пароль остался прежним</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Используйте тот же пароль, который вы использовали при регистрации.
                  Пароль не изменился.
                </p>
                <div className="text-xs text-muted-foreground font-mono bg-white p-2 rounded border">
                  Hash: {maskPassword(recoveryData.password_hash)}
                </div>
              </div>

              <Link to="/owner/login">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Icon name="LogIn" size={18} className="mr-2" />
                  Войти с моим паролем
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setRecoveryData(null);
                  setIdentifier('');
                }}
              >
                ← Искать другой аккаунт
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
