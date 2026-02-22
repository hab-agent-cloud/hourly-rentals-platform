import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export default function InterviewScriptChecklist() {
  return (
    <>
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
    </>
  );
}
