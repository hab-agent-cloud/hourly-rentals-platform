import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  darkMode?: boolean;
}

export default function Breadcrumbs({ items, darkMode = false }: BreadcrumbsProps) {
  const breadcrumbSchemaMarkup = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.path && { "item": `https://120minut.ru${item.path}` })
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchemaMarkup) }}
      />
      
      <nav 
        aria-label="Навигация по сайту" 
        className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
      >
        <ol className="flex items-center flex-wrap gap-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <Icon 
                  name="ChevronRight" 
                  size={14} 
                  className={darkMode ? 'text-gray-500' : 'text-gray-400'}
                />
              )}
              
              {item.path ? (
                <Link
                  to={item.path}
                  className={`hover:underline transition-colors ${
                    darkMode 
                      ? 'hover:text-purple-400' 
                      : 'hover:text-purple-600'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={`font-medium ${
                  darkMode ? 'text-purple-400' : 'text-purple-700'
                }`}>
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
