import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';

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
}

export default function AchievementsPanel({ objectsCount, balance, monthCommission }: AchievementsPanelProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const achievements: Achievement[] = [
    {
      id: 'first_object',
      title: 'Первый шаг',
      description: 'Добавьте первый объект',
      emoji: '🏠',
      unlocked: objectsCount >= 1
    },
    {
      id: 'ten_objects',
      title: 'Десятка',
      description: 'Управляйте 10 объектами',
      emoji: '🔟',
      unlocked: objectsCount >= 10,
      progress: Math.min(objectsCount, 10),
      maxProgress: 10
    },
    {
      id: 'fifty_objects',
      title: 'Золотая пятёрка',
      description: 'Достигните 50 объектов',
      emoji: '⭐',
      unlocked: objectsCount >= 50,
      progress: Math.min(objectsCount, 50),
      maxProgress: 50
    },
    {
      id: 'first_money',
      title: 'Первая прибыль',
      description: 'Заработайте первые деньги',
      emoji: '💰',
      unlocked: balance > 0
    },
    {
      id: 'big_earner',
      title: 'Крупный заработок',
      description: 'Накопите 100 000 ₽',
      emoji: '💎',
      unlocked: balance >= 100000,
      progress: Math.min(balance, 100000),
      maxProgress: 100000
    },
    {
      id: 'month_profit',
      title: 'Месячный рекорд',
      description: 'Заработайте 50 000 ₽ за месяц',
      emoji: '🔥',
      unlocked: monthCommission >= 50000,
      progress: Math.min(monthCommission, 50000),
      maxProgress: 50000
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

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
              onClick={() => setSelectedAchievement(achievement)}
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-bold">
                      <Icon name="Check" size={18} />
                      Разблокировано!
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
