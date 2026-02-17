import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const INTERVIEW_SCRIPT_TEXT = `СКРИПТ СОБЕСЕДОВАНИЯ ДЛЯ ОФИС-МЕНЕДЖЕРА
Отбор новых сотрудников компании 120 минут

📋 ПОДГОТОВКА К СОБЕСЕДОВАНИЮ

✓ Проверьте резюме кандидата
✓ Подготовьте вопросы по опыту
✓ Убедитесь что есть доступ к тестовому заданию
✓ Запланируйте 30-40 минут

👋 ПРИВЕТСТВИЕ И ЗНАКОМСТВО (2-3 минуты)

"Здравствуйте! Меня зовут [Ваше имя], я офис-менеджер компании 120 минут. Спасибо что откликнулись на нашу вакансию. Давайте начнем с короткого знакомства — расскажите немного о себе."

🎯 БЛОК 1: О КАНДИДАТЕ (5-7 минут)

Цель: понять мотивацию и базовый опыт

1. "Расскажите о вашем последнем месте работы. Чем занимались?"
2. "Что вас привлекло в нашей вакансии?"
3. "Какой у вас опыт работы с клиентами / продажами / [по роли]?"
4. "Как вы справляетесь с рутинными задачами?"

⚠️ КРАСНЫЕ ФЛАГИ:
- Не может внятно описать прошлый опыт
- Слишком много негатива о предыдущих работодателях
- Хочет "просто любую работу"
- Нет конкретики в ответах

🏢 БЛОК 2: О КОМПАНИИ И ПОЗИЦИИ (5-7 минут)

"Позвольте я расскажу о нас и о вакансии"

О компании:
- 120 минут — сервис почасовой аренды жилья по всей России
- 3000+ объектов, работаем с владельцами и гостями
- Команда 15+ человек, офис в Краснодаре
- Растём и развиваем инструменты для владельцев

О вакансии [менеджер/операционист/другое]:
- Основные обязанности: [перечислить]
- График работы: [указать]
- Испытательный срок: [указать условия]
- Зарплата и бонусы: [озвучить вилку]

💼 БЛОК 3: ПРОФЕССИОНАЛЬНЫЕ НАВЫКИ (7-10 минут)

Для МЕНЕДЖЕРА:
1. "Опишите процесс холодного звонка. Как вы начинаете разговор?"
2. "Клиент говорит 'дорого'. Что ответите?"
3. "Как вы ведёте учёт клиентов и сделок?"
4. "Сколько звонков в день вы готовы делать?"

Для ОПЕРАЦИОНИСТА:
1. "Как бы вы общались с владельцем, который недоволен?"
2. "Расскажите о вашем опыте работы с таблицами/CRM"
3. "Как справляетесь с многозадачностью?"
4. "Приведите пример сложной ситуации, которую решили"

Для ОПЕРАТОРА ПОДДЕРЖКИ:
1. "Опыт работы с входящими обращениями?"
2. "Гость жалуется на объект. Ваши действия?"
3. "Как быстро печатаете? Умеете слепым методом?"
4. "Готовы работать по сменам / в выходные?"

✅ ЧТО ИСКАТЬ В ОТВЕТАХ:
- Конкретные примеры из опыта
- Логику и структурированность мышления
- Клиентоориентированность
- Стрессоустойчивость

🧪 БЛОК 4: ТЕСТОВОЕ ЗАДАНИЕ (3-5 минут)

"Сейчас предлагаю небольшое практическое задание"

ВАРИАНТ А (для менеджеров):
"Представьте: я владелец отеля. Вы звоните мне в первый раз. Убедите меня разместиться на 120 минут. Начинайте."

Оцениваем:
✓ Уверенность в голосе
✓ Структуру презентации
✓ Работу с возражениями
✓ Умение слушать

ВАРИАНТ Б (для операционистов):
"Владелец пишет: 'У меня 5 свободных номеров в будни. Как увеличить загрузку?' Напишите ответ за 2 минуты."

Оцениваем:
✓ Грамотность
✓ Полезность рекомендаций
✓ Вежливость
✓ Конкретика

ВАРИАНТ В (для операторов):
"Гость пишет: 'Приехал, а кодовый замок не открывается!!!' Что делаете?"

Оцениваем:
✓ Быстроту реакции
✓ Эмпатию
✓ Алгоритм действий
✓ Стрессоустойчивость

❓ БЛОК 5: ВОПРОСЫ КАНДИДАТА (3-5 минут)

"Какие у вас есть вопросы ко мне?"

Частые вопросы:
- О графике и выходных
- О зарплате и бонусах
- Об испытательном сроке
- О команде и атмосфере
- О перспективах роста

⚠️ КРАСНЫЕ ФЛАГИ:
- Нет вопросов вообще
- Только про деньги и отпуск
- Неуместные вопросы

🎬 ЗАВЕРШЕНИЕ СОБЕСЕДОВАНИЯ (2-3 минуты)

ЕСЛИ КАНДИДАТ ПОДХОДИТ:
"Спасибо за время! Мне понравилось как вы [конкретная сильная сторона]. Следующие шаги: я передам информацию руководителю, и мы свяжемся с вами в течение 2-3 дней. Есть вопросы?"

ЕСЛИ КАНДИДАТ НЕ ПОДХОДИТ:
"Спасибо за время! Мы рассматриваем несколько кандидатов. Если ваша кандидатура пройдёт, мы свяжемся в течение недели. Всего доброго!"

📊 ЧЕКЛИСТ ОЦЕНКИ КАНДИДАТА

После собеседования заполните:

Коммуникация (1-5): ___
- Грамотность речи
- Уверенность
- Умение слушать

Профессиональные навыки (1-5): ___
- Релевантный опыт
- Знание инструментов
- Результат тестового задания

Мотивация (1-5): ___
- Интерес к компании
- Понимание обязанностей
- Долгосрочные планы

Личные качества (1-5): ___
- Стрессоустойчивость
- Обучаемость
- Культурный фит

ИТОГО: ___ / 20

16-20 баллов = Сильный кандидат, рекомендую
11-15 баллов = Средний кандидат, нужно обсудить
0-10 баллов = Отказ

💡 СОВЕТЫ ОФИС-МЕНЕДЖЕРУ

✓ Будьте дружелюбны но профессиональны
✓ Слушайте больше чем говорите
✓ Записывайте ключевые моменты
✓ Не обещайте того чего не можете дать
✓ Соблюдайте тайминг собеседования
✓ Благодарите за время в конце

❌ ЧЕГО НЕ ДЕЛАТЬ:

✗ Опаздывать на собеседование
✗ Перебивать кандидата
✗ Задавать дискриминационные вопросы
✗ Обсуждать других кандидатов
✗ Давать окончательное решение на месте
✗ Критиковать предыдущих работодателей кандидата

📞 СВЯЗЬ С РУКОВОДСТВОМ

После каждого собеседования:
1. Заполните чеклист оценки
2. Отправьте результаты руководителю
3. Приложите записи/резюме
4. Дайте свою рекомендацию

Формат отчёта:
"Кандидат: [ФИО]
Вакансия: [название]
Оценка: [X/20]
Сильные стороны: [...]
Слабые стороны: [...]
Рекомендация: [взять/отказ/подумать]"`;

