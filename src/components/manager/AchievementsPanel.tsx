import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface AchievementsPanelProps {
  objectsCount: number;
  balance: number;
  monthCommission: number;
  onBalanceUpdate?: () => void;
}

export default function AchievementsPanel({ objectsCount, balance, monthCommission, onBalanceUpdate }: AchievementsPanelProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [celebratedAchievements, setCelebratedAchievements] = useState<Set<string>>(new Set());

  const fireConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const achievements: Achievement[] = [
    {
      id: 'first_object',
      title: 'Первый шаг',
      description: 'Добавьте первый объект (+1000₽)',
      emoji: '🏠',
      unlocked: objectsCount >= 1
    },
    {
      id: 'five_objects',
      title: 'Пятёрочка',
      description: 'Управляйте 5 объектами (+1000₽)',
      emoji: '🎯',
      unlocked: objectsCount >= 5,
      progress: Math.min(objectsCount, 5),
      maxProgress: 5
    },
    {
      id: 'ten_objects',
      title: 'Десятка',
      description: 'Управляйте 10 объектами (+1000₽)',
      emoji: '🔟',
      unlocked: objectsCount >= 10,
      progress: Math.min(objectsCount, 10),
      maxProgress: 10
    },
    {
      id: 'twenty_objects',
      title: 'Двадцатка',
      description: 'Достигните 20 объектов (+1000₽)',
      emoji: '🚀',
      unlocked: objectsCount >= 20,
      progress: Math.min(objectsCount, 20),
      maxProgress: 20
    },
    {
      id: 'thirty_objects',
      title: 'Тридцатка',
      description: 'Достигните 30 объектов (+1000₽)',
      emoji: '⚡',
      unlocked: objectsCount >= 30,
      progress: Math.min(objectsCount, 30),
      maxProgress: 30
    },
    {
      id: 'fifty_objects',
      title: 'Золотая пятёрка',
      description: 'Достигните 50 объектов (+1000₽)',
      emoji: '⭐',
      unlocked: objectsCount >= 50,
      progress: Math.min(objectsCount, 50),
      maxProgress: 50
    },
    {
      id: 'hundred_objects',
      title: 'Сотня!',
      description: 'Управляйте 100 объектами (+1000₽)',
      emoji: '💯',
      unlocked: objectsCount >= 100,
      progress: Math.min(objectsCount, 100),
      maxProgress: 100
    },
    {
      id: 'first_money',
      title: 'Первая прибыль',
      description: 'Заработайте первые деньги (+1000₽)',
      emoji: '💰',
      unlocked: balance > 0
    },
    {
      id: 'ten_thousand',
      title: 'Десятка тысяч',
      description: 'Накопите 10 000 ₽ (+1000₽)',
      emoji: '💵',
      unlocked: balance >= 10000,
      progress: Math.min(balance, 10000),
      maxProgress: 10000
    },
    {
      id: 'fifty_thousand',
      title: 'Полсотни',
      description: 'Накопите 50 000 ₽ (+1000₽)',
      emoji: '💸',
      unlocked: balance >= 50000,
      progress: Math.min(balance, 50000),
      maxProgress: 50000
    },
    {
      id: 'big_earner',
      title: 'Крупный заработок',
      description: 'Накопите 100 000 ₽ (+1000₽)',
      emoji: '💎',
      unlocked: balance >= 100000,
      progress: Math.min(balance, 100000),
      maxProgress: 100000
    },
    {
      id: 'half_million',
      title: 'Полумиллион',
      description: 'Накопите 500 000 ₽ (+1000₽)',
      emoji: '👑',
      unlocked: balance >= 500000,
      progress: Math.min(balance, 500000),
      maxProgress: 500000
    },
    {
      id: 'month_profit',
      title: 'Месячный старт',
      description: 'Заработайте 10 000 ₽ за месяц (+1000₽)',
      emoji: '🔥',
      unlocked: monthCommission >= 10000,
      progress: Math.min(monthCommission, 10000),
      maxProgress: 10000
    },
    {
      id: 'month_50k',
      title: 'Месячный рекорд',
      description: 'Заработайте 50 000 ₽ за месяц (+1000₽)',
      emoji: '🌟',
      unlocked: monthCommission >= 50000,
      progress: Math.min(monthCommission, 50000),
      maxProgress: 50000
    },
    {
      id: 'month_100k',
      title: 'Месячный лидер',
      description: 'Заработайте 100 000 ₽ за месяц (+1000₽)',
      emoji: '🏆',
      unlocked: monthCommission >= 100000,
      progress: Math.min(monthCommission, 100000),
      maxProgress: 100000
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  useEffect(() => {
    const checkAndAwardAchievements = async () => {
      const adminId = localStorage.getItem('adminId');
      if (!adminId) return;

      for (const achievement of achievements) {
        if (achievement.unlocked && !celebratedAchievements.has(achievement.id)) {
          setCelebratedAchievements(prev => new Set(prev).add(achievement.id));
          
          try {
            const response = await fetch('https://functions.poehali.dev/34169f5c-89f3-4cd9-bfbf-700367b2545b', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                admin_id: parseInt(adminId),
                achievement_id: achievement.id
              })
            });

            const data = await response.json();
            
            if (data.success && !data.already_awarded) {
              setTimeout(() => {
                fireConfetti();
                onBalanceUpdate?.();
              }, 300);
            }
          } catch (error) {
            console.error('Failed to award achievement:', error);
          }
        }
      }
    };

    checkAndAwardAchievements();
  }, [objectsCount, balance, monthCommission]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
            <Icon name="Trophy" size={24} className="text-purple-600" />
            Достижения
          </h3>
          <span className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            {unlockedCount}/{totalCount}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => {
                setSelectedAchievement(achievement);
                if (achievement.unlocked) {
                  fireConfetti();
                }
              }}
              className="cursor-pointer"
            >
              <Card 
                className={`
                  relative p-4 text-center transition-all
                  ${achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-400 shadow-lg' 
                    : 'bg-gray-100 border-2 border-gray-300 opacity-60'
                  }
                `}
              >
                <motion.div
                  className="text-4xl mb-2"
                  animate={achievement.unlocked ? {
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.2, 1]
                  } : {}}
                  transition={{ duration: 0.5, repeat: achievement.unlocked ? Infinity : 0, repeatDelay: 3 }}
                >
                  {achievement.emoji}
                </motion.div>
                
                {achievement.unlocked && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <Icon name="Check" size={14} className="text-white" />
                  </motion.div>
                )}

                {!achievement.unlocked && achievement.progress !== undefined && (
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="h-1 bg-gray-300 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(achievement.progress / achievement.maxProgress!) * 100}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedAchievement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setSelectedAchievement(null)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{selectedAchievement.emoji}</div>
                  <h3 className="text-2xl font-bold mb-2">{selectedAchievement.title}</h3>
                  <p className="text-gray-600 mb-4">{selectedAchievement.description}</p>
                  
                  {selectedAchievement.unlocked ? (
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-bold shadow-lg">
                        <Icon name="Check" size={18} />
                        Разблокировано!
                      </div>
                      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-2xl p-4 shadow-2xl border-2 border-yellow-300 animate-pulse-slow">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        <div className="relative z-10 text-3xl font-black text-white drop-shadow-lg">
                          🎁 +1000 ₽
                        </div>
                        <div className="relative z-10 text-sm text-white/90 mt-1">
                          Начислено на баланс!
                        </div>
                      </div>
                    </div>
                  ) : selectedAchievement.progress !== undefined ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Прогресс</span>
                        <span className="font-bold">
                          {selectedAchievement.progress} / {selectedAchievement.maxProgress}
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{ width: `${(selectedAchievement.progress / selectedAchievement.maxProgress!) * 100}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 font-medium">
                      🔒 Заблокировано
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}