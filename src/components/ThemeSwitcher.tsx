import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import { motion } from 'framer-motion';

export const themes = {
  default: {
    name: 'Северное сияние',
    gradient: 'from-indigo-100 via-purple-100 to-pink-100',
    icon: '✨'
  },
  sunset: {
    name: 'Золотой закат',
    gradient: 'from-amber-100 via-orange-100 to-red-100',
    icon: '🌅'
  },
  ocean: {
    name: 'Тропический океан',
    gradient: 'from-cyan-100 via-blue-100 to-indigo-100',
    icon: '🌊'
  },
  sakura: {
    name: 'Цветение сакуры',
    gradient: 'from-pink-100 via-rose-100 to-purple-100',
    icon: '🌸'
  },
  candy: {
    name: 'Сладкая вата',
    gradient: 'from-fuchsia-100 via-pink-100 to-purple-100',
    icon: '🍭'
  },
  emerald: {
    name: 'Изумрудный лес',
    gradient: 'from-green-100 via-emerald-100 to-teal-100',
    icon: '🌲'
  },
  lavender: {
    name: 'Лавандовые поля',
    gradient: 'from-violet-100 via-purple-100 to-indigo-100',
    icon: '💜'
  },
  peach: {
    name: 'Персиковый рассвет',
    gradient: 'from-orange-100 via-amber-100 to-yellow-100',
    icon: '🍑'
  },
  mint: {
    name: 'Мятная свежесть',
    gradient: 'from-teal-100 via-cyan-100 to-blue-100',
    icon: '🌿'
  },
  berry: {
    name: 'Ягодный микс',
    gradient: 'from-red-100 via-pink-100 to-fuchsia-100',
    icon: '🍓'
  }
};

export type ThemeKey = keyof typeof themes;

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem('guestTheme');
    return (saved as ThemeKey) || 'default';
  });

  const changeTheme = (themeKey: ThemeKey) => {
    console.log('🎨 Changing theme to:', themeKey);
    setCurrentTheme(themeKey);
    localStorage.setItem('guestTheme', themeKey);
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('themeChange', { detail: themeKey }));
    console.log('🎨 Theme change event dispatched');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100 hover:border-purple-300 transition-all shadow-sm hover:shadow-md group"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Icon name="Palette" size={18} className="text-purple-600 group-hover:text-purple-700" />
            </motion.div>
            <span className="hidden sm:inline font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Сменить фон сайта
            </span>
            <motion.div
              animate={{ y: [0, 2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Icon name="ChevronDown" size={16} className="text-purple-500" />
            </motion.div>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200 shadow-lg">
        <div className="px-2 py-1.5 text-xs font-medium text-gray-500 border-b">
          Выберите тему оформления
        </div>
        {Object.entries(themes).map(([key, theme]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => changeTheme(key as ThemeKey)}
            className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 my-1 rounded-md"
          >
            <motion.div 
              className="flex items-center gap-3 w-full text-gray-900"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span 
                className="text-2xl"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                {theme.icon}
              </motion.span>
              <span className="flex-1 font-medium">{theme.name}</span>
              {currentTheme === key && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <Icon name="Check" size={18} className="text-purple-600" />
                </motion.div>
              )}
            </motion.div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}