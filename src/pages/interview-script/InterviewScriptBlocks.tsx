import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export default function InterviewScriptBlocks() {
  return (
    <>
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
    </>
  );
}
