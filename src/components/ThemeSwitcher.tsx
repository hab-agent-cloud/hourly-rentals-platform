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
    name: 'Классический',
    gradient: 'from-gray-50 via-gray-50 to-gray-100',
    pattern: '',
    icon: '🤍'
  },
  starry: {
    name: 'Звёздная ночь',
    gradient: 'from-slate-900 via-slate-900 to-slate-800',
    pattern: 'bg-[radial-gradient(2px_2px_at_20%_30%,white,transparent),radial-gradient(2px_2px_at_60%_70%,white,transparent),radial-gradient(1px_1px_at_50%_50%,white,transparent),radial-gradient(1px_1px_at_80%_10%,white,transparent),radial-gradient(2px_2px_at_90%_60%,white,transparent),radial-gradient(1px_1px_at_30%_80%,white,transparent)] bg-[length:200px_200px]',
    icon: '🌌'
  },
  tiffany: {
    name: 'Тиффани',
    gradient: 'from-cyan-100 via-teal-50 to-cyan-100',
    pattern: '',
    icon: '💎'
  },
  cream: {
    name: 'Кремовый',
    gradient: 'from-amber-50 via-orange-50 to-yellow-50',
    pattern: '',
    icon: '☕'
  },
  lavender: {
    name: 'Лаванда',
    gradient: 'from-purple-50 via-violet-50 to-purple-100',
    pattern: '',
    icon: '🌸'
  },
  mint: {
    name: 'Мята',
    gradient: 'from-emerald-50 via-teal-50 to-green-50',
    pattern: '',
    icon: '🌿'
  },
  peach: {
    name: 'Персик',
    gradient: 'from-orange-50 via-rose-50 to-pink-50',
    pattern: '',
    icon: '🍑'
  },
  sky: {
    name: 'Небесный',
    gradient: 'from-blue-50 via-sky-50 to-indigo-50',
    pattern: '',
    icon: '☁️'
  },
  sand: {
    name: 'Песочный',
    gradient: 'from-stone-100 via-amber-50 to-yellow-50',
    pattern: '',
    icon: '🏖️'
  }
};

export type ThemeKey = keyof typeof themes;

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem('guestTheme') as ThemeKey;
    // Проверяем, что сохранённая тема существует
    return (saved && themes[saved]) ? saved : 'default';
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