export default function InterviewScript() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDownload = () => {
    const blob = new Blob([INTERVIEW_SCRIPT_TEXT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Скрипт_собеседования_ОМ.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Скрипт скачан',
      description: 'Файл сохранен на ваше устройство'
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: 'Отправлено на печать',
      description: 'Документ готов к печати'
    });
  };

  const handleDownloadPdf = async () => {
    try {
      const element = document.getElementById('interview-script-content');
      if (!element) return;

      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('Скрипт_собеседования_ОМ.pdf');

      toast({
        title: 'PDF скачан',
        description: 'Файл сохранен на ваше устройство'
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать PDF',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div id="interview-script-content" className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <Icon name="ArrowLeft" size={18} />
            Назад
          </Button>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="gap-2 flex-1 sm:flex-none"
              size="sm"
            >
              <Icon name="Download" size={16} />
              <span className="hidden sm:inline">TXT</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPdf}
              className="gap-2 flex-1 sm:flex-none"
              size="sm"
            >
              <Icon name="FileText" size={16} />
              <span className="hidden sm:inline">PDF</span>
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="gap-2 flex-1 sm:flex-none print:hidden"
              size="sm"
            >
              <Icon name="Printer" size={16} />
              <span className="hidden sm:inline">Печать</span>
            </Button>
          </div>
        </div>

        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Скрипт собеседования
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Для офис-менеджера: как проводить собеседования с кандидатами
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100">
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  <Icon name="ClipboardList" size={20} />
                </div>
                Подготовка к собеседованию
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
                  <Icon name="Check" size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Проверьте резюме кандидата</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
                  <Icon name="Check" size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Подготовьте вопросы по опыту</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
                  <Icon name="Check" size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Доступ к тестовому заданию</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
                  <Icon name="Check" size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Запланируйте 30-40 минут</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">
                  <Icon name="Handshake" size={20} />
                </div>
                <div>
                  <div>Приветствие и знакомство</div>
                  <p className="text-xs sm:text-sm font-normal text-muted-foreground mt-1">2-3 минуты</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm leading-relaxed">
                "Здравствуйте! Меня зовут [Ваше имя], я офис-менеджер компании <strong>120 минут</strong>. Спасибо что откликнулись на нашу вакансию. 
                <br/><br/>
                Давайте начнем с короткого знакомства — <strong>расскажите немного о себе.</strong>"
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                  <Icon name="User" size={20} />
                </div>
                <div>
                  <div>Блок 1: О кандидате</div>
                  <p className="text-xs sm:text-sm font-normal text-muted-foreground mt-1">Понять мотивацию и опыт (5-7 минут)</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 space-y-3">
              <div className="space-y-2">
                {[
                  'Расскажите о вашем последнем месте работы. Чем занимались?',
                  'Что вас привлекло в нашей вакансии?',
                  'Какой у вас опыт работы с клиентами / продажами / [по роли]?',
                  'Как вы справляетесь с рутинными задачами?'
                ].map((question, idx) => (
                  <div key={idx} className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
                    <Badge className="bg-purple-600 flex-shrink-0">{idx + 1}</Badge>
                    <span className="text-xs sm:text-sm">{question}</span>
                  </div>
                ))}
              </div>

              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 sm:p-4 mt-4">
                <div className="flex items-center gap-2 mb-3 font-semibold text-red-700">
                  <Icon name="AlertTriangle" size={18} />
                  Красные флаги
                </div>
                <ul className="space-y-1 text-xs sm:text-sm text-red-700">
                  <li>• Не может внятно описать прошлый опыт</li>
                  <li>• Слишком много негатива о предыдущих работодателях</li>
                  <li>• Хочет "просто любую работу"</li>
                  <li>• Нет конкретики в ответах</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-indigo-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-100 to-blue-100">
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                  <Icon name="Building2" size={20} />
                </div>
                <div>
                  <div>Блок 2: О компании и позиции</div>
                  <p className="text-xs sm:text-sm font-normal text-muted-foreground mt-1">5-7 минут</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 space-y-4">
              <div>
                <Badge className="mb-3 bg-indigo-600">О компании</Badge>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm space-y-2">
                  <p>• 120 минут — сервис почасовой аренды жилья по всей России</p>
                  <p>• 3000+ объектов, работаем с владельцами и гостями</p>
                  <p>• Команда 15+ человек, офис в Краснодаре</p>
                  <p>• Растём и развиваем инструменты для владельцев</p>
                </div>
              </div>

              <div>
                <Badge className="mb-3 bg-indigo-600">О вакансии</Badge>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm space-y-2">
                  <p>• Основные обязанности: [перечислить]</p>
                  <p>• График работы: [указать]</p>
                  <p>• Испытательный срок: [указать условия]</p>
                  <p>• Зарплата и бонусы: [озвучить вилку]</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0">
                  <Icon name="Briefcase" size={20} />
                </div>
                <div>
                  <div>Блок 3: Профессиональные навыки</div>
                  <p className="text-xs sm:text-sm font-normal text-muted-foreground mt-1">7-10 минут</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 space-y-4">
              <div>
                <Badge className="mb-3 bg-orange-600">Для менеджера</Badge>
                <div className="space-y-2">
                  {[
                    'Опишите процесс холодного звонка. Как вы начинаете разговор?',
                    'Клиент говорит "дорого". Что ответите?',
                    'Как вы ведёте учёт клиентов и сделок?',
                    'Сколько звонков в день вы готовы делать?'
                  ].map((q, idx) => (
                    <div key={idx} className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs sm:text-sm">
                      {idx + 1}. {q}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Badge className="mb-3 bg-orange-600">Для операциониста</Badge>
                <div className="space-y-2">
                  {[
                    'Как бы вы общались с владельцем, который недоволен?',
                    'Расскажите о вашем опыте работы с таблицами/CRM',
                    'Как справляетесь с многозадачностью?',
                    'Приведите пример сложной ситуации, которую решили'
                  ].map((q, idx) => (
                    <div key={idx} className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs sm:text-sm">
                      {idx + 1}. {q}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Badge className="mb-3 bg-orange-600">Для оператора поддержки</Badge>
                <div className="space-y-2">
                  {[
                    'Опыт работы с входящими обращениями?',
                    'Гость жалуется на объект. Ваши действия?',
                    'Как быстро печатаете? Умеете слепым методом?',
                    'Готовы работать по сменам / в выходные?'
                  ].map((q, idx) => (
                    <div key={idx} className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs sm:text-sm">
                      {idx + 1}. {q}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-3 font-semibold text-green-700">
                  <Icon name="Check" size={18} />
                  Что искать в ответах
                </div>
                <ul className="space-y-1 text-xs sm:text-sm text-green-700">
                  <li>✓ Конкретные примеры из опыта</li>
                  <li>✓ Логику и структурированность мышления</li>
                  <li>✓ Клиентоориентированность</li>
                  <li>✓ Стрессоустойчивость</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-pink-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100">
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                <div className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center flex-shrink-0">
                  <Icon name="TestTube" size={20} />
                </div>
                <div>
                  <div>Блок 4: Тестовое задание</div>
                  <p className="text-xs sm:text-sm font-normal text-muted-foreground mt-1">3-5 минут</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 space-y-4">
              <div>
                <Badge className="mb-3 bg-pink-600">Вариант А — для менеджеров</Badge>
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm space-y-3">
                  <p className="font-medium">"Представьте: я владелец отеля. Вы звоните мне в первый раз. Убедите меня разместиться на 120 минут. Начинайте."</p>
                  <div>
                    <p className="font-semibold mb-1">Оцениваем:</p>
                    <ul className="space-y-1">
                      <li>✓ Уверенность в голосе</li>
                      <li>✓ Структуру презентации</li>
                      <li>✓ Работу с возражениями</li>
                      <li>✓ Умение слушать</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <Badge className="mb-3 bg-pink-600">Вариант Б — для операционистов</Badge>
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm space-y-3">
                  <p className="font-medium">"Владелец пишет: 'У меня 5 свободных номеров в будни. Как увеличить загрузку?' Напишите ответ за 2 минуты."</p>
                  <div>
                    <p className="font-semibold mb-1">Оцениваем:</p>
                    <ul className="space-y-1">
                      <li>✓ Грамотность</li>
                      <li>✓ Полезность рекомендаций</li>
                      <li>✓ Вежливость</li>
                      <li>✓ Конкретика</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <Badge className="mb-3 bg-pink-600">Вариант В — для операторов</Badge>
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm space-y-3">
                  <p className="font-medium">"Гость пишет: 'Приехал, а кодовый замок не открывается!!!' Что делаете?"</p>
                  <div>
                    <p className="font-semibold mb-1">Оцениваем:</p>
                    <ul className="space-y-1">
                      <li>✓ Быстроту реакции</li>
                      <li>✓ Эмпатию</li>
                      <li>✓ Алгоритм действий</li>
                      <li>✓ Стрессоустойчивость</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-cyan-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-cyan-100 to-teal-100">
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center flex-shrink-0">
                  <Icon name="HelpCircle" size={20} />
                </div>
                <div>
                  <div>Блок 5: Вопросы кандидата</div>
                  <p className="text-xs sm:text-sm font-normal text-muted-foreground mt-1">3-5 минут</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 space-y-4">
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm">
                <p className="font-medium mb-3">"Какие у вас есть вопросы ко мне?"</p>
                <p className="font-semibold mb-2">Частые вопросы:</p>
                <ul className="space-y-1">
                  <li>• О графике и выходных</li>
                  <li>• О зарплате и бонусах</li>
                  <li>• Об испытательном сроке</li>
                  <li>• О команде и атмосфере</li>
                  <li>• О перспективах роста</li>
                </ul>
              </div>

              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-3 font-semibold text-red-700">
                  <Icon name="AlertTriangle" size={18} />
                  Красные флаги
                </div>
                <ul className="space-y-1 text-xs sm:text-sm text-red-700">
                  <li>• Нет вопросов вообще</li>
                  <li>• Только про деньги и отпуск</li>
                  <li>• Неуместные вопросы</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-violet-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-violet-100 to-purple-100">
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center flex-shrink-0">
                  <Icon name="CheckCircle" size={20} />
                </div>
                <div>
                  <div>Завершение собеседования</div>
                  <p className="text-xs sm:text-sm font-normal text-muted-foreground mt-1">2-3 минуты</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 space-y-4">
              <div>
                <Badge className="mb-3 bg-green-600">Если кандидат подходит</Badge>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm leading-relaxed">
                  "Спасибо за время! Мне понравилось как вы <strong>[конкретная сильная сторона]</strong>. 
                  <br/><br/>
                  Следующие шаги: я передам информацию руководителю, и мы свяжемся с вами в течение <strong>2-3 дней</strong>. Есть вопросы?"
                </div>
              </div>

              <div>
                <Badge className="mb-3 bg-gray-600">Если кандидат не подходит</Badge>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm leading-relaxed">
                  "Спасибо за время! Мы рассматриваем несколько кандидатов. Если ваша кандидатура пройдёт, мы свяжемся в течение недели. Всего доброго!"
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-100 to-green-100">
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <Icon name="BarChart3" size={20} />
                </div>
                Чеклист оценки кандидата
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 sm:p-4">
                  <p className="font-semibold text-sm mb-2">Коммуникация (1-5):</p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Грамотность речи</li>
                    <li>• Уверенность</li>
                    <li>• Умение слушать</li>
                  </ul>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 sm:p-4">
                  <p className="font-semibold text-sm mb-2">Профессиональные навыки (1-5):</p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Релевантный опыт</li>
                    <li>• Знание инструментов</li>
                    <li>• Результат тестового</li>
                  </ul>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 sm:p-4">
                  <p className="font-semibold text-sm mb-2">Мотивация (1-5):</p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Интерес к компании</li>
                    <li>• Понимание обязанностей</li>
                    <li>• Долгосрочные планы</li>
                  </ul>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 sm:p-4">
                  <p className="font-semibold text-sm mb-2">Личные качества (1-5):</p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Стрессоустойчивость</li>
                    <li>• Обучаемость</li>
                    <li>• Культурный фит</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-100 to-green-100 border-2 border-emerald-300 rounded-lg p-4">
                <p className="font-bold text-center mb-3">ИТОГО: ___ / 20</p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">16-20</Badge>
                    <span>Сильный кандидат, рекомендую</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-600">11-15</Badge>
                    <span>Средний кандидат, нужно обсудить</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600">0-10</Badge>
                    <span>Отказ</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-sky-100">
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  <Icon name="Lightbulb" size={20} />
                </div>
                Советы и рекомендации
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3 font-semibold text-green-700">
                  <Icon name="Check" size={18} />
                  Что делать
                </div>
                <div className="space-y-2">
                  {[
                    'Будьте дружелюбны но профессиональны',
                    'Слушайте больше чем говорите',
                    'Записывайте ключевые моменты',
                    'Не обещайте того чего не можете дать',
                    'Соблюдайте тайминг собеседования',
                    'Благодарите за время в конце'
                  ].map((tip, idx) => (
                    <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs sm:text-sm flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 font-semibold text-red-700">
                  <Icon name="X" size={18} />
                  Чего не делать
                </div>
                <div className="space-y-2">
                  {[
                    'Опаздывать на собеседование',
                    'Перебивать кандидата',
                    'Задавать дискриминационные вопросы',
                    'Обсуждать других кандидатов',
                    'Давать окончательное решение на месте',
                    'Критиковать предыдущих работодателей кандидата'
                  ].map((tip, idx) => (
                    <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs sm:text-sm flex items-start gap-2">
                      <Icon name="X" size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-100 to-slate-100">
              <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center flex-shrink-0">
                  <Icon name="FileText" size={20} />
                </div>
                Связь с руководством
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm space-y-4">
                <div>
                  <p className="font-semibold mb-2">После каждого собеседования:</p>
                  <ol className="space-y-1 list-decimal list-inside">
                    <li>Заполните чеклист оценки</li>
                    <li>Отправьте результаты руководителю</li>
                    <li>Приложите записи/резюме</li>
                    <li>Дайте свою рекомендацию</li>
                  </ol>
                </div>

                <div>
                  <p className="font-semibold mb-2">Формат отчёта:</p>
                  <div className="bg-white border border-gray-300 rounded p-3 font-mono text-xs">
                    <p>Кандидат: [ФИО]</p>
                    <p>Вакансия: [название]</p>
                    <p>Оценка: [X/20]</p>
                    <p>Сильные стороны: [...]</p>
                    <p>Слабые стороны: [...]</p>
                    <p>Рекомендация: [взять/отказ/подумать]</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground print:hidden">
          <p>Используйте этот скрипт как основу для собеседований</p>
          <p className="mt-1">Адаптируйте вопросы под конкретную позицию</p>
        </div>
      </div>
    </div>
  );
}