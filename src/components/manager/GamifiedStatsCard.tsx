import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { ReactNode } from 'react';

interface GamifiedStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: 'green' | 'blue' | 'purple' | 'orange';
  emoji?: string;
  delay?: number;
  children?: ReactNode;
}

const colorConfig = {
  green: {
    gradient: 'from-green-50 to-emerald-50',
    border: 'border-green-200',
    iconBg: 'from-green-400 to-emerald-500',
    textGradient: 'from-green-600 to-emerald-600',
    text: 'text-green-700'
  },
  blue: {
    gradient: 'from-blue-50 to-cyan-50',
    border: 'border-blue-200',
    iconBg: 'from-blue-400 to-cyan-500',
    textGradient: 'from-blue-600 to-cyan-600',
    text: 'text-blue-700'
  },
  purple: {
    gradient: 'from-purple-50 to-pink-50',
    border: 'border-purple-200',
    iconBg: 'from-purple-400 to-pink-500',
    textGradient: 'from-purple-600 to-pink-600',
    text: 'text-purple-700'
  },
  orange: {
    gradient: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
    iconBg: 'from-orange-400 to-amber-500',
    textGradient: 'from-orange-600 to-amber-600',
    text: 'text-orange-700'
  }
};

export default function GamifiedStatsCard({
  title,
  value,
  subtitle,
  icon,
  color,
  emoji,
  delay = 0,
  children
}: GamifiedStatsCardProps) {
  const config = colorConfig[color];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className={`shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-2 ${config.border} bg-gradient-to-br ${config.gradient}`}>
        <CardHeader className="pb-2">
          <CardTitle className={`text-sm font-medium ${config.text} flex items-center gap-2`}>
            <motion.div 
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${config.iconBg} flex items-center justify-center shadow-lg`}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon name={icon} size={20} className="text-white" />
            </motion.div>
            {emoji && <span className="text-lg">{emoji}</span>}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            className={`text-3xl sm:text-4xl font-black bg-gradient-to-r ${config.textGradient} bg-clip-text text-transparent`}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {value}
          </motion.div>
          {subtitle && (
            <p className={`text-xs font-semibold ${config.text} mt-2 flex items-center gap-1`}>
              <Icon name="TrendingUp" size={12} />
              {subtitle}
            </p>
          )}
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
