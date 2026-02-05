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
    name: 'Рассвет',
    gradient: 'from-purple-50 via-pink-50 to-orange-50',
    icon: '🌅'
  },
  ocean: {
    name: 'Океан',
    gradient: 'from-blue-50 via-cyan-50 to-teal-50',
    icon: '🌊'
  },
  forest: {
    name: 'Лес',
    gradient: 'from-green-50 via-emerald-50 to-lime-50',
    icon: '🌲'
  },
  sunset: {
    name: 'Закат',
    gradient: 'from-orange-50 via-red-50 to-pink-50',
    icon: '🌇'
  },
  lavender: {
    name: 'Лаванда',
    gradient: 'from-violet-50 via-purple-50 to-fuchsia-50',
    icon: '💜'
  },
  peach: {
    name: 'Персик',
    gradient: 'from-amber-50 via-orange-50 to-rose-50',
    icon: '🍑'
  },
  mint: {
    name: 'Мята',
    gradient: 'from-teal-50 via-green-50 to-cyan-50',
    icon: '🌿'
  }
};

export type ThemeKey = keyof typeof themes;

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem('guestTheme');
    return (saved as ThemeKey) || 'default';
  });

  const changeTheme = (themeKey: ThemeKey) => {
    setCurrentTheme(themeKey);
    localStorage.setItem('guestTheme', themeKey);
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('themeChange', { detail: themeKey }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="gap-2 hover:bg-white/50 transition-all"
        >
          <span className="text-lg">{themes[currentTheme].icon}</span>
          <span className="hidden sm:inline">Фон</span>
          <Icon name="ChevronDown" size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white border-gray-200">
        {Object.entries(themes).map(([key, theme]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => changeTheme(key as ThemeKey)}
            className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
          >
            <motion.div 
              className="flex items-center gap-3 w-full text-gray-900"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-lg">{theme.icon}</span>
              <span className="flex-1">{theme.name}</span>
              {currentTheme === key && (
                <Icon name="Check" size={16} className="text-purple-600" />
              )}
            </motion.div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}