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
    answer: 'Стоимость аренды номера на час варьируется от 350₽ до 2000₽ в зависимости от города, района и класса отеля. В Москве средняя цена — от 600₽ за 2 часа, в регионах — от 350₽ за 2 часа. Все цены указаны без скрытых комиссий.'
  },
  {
    question: 'Можно ли снять номер на 2 часа?',
    answer: 'Да, минимальный срок аренды в большинстве отелей составляет 2 часа. Вы можете забронировать номер на 2, 3, 4, 5 или больше часов — столько, сколько вам нужно. Оплата идёт только за фактически использованное время.'
  },
  {
    question: 'Как забронировать отель на час в Москве?',
    answer: 'Выберите город "Москва" на главной странице, просмотрите доступные отели с фотографиями и ценами, свяжитесь с владельцем по указанному телефону или в Telegram, согласуйте время заселения и оплатите напрямую без комиссии.'
  },
  {
    question: 'Есть ли почасовая аренда в СПб?',
    answer: 'Да, в Санкт-Петербурге доступно более 100 отелей с почасовой арендой. Средняя стоимость — от 450₽ за 2 часа. Объекты расположены в центре, на Васильевском острове, у Московского вокзала и аэропорта Пулково.'
  },
  {
    question: 'Какие документы нужны для заселения?',
    answer: 'Для заселения в отель на час требуется паспорт гражданина РФ или загранпаспорт для иностранцев. Регистрация проходит быстро — обычно 5-10 минут. Конфиденциальность гарантирована.'
  },
  {
    question: 'Можно ли продлить бронирование на месте?',
    answer: 'Да, если номер не забронирован следующими гостями, вы можете продлить своё пребывание. Просто сообщите администратору отеля, и он пересчитает стоимость с учётом дополнительных часов.'
  },
  {
    question: 'Есть ли скрытые комиссии при бронировании?',
    answer: 'Нет, 120 МИНУТ работает без комиссий. Вы бронируете напрямую у владельца отеля по указанной цене. Никаких дополнительных сборов, наценок или скрытых платежей.'
  },
  {
    question: 'Работает ли служба поддержки круглосуточно?',
    answer: 'Да, бесплатная горячая линия 8 800 234-71-20 работает 24/7 без выходных. Специалисты помогут выбрать отель, ответят на вопросы и решат любые проблемы с бронированием.'
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
    <div className="container mx-auto px-4 py-12 bg-gradient-to-br from-purple-50 to-pink-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaMarkup) }}
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Частые вопросы
          </h2>
          <p className="text-gray-600 text-lg">
            Ответы на популярные вопросы о почасовой аренде отелей
          </p>
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
