import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface ManagerLevelCardProps {
  level: string;
  objectsCount: number;
  objectLimit: number;
  balance: number;
}

function getLevelConfig(level: string) {
  switch(level) {
    case 'bronze':
      return {
        name: 'Бронзовый агент',
        emoji: '🥉',
        gradient: 'from-amber-700 via-orange-600 to-amber-700',
        bgGradient: 'from-amber-50 to-orange-50',
        nextLevel: 'Серебряный',
        nextEmoji: '🥈'
      };
    case 'silver':
      return {
        name: 'Серебряный агент',
        emoji: '🥈',
        gradient: 'from-gray-400 via-gray-300 to-gray-400',
        bgGradient: 'from-gray-50 to-slate-50',
        nextLevel: 'Золотой',
        nextEmoji: '🥇'
      };
    case 'gold':
      return {
        name: 'Золотой агент',
        emoji: '🥇',
        gradient: 'from-yellow-400 via-amber-300 to-yellow-400',
        bgGradient: 'from-yellow-50 to-amber-50',
        nextLevel: 'Платиновый',
        nextEmoji: '💎'
      };
    case 'platinum':
      return {
        name: 'Платиновый агент',
        emoji: '💎',
        gradient: 'from-cyan-400 via-blue-400 to-purple-400',
        bgGradient: 'from-cyan-50 to-purple-50',
        nextLevel: 'Максимум',
        nextEmoji: '👑'
      };
    default:
      return {
        name: 'Новичок',
        emoji: '🌟',
        gradient: 'from-gray-400 to-gray-500',
        bgGradient: 'from-gray-50 to-slate-50',
        nextLevel: 'Бронзовый',
        nextEmoji: '🥉'
      };
  }
}

export default function ManagerLevelCard({ level, objectsCount, objectLimit, balance }: ManagerLevelCardProps) {
  const config = getLevelConfig(level);
  const progress = Math.min((objectsCount / objectLimit) * 100, 100);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className={`relative overflow-hidden border-2 bg-gradient-to-br ${config.bgGradient} shadow-2xl`}>
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className={`text-5xl filter drop-shadow-lg`}
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {config.emoji}
              </motion.div>
              <div>
                <motion.h2 
                  className={`text-2xl font-black bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {config.name}
                </motion.h2>
                <p className="text-sm text-muted-foreground font-medium">
                  Уровень: {level === 'platinum' ? 'MAX' : 'Средний'}
                </p>
              </div>
            </div>
            
            <motion.div
              className="text-right"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {balance} ₽
              </div>
              <p className="text-xs text-muted-foreground">Баланс</p>
            </motion.div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold flex items-center gap-1">
                <Icon name="Target" size={14} />
                Прогресс объектов
              </span>
              <span className="font-bold text-purple-600">
                {objectsCount} / {objectLimit}
              </span>
            </div>
            
            <div className="relative">
              <Progress value={progress} className="h-3" />
              <motion.div
                className="absolute top-0 left-0 h-3 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 rounded-full"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{ width: '30%' }}
              />
            </div>
            
            {level !== 'platinum' && (
              <motion.p 
                className="text-xs text-center text-muted-foreground mt-2 flex items-center justify-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Следующий уровень: {config.nextEmoji} {config.nextLevel}
              </motion.p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
