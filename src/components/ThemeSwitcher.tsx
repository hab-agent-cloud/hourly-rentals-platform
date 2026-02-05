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
    name: 'Спокойствие',
    gradient: 'from-blue-100 via-indigo-100 to-purple-100',
    pattern: '',
    icon: '🌊'
  },
  dots: {
    name: 'Горошек',
    gradient: 'from-purple-100 via-pink-100 to-rose-100',
    pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:24px_24px]',
    icon: '⚪'
  },
  grid: {
    name: 'Сетка',
    gradient: 'from-blue-100 via-cyan-100 to-teal-100',
    pattern: 'bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:32px_32px]',
    icon: '▦'
  },
  waves: {
    name: 'Волны',
    gradient: 'from-cyan-100 via-blue-100 to-indigo-100',
    pattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 30c15 0 15-20 30-20s15 20 30 20 15-20 30-20 15 20 30 20\' stroke=\'rgba(255,255,255,0.2)\' fill=\'none\'/%3E%3C/svg%3E")]',
    icon: '〰️'
  },
  diagonal: {
    name: 'Диагонали',
    gradient: 'from-violet-100 via-purple-100 to-fuchsia-100',
    pattern: 'bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]',
    icon: '⟋'
  },
  hexagon: {
    name: 'Соты',
    gradient: 'from-amber-100 via-orange-100 to-rose-100',
    pattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'50\' height=\'43.4\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M25 0l12.5 7.2v14.5L25 28.9 12.5 21.7V7.2z\' stroke=\'rgba(255,255,255,0.2)\' fill=\'none\'/%3E%3C/svg%3E")]',
    icon: '⬡'
  },
  business: {
    name: 'Бизнес',
    gradient: 'from-slate-100 via-gray-100 to-zinc-100',
    pattern: '',
    icon: '💼'
  },
  energy: {
    name: 'Энергия',
    gradient: 'from-orange-200 via-red-200 to-pink-200',
    pattern: '',
    icon: '⚡'
  },
  circles: {
    name: 'Круги',
    gradient: 'from-emerald-100 via-teal-100 to-cyan-100',
    pattern: 'bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.15)_0%,transparent_50%)]',
    icon: '◯'
  },
  modern: {
    name: 'Современность',
    gradient: 'from-sky-100 via-cyan-100 to-teal-100',
    pattern: '',
    icon: '🎯'
  },
  stars: {
    name: 'Звёзды',
    gradient: 'from-indigo-100 via-purple-100 to-pink-100',
    pattern: 'bg-[radial-gradient(2px_2px_at_20%_30%,white,transparent),radial-gradient(2px_2px_at_60%_70%,white,transparent),radial-gradient(1px_1px_at_50%_50%,white,transparent),radial-gradient(1px_1px_at_80%_10%,white,transparent),radial-gradient(2px_2px_at_90%_60%,white,transparent),radial-gradient(1px_1px_at_30%_80%,white,transparent)] bg-[length:200px_200px]',
    icon: '✨'
  },
  sunset: {
    name: 'Закат',
    gradient: 'from-purple-200 via-pink-200 to-orange-200',
    pattern: '',
    icon: '🌅'
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