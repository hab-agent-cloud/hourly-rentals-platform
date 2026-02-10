import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { metrika } from '@/lib/metrika';

/**
 * Компонент для отслеживания скролла и времени на странице
 */
export default function MetrikaScrollTracker() {
  const location = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const scrollTrackedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Сброс при смене страницы
    startTimeRef.current = Date.now();
    scrollTrackedRef.current.clear();

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);

      // Отслеживаем 50%, 75%, 100%
      if (scrollPercent >= 50 && !scrollTrackedRef.current.has(50)) {
        scrollTrackedRef.current.add(50);
        metrika.trackScroll(50, location.pathname);
      }
      if (scrollPercent >= 75 && !scrollTrackedRef.current.has(75)) {
        scrollTrackedRef.current.add(75);
        metrika.trackScroll(75, location.pathname);
      }
      if (scrollPercent >= 100 && !scrollTrackedRef.current.has(100)) {
        scrollTrackedRef.current.add(100);
        metrika.trackScroll(100, location.pathname);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Отслеживание времени при уходе со страницы
    return () => {
      window.removeEventListener('scroll', handleScroll);
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (timeSpent > 5) {
        metrika.trackTimeOnPage(timeSpent, location.pathname);
      }
    };
  }, [location.pathname]);

  return null;
}
