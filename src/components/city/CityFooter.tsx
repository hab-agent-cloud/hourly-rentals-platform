import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

export default function CityFooter() {
  return (
    <footer className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-block">
              <img 
                src="https://cdn.poehali.dev/projects/1a35ca30-983f-4a91-b0b4-3c6fa1c9a65b/files/eb1f7656-79bf-458f-a9d8-00f75775f384.jpg" 
                alt="120 минут" 
                className="h-16 w-16 object-contain mb-4"
              />
            </Link>
            <h3 className="text-xl font-bold mb-4">120 МИНУТ</h3>
            <p className="text-purple-200 text-sm mb-4">
              Платформа для поиска отелей с почасовой арендой по всей России
            </p>
            <div className="bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/20">
              <div className="text-xs text-purple-200 mb-1 flex items-center gap-1">
                <Icon name="Phone" size={12} />
                Бесплатная горячая линия
              </div>
              <a href="tel:88002347120" className="text-lg font-bold text-white hover:text-purple-200 transition-colors">
                8 800 234-71-20
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">О сервисе</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li><Link to="/about" className="hover:text-white transition">О нас</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">Как это работает</Link></li>
              <li><Link to="/contacts" className="hover:text-white transition">Контакты</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Владельцам</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li><Link to="/add-hotel" className="hover:text-white transition">Разместить объект</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Тарифы</Link></li>
              <li><Link to="/rules" className="hover:text-white transition">Правила размещения</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Помощь</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link to="/support" className="hover:text-white transition">Поддержка</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Политика конфиденциальности</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-purple-700 mt-8 pt-8 text-center text-sm text-purple-200">
          <p>&copy; 2025 120 МИНУТ. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}