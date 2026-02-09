import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Сколько стоит аренда на час?',
    answer: 'От 350₽ до 2000₽. В Москве от 600₽ за 2 часа, в регионах от 350₽.'
  },
  {
    question: 'Можно ли снять номер на 2 часа?',
    answer: 'Да, минимум 2 часа. Оплата только за фактическое время.'
  },
  {
    question: 'Как забронировать?',
    answer: 'Выберите город, просмотрите объекты, свяжитесь с владельцем по телефону или Telegram.'
  },
  {
    question: 'Есть ли почасовая аренда в СПб?',
    answer: 'Да, более 100 отелей. Средняя цена от 450₽ за 2 часа.'
  },
  {
    question: 'Какие документы нужны?',
    answer: 'Паспорт РФ или загранпаспорт. Регистрация 5-10 минут.'
  },
  {
    question: 'Есть ли скрытые комиссии?',
    answer: 'Нет. Бронируете напрямую у владельца без наценок.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaMarkup) }}
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Частые вопросы
          </h2>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-purple-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 text-lg pr-4">
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <Icon 
                    name="ChevronDown" 
                    size={24} 
                    className={`${openIndex === index ? 'text-purple-600' : 'text-gray-400'}`}
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-5 bg-purple-50 border-t-2 border-purple-100">
                      <p className="text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center p-6 bg-white rounded-xl shadow-lg border-2 border-purple-200">
          <p className="text-gray-600 mb-4">
            Не нашли ответ на свой вопрос?
          </p>
          <a 
            href="tel:88002347120"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Icon name="Phone" size={20} />
            Позвонить 8 800 234-71-20
          </a>
        </div>
      </div>
    </div>
  );
}