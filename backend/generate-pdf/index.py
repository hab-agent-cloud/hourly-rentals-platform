import json
import os
from datetime import datetime
from typing import Dict, Any


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    Генерация HTML-шаблона для печати бизнес-плана
    
    Возвращает готовый HTML с красивым оформлением, который можно
    сохранить как PDF через браузер (Ctrl+P -> Сохранить как PDF)
    """
    
    method = event.get('httpMethod', 'GET')
    
    # CORS для OPTIONS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    # HTML-шаблон с бизнес-планом
    html_content = """
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Бизнес-план 120 МИНУТ - 2026</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 2rem;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        
        .header .subtitle {
            font-size: 1.2rem;
            opacity: 0.95;
            font-weight: 500;
        }
        
        .content {
            padding: 2rem;
        }
        
        .section {
            margin-bottom: 3rem;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 3px solid #667eea;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .section-title .icon {
            font-size: 2rem;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 5px solid #f59e0b;
            padding: 1.5rem;
            border-radius: 10px;
            margin: 1.5rem 0;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .success-box {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            border-left: 5px solid #10b981;
            padding: 1.5rem;
            border-radius: 10px;
            margin: 1.5rem 0;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .warning-box {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            border-left: 5px solid #ef4444;
            padding: 1.5rem;
            border-radius: 10px;
            margin: 1.5rem 0;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        td {
            padding: 0.9rem 1rem;
            border-bottom: 1px solid #e5e7eb;
        }
        
        tr:hover {
            background: #f9fafb;
        }
        
        tr:last-child td {
            border-bottom: none;
        }
        
        .total-row {
            background: #f3f4f6 !important;
            font-weight: 700;
            color: #667eea;
            font-size: 1.1rem;
        }
        
        .metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 1.5rem 0;
        }
        
        .metric-card {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            padding: 1.5rem;
            border-radius: 15px;
            border: 2px solid #d1d5db;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        
        .metric-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 12px rgba(0,0,0,0.15);
        }
        
        .metric-value {
            font-size: 2.5rem;
            font-weight: 800;
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        
        .metric-label {
            font-size: 0.95rem;
            color: #6b7280;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .timeline {
            position: relative;
            padding-left: 2rem;
            margin: 2rem 0;
        }
        
        .timeline-item {
            position: relative;
            padding-bottom: 2rem;
            border-left: 3px solid #667eea;
            padding-left: 2rem;
        }
        
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -1rem;
            top: 0;
            width: 2rem;
            height: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            border: 4px solid white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .timeline-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        
        .timeline-content {
            background: #f9fafb;
            padding: 1rem;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
        }
        
        ul {
            list-style: none;
            padding-left: 0;
        }
        
        ul li {
            padding: 0.5rem 0;
            padding-left: 1.5rem;
            position: relative;
        }
        
        ul li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: 700;
            font-size: 1.2rem;
        }
        
        .footer {
            background: #1f2937;
            color: white;
            padding: 2rem;
            text-align: center;
        }
        
        .footer p {
            opacity: 0.8;
            font-size: 0.9rem;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                border-radius: 0;
            }
            
            .section {
                page-break-inside: avoid;
            }
        }
        
        .chart-bar {
            height: 30px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            border-radius: 5px;
            margin: 0.5rem 0;
            display: flex;
            align-items: center;
            padding: 0 1rem;
            color: white;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 БИЗНЕС-ПЛАН</h1>
            <p class="subtitle">Проект 120 МИНУТ • Финансовая модель на 2026 год</p>
        </div>
        
        <div class="content">
            <!-- Модель монетизации -->
            <div class="section">
                <h2 class="section-title"><span class="icon">💼</span> Модель монетизации</h2>
                
                <div class="highlight-box">
                    <h3 style="margin-bottom: 1rem; color: #f59e0b; font-size: 1.3rem;">🎯 Тарифные планы</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Услуга</th>
                                <th>Цена</th>
                                <th>Описание</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Подписка</strong></td>
                                <td style="color: #10b981; font-weight: 700; font-size: 1.1rem;">2 000 ₽/мес</td>
                                <td>Размещение объекта на платформе</td>
                            </tr>
                            <tr>
                                <td><strong>Продвижение</strong></td>
                                <td style="color: #10b981; font-weight: 700; font-size: 1.1rem;">3 000 ₽/мес</td>
                                <td>Топ-позиции в выдаче города (до 500 объектов)</td>
                            </tr>
                            <tr class="total-row">
                                <td><strong>ARPU (средний доход)</strong></td>
                                <td style="color: #667eea;">до 5 000 ₽/мес</td>
                                <td>Средний доход с одного объекта</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value">3 000</div>
                        <div class="metric-label">База объектов</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">2 000</div>
                        <div class="metric-label">Потенциал подписчиков</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">500</div>
                        <div class="metric-label">Премиум-объектов</div>
                    </div>
                </div>
            </div>
            
            <!-- Прогноз выручки -->
            <div class="section">
                <h2 class="section-title"><span class="icon">📈</span> Прогноз выручки на первый год</h2>
                
                <div class="success-box">
                    <h3 style="margin-bottom: 1rem; color: #10b981; font-size: 1.3rem;">✅ Консервативный сценарий (40% конверсия)</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Месяц</th>
                                <th>Подписок</th>
                                <th>Продвижений</th>
                                <th>Подписка ₽</th>
                                <th>Продвижение ₽</th>
                                <th>Выручка</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Месяц 1</td>
                                <td>200</td>
                                <td>50</td>
                                <td>400 000</td>
                                <td>150 000</td>
                                <td style="font-weight: 700; color: #10b981; font-size: 1.1rem;">550 000 ₽</td>
                            </tr>
                            <tr>
                                <td>Месяц 2</td>
                                <td>400</td>
                                <td>100</td>
                                <td>800 000</td>
                                <td>300 000</td>
                                <td style="font-weight: 700; color: #10b981; font-size: 1.1rem;">1 100 000 ₽</td>
                            </tr>
                            <tr>
                                <td>Месяц 3</td>
                                <td>600</td>
                                <td>150</td>
                                <td>1 200 000</td>
                                <td>450 000</td>
                                <td style="font-weight: 700; color: #10b981; font-size: 1.1rem;">1 650 000 ₽</td>
                            </tr>
                            <tr>
                                <td>Месяц 6</td>
                                <td>1 000</td>
                                <td>250</td>
                                <td>2 000 000</td>
                                <td>750 000</td>
                                <td style="font-weight: 700; color: #10b981; font-size: 1.1rem;">2 750 000 ₽</td>
                            </tr>
                            <tr>
                                <td>Месяц 12</td>
                                <td>1 500</td>
                                <td>400</td>
                                <td>3 000 000</td>
                                <td>1 200 000</td>
                                <td style="font-weight: 700; color: #10b981; font-size: 1.1rem;">4 200 000 ₽</td>
                            </tr>
                            <tr class="total-row">
                                <td colspan="5"><strong>ИТОГО ЗА ПЕРВЫЙ ГОД</strong></td>
                                <td style="color: #667eea; font-size: 1.3rem;">~26 000 000 ₽</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="highlight-box" style="margin-top: 2rem;">
                    <h3 style="margin-bottom: 1rem; color: #f59e0b; font-size: 1.3rem;">🚀 Оптимистичный сценарий (60% конверсия)</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Месяц</th>
                                <th>Подписок</th>
                                <th>Продвижений</th>
                                <th>Выручка</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Месяц 6</td>
                                <td>1 500</td>
                                <td>400</td>
                                <td style="font-weight: 700; color: #f59e0b; font-size: 1.1rem;">4 200 000 ₽</td>
                            </tr>
                            <tr>
                                <td>Месяц 12</td>
                                <td>2 000</td>
                                <td>500</td>
                                <td style="font-weight: 700; color: #f59e0b; font-size: 1.1rem;">5 500 000 ₽</td>
                            </tr>
                            <tr class="total-row">
                                <td colspan="3"><strong>ИТОГО ЗА ПЕРВЫЙ ГОД</strong></td>
                                <td style="color: #667eea; font-size: 1.3rem;">~42 000 000 ₽</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Структура расходов -->
            <div class="section">
                <h2 class="section-title"><span class="icon">💰</span> Структура расходов</h2>
                
                <h3 style="margin: 1.5rem 0 1rem; font-size: 1.3rem; color: #667eea;">Переменные расходы (от выручки)</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Статья расхода</th>
                            <th>% от выручки</th>
                            <th>Описание</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Менеджеры (М)</strong></td>
                            <td style="font-weight: 700; font-size: 1.1rem;">20%</td>
                            <td>Комиссия за привлечение и обслуживание клиентов</td>
                        </tr>
                        <tr>
                            <td><strong>ОМ (Опытные менеджеры)</strong></td>
                            <td style="font-weight: 700; font-size: 1.1rem;">7%</td>
                            <td>Руководители команд, обучение менеджеров</td>
                        </tr>
                        <tr>
                            <td><strong>УМ (Ведущие менеджеры)</strong></td>
                            <td style="font-weight: 700; font-size: 1.1rem;">3%</td>
                            <td>Топ-менеджмент, управление отделами</td>
                        </tr>
                        <tr>
                            <td><strong>Налоги (УСН 15%)</strong></td>
                            <td style="font-weight: 700; font-size: 1.1rem;">15%</td>
                            <td>Упрощённая система налогообложения</td>
                        </tr>
                        <tr>
                            <td><strong>Реклама</strong></td>
                            <td style="font-weight: 700; font-size: 1.1rem;">30%</td>
                            <td>Яндекс Директ, таргет, SEO, контент-маркетинг</td>
                        </tr>
                        <tr class="total-row">
                            <td><strong>ИТОГО переменные</strong></td>
                            <td style="color: #667eea; font-size: 1.3rem;">75%</td>
                            <td>От выручки</td>
                        </tr>
                    </tbody>
                </table>
                
                <h3 style="margin: 2rem 0 1rem; font-size: 1.3rem; color: #667eea;">Постоянные расходы (фиксированные)</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Статья</th>
                            <th>Сумма/мес</th>
                            <th>Год</th>
                            <th>Примечание</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Хостинг + домены</td>
                            <td>5 000 ₽</td>
                            <td>60 000 ₽</td>
                            <td>Сервера, CDN, SSL</td>
                        </tr>
                        <tr>
                            <td>Бухгалтерия</td>
                            <td>15 000 ₽</td>
                            <td>180 000 ₽</td>
                            <td>Аутсорсинг</td>
                        </tr>
                        <tr>
                            <td>Телефония (горячая линия)</td>
                            <td>20 000 ₽</td>
                            <td>240 000 ₽</td>
                            <td>8 800 номер</td>
                        </tr>
                        <tr>
                            <td>Юридическое сопровождение</td>
                            <td>25 000 ₽</td>
                            <td>300 000 ₽</td>
                            <td>Договора, оферта</td>
                        </tr>
                        <tr>
                            <td>CRM / Сервисы</td>
                            <td>10 000 ₽</td>
                            <td>120 000 ₽</td>
                            <td>Amо CRM, Битрикс24</td>
                        </tr>
                        <tr>
                            <td>Офис (опционально)</td>
                            <td>50 000 ₽</td>
                            <td>600 000 ₽</td>
                            <td>Коворкинг или удалёнка</td>
                        </tr>
                        <tr class="total-row">
                            <td><strong>ИТОГО постоянные</strong></td>
                            <td style="color: #667eea; font-size: 1.1rem;">125 000 ₽</td>
                            <td style="color: #667eea; font-size: 1.1rem;">1 500 000 ₽</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Команда -->
            <div class="section">
                <h2 class="section-title"><span class="icon">👥</span> Команда менеджеров</h2>
                
                <div class="highlight-box">
                    <h3 style="margin-bottom: 1rem; color: #f59e0b; font-size: 1.3rem;">Структура команды</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Роль</th>
                                <th>Количество</th>
                                <th>Оплата</th>
                                <th>Функции</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Менеджеры (М)</strong></td>
                                <td>10 чел</td>
                                <td>20% комиссия</td>
                                <td>Холодные звонки, продажи, обслуживание клиентов</td>
                            </tr>
                            <tr>
                                <td><strong>ОМ (Опытные)</strong></td>
                                <td>2 чел</td>
                                <td>7% надбавка</td>
                                <td>Обучение команды, контроль качества</td>
                            </tr>
                            <tr>
                                <td><strong>УМ (Ведущий)</strong></td>
                                <td>1 чел</td>
                                <td>3% надбавка</td>
                                <td>Управление отделом продаж, стратегия</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="success-box" style="margin-top: 2rem;">
                    <h3 style="margin-bottom: 1rem; color: #10b981; font-size: 1.3rem;">💵 Пример зарплат при выручке 2 750 000 ₽/мес</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Роль</th>
                                <th>Расчёт</th>
                                <th>Зарплата</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Менеджер (М)</strong></td>
                                <td>2 750 000 × 20% ÷ 10</td>
                                <td style="font-weight: 700; color: #10b981; font-size: 1.2rem;">55 000 ₽/мес</td>
                            </tr>
                            <tr>
                                <td><strong>ОМ</strong></td>
                                <td>2 750 000 × 7% ÷ 2</td>
                                <td style="font-weight: 700; color: #10b981; font-size: 1.2rem;">96 250 ₽/мес</td>
                            </tr>
                            <tr>
                                <td><strong>УМ</strong></td>
                                <td>2 750 000 × 3%</td>
                                <td style="font-weight: 700; color: #10b981; font-size: 1.2rem;">82 500 ₽/мес</td>
                            </tr>
                        </tbody>
                    </table>
                    <p style="margin-top: 1rem; font-style: italic; color: #6b7280;">
                        ⚡ Зарплаты растут пропорционально выручке — мотивация на результат!
                    </p>
                </div>
            </div>
            
            <!-- Прогноз прибыли -->
            <div class="section">
                <h2 class="section-title"><span class="icon">💵</span> Прогноз прибыли</h2>
                
                <h3 style="margin-bottom: 1rem; font-size: 1.3rem; color: #667eea;">Месяц 6 (выручка 2 750 000 ₽)</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Статья</th>
                            <th>Сумма</th>
                            <th>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="background: #d1fae5;">
                            <td><strong>Выручка</strong></td>
                            <td style="font-weight: 700; font-size: 1.1rem;">2 750 000 ₽</td>
                            <td>100%</td>
                        </tr>
                        <tr>
                            <td>Менеджеры (20%)</td>
                            <td>-550 000 ₽</td>
                            <td>-20%</td>
                        </tr>
                        <tr>
                            <td>ОМ (7%)</td>
                            <td>-192 500 ₽</td>
                            <td>-7%</td>
                        </tr>
                        <tr>
                            <td>УМ (3%)</td>
                            <td>-82 500 ₽</td>
                            <td>-3%</td>
                        </tr>
                        <tr>
                            <td>Налоги (15%)</td>
                            <td>-412 500 ₽</td>
                            <td>-15%</td>
                        </tr>
                        <tr>
                            <td>Реклама (30%)</td>
                            <td>-825 000 ₽</td>
                            <td>-30%</td>
                        </tr>
                        <tr>
                            <td>Постоянные расходы</td>
                            <td>-125 000 ₽</td>
                            <td>-5%</td>
                        </tr>
                        <tr class="total-row">
                            <td><strong>Чистая прибыль</strong></td>
                            <td style="color: #10b981; font-size: 1.3rem;">562 500 ₽</td>
                            <td style="color: #10b981; font-size: 1.3rem;">20%</td>
                        </tr>
                    </tbody>
                </table>
                
                <h3 style="margin: 2rem 0 1rem; font-size: 1.3rem; color: #667eea;">Месяц 12 (выручка 4 200 000 ₽)</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Статья</th>
                            <th>Сумма</th>
                            <th>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="background: #d1fae5;">
                            <td><strong>Выручка</strong></td>
                            <td style="font-weight: 700; font-size: 1.1rem;">4 200 000 ₽</td>
                            <td>100%</td>
                        </tr>
                        <tr>
                            <td>Менеджеры (20%)</td>
                            <td>-840 000 ₽</td>
                            <td>-20%</td>
                        </tr>
                        <tr>
                            <td>ОМ (7%)</td>
                            <td>-294 000 ₽</td>
                            <td>-7%</td>
                        </tr>
                        <tr>
                            <td>УМ (3%)</td>
                            <td>-126 000 ₽</td>
                            <td>-3%</td>
                        </tr>
                        <tr>
                            <td>Налоги (15%)</td>
                            <td>-630 000 ₽</td>
                            <td>-15%</td>
                        </tr>
                        <tr>
                            <td>Реклама (30%)</td>
                            <td>-1 260 000 ₽</td>
                            <td>-30%</td>
                        </tr>
                        <tr>
                            <td>Постоянные расходы</td>
                            <td>-125 000 ₽</td>
                            <td>-3%</td>
                        </tr>
                        <tr class="total-row">
                            <td><strong>Чистая прибыль</strong></td>
                            <td style="color: #10b981; font-size: 1.3rem;">925 000 ₽</td>
                            <td style="color: #10b981; font-size: 1.3rem;">22%</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="success-box" style="margin-top: 2rem;">
                    <h3 style="margin-bottom: 1rem; color: #10b981; font-size: 1.4rem;">🎯 Годовая прибыль (первый год)</h3>
                    <div class="metric-grid">
                        <div class="metric-card">
                            <div class="metric-value">26М₽</div>
                            <div class="metric-label">Консервативная выручка</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">5.2М₽</div>
                            <div class="metric-label">Чистая прибыль (20%)</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">42М₽</div>
                            <div class="metric-label">Оптимистичная выручка</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">8.4М₽</div>
                            <div class="metric-label">Чистая прибыль (20%)</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Драйверы роста -->
            <div class="section">
                <h2 class="section-title"><span class="icon">🚀</span> Драйверы роста бизнеса</h2>
                
                <div class="success-box">
                    <h3 style="margin-bottom: 1rem; color: #10b981; font-size: 1.3rem;">✅ SEO-оптимизация (текущее состояние)</h3>
                    <ul>
                        <li>Title, H1, Description под запрос "аренда на час"</li>
                        <li>FAQ с микроразметкой Schema.org (8 вопросов)</li>
                        <li>Хлебные крошки на всех городских страницах</li>
                        <li>Блок "Популярные города" с внутренними ссылками</li>
                        <li>53 города с уникальными SEO-страницами</li>
                    </ul>
                    
                    <h4 style="margin: 1.5rem 0 1rem; color: #10b981;">📈 Ожидаемый эффект:</h4>
                    <ul>
                        <li>Через 1 месяц: топ-50 по запросу "аренда на час"</li>
                        <li>Через 3 месяца: топ-10 по запросу "аренда на час + город"</li>
                        <li>Через 6 месяцев: 40-60% трафика из органики Яндекса</li>
                        <li><strong>Экономия на рекламе:</strong> 30% → 20% после полугода</li>
                    </ul>
                </div>
                
                <div class="highlight-box" style="margin-top: 2rem;">
                    <h3 style="margin-bottom: 1rem; color: #f59e0b; font-size: 1.3rem;">💰 Контекстная реклама (Яндекс Директ)</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td><strong>Бюджет</strong></td>
                                <td>30% от выручки = 825 000 ₽/мес (при 2.75 млн оборота)</td>
                            </tr>
                            <tr>
                                <td><strong>CPA (стоимость клиента)</strong></td>
                                <td>~1 500 ₽</td>
                            </tr>
                            <tr>
                                <td><strong>Привлечение</strong></td>
                                <td>~550 новых клиентов в месяц</td>
                            </tr>
                            <tr style="background: #fef3c7;">
                                <td><strong>ROI</strong></td>
                                <td style="font-weight: 700; font-size: 1.2rem; color: #f59e0b;">1:3.3 (каждый рубль приносит 3.3 рубля)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- KPI -->
            <div class="section">
                <h2 class="section-title"><span class="icon">📊</span> Метрики и KPI</h2>
                
                <table>
                    <thead>
                        <tr>
                            <th>Метрика</th>
                            <th>Текущее значение</th>
                            <th>Цель на год</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Количество объектов</td>
                            <td>3 000 база</td>
                            <td style="font-weight: 700; color: #10b981;">2 000 активных</td>
                        </tr>
                        <tr>
                            <td>Конверсия в подписку</td>
                            <td>40-60%</td>
                            <td style="font-weight: 700; color: #10b981;">60% к концу года</td>
                        </tr>
                        <tr>
                            <td>Конверсия в продвижение</td>
                            <td>20-25%</td>
                            <td style="font-weight: 700; color: #10b981;">25% к концу года</td>
                        </tr>
                        <tr>
                            <td>ARPU (средний доход)</td>
                            <td>2 500 ₽/мес</td>
                            <td style="font-weight: 700; color: #10b981;">3 000 ₽/мес</td>
                        </tr>
                        <tr>
                            <td>LTV (жизненная ценность)</td>
                            <td>15 000 ₽</td>
                            <td style="font-weight: 700; color: #10b981;">24 000 ₽ (12 мес)</td>
                        </tr>
                        <tr>
                            <td>CAC (стоимость привлечения)</td>
                            <td>1 500 ₽</td>
                            <td style="font-weight: 700; color: #10b981;">1 200 ₽</td>
                        </tr>
                        <tr style="background: #d1fae5;">
                            <td><strong>Payback (окупаемость)</strong></td>
                            <td>1 месяц</td>
                            <td style="font-weight: 700; color: #10b981; font-size: 1.2rem;">0.5 месяца</td>
                        </tr>
                        <tr>
                            <td>Churn Rate (отток)</td>
                            <td>15%/мес</td>
                            <td style="font-weight: 700; color: #10b981;">10%/мес</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- План развития -->
            <div class="section">
                <h2 class="section-title"><span class="icon">🎯</span> План развития на 12 месяцев</h2>
                
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-title">Этап 1: Запуск (месяцы 1-3)</div>
                        <div class="timeline-content">
                            <ul>
                                <li>SEO-оптимизация завершена</li>
                                <li>Запуск контекстной рекламы (Яндекс Директ)</li>
                                <li>Набор 10 менеджеров</li>
                                <li>Обучение команды по скриптам продаж</li>
                            </ul>
                            <div style="margin-top: 1rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
                                <strong>Цель:</strong> 600 подписок, 150 продвижений<br>
                                <strong>Выручка:</strong> ~5 000 000 ₽ за квартал
                            </div>
                        </div>
                    </div>
                    
                    <div class="timeline-item">
                        <div class="timeline-title">Этап 2: Масштабирование (месяцы 4-6)</div>
                        <div class="timeline-content">
                            <ul>
                                <li>Увеличение рекламного бюджета на 50%</li>
                                <li>Добавление новых каналов (Telegram Ads, VK)</li>
                                <li>Найм 2 ОМ (опытных менеджеров)</li>
                            </ul>
                            <div style="margin-top: 1rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
                                <strong>Цель:</strong> 1 000 подписок, 250 продвижений<br>
                                <strong>Выручка:</strong> ~8 000 000 ₽ за квартал
                            </div>
                        </div>
                    </div>
                    
                    <div class="timeline-item">
                        <div class="timeline-title">Этап 3: Оптимизация (месяцы 7-9)</div>
                        <div class="timeline-content">
                            <ul>
                                <li>Автоматизация продаж (chatbots, email-рассылки)</li>
                                <li>Снижение CAC за счёт органического трафика</li>
                                <li>Внедрение LTV-ориентированных стратегий</li>
                            </ul>
                            <div style="margin-top: 1rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
                                <strong>Цель:</strong> 1 300 подписок, 350 продвижений<br>
                                <strong>Выручка:</strong> ~10 000 000 ₽ за квартал
                            </div>
                        </div>
                    </div>
                    
                    <div class="timeline-item">
                        <div class="timeline-title">Этап 4: Выход на плато (месяцы 10-12)</div>
                        <div class="timeline-content">
                            <ul>
                                <li>1 500-2 000 активных подписок</li>
                                <li>400-500 премиум-объектов</li>
                                <li>Подготовка к выходу в новые города</li>
                            </ul>
                            <div style="margin-top: 1rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
                                <strong>Цель:</strong> 1 500+ подписок, 400+ продвижений<br>
                                <strong>Выручка:</strong> ~13 000 000 ₽ за квартал
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="success-box" style="margin-top: 2rem;">
                    <h3 style="color: #10b981; font-size: 1.4rem; margin-bottom: 0.5rem;">🎉 ИТОГО ЗА ГОД</h3>
                    <p style="font-size: 1.2rem;">
                        <strong>Выручка:</strong> 26-42 млн ₽<br>
                        <strong>Чистая прибыль:</strong> 5-8 млн ₽
                    </p>
                </div>
            </div>
            
            <!-- Риски -->
            <div class="section">
                <h2 class="section-title"><span class="icon">💡</span> Риски и пути снижения</h2>
                
                <table>
                    <thead>
                        <tr>
                            <th>Риск</th>
                            <th>Вероятность</th>
                            <th>Влияние</th>
                            <th>Решение</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Низкая конверсия владельцев</td>
                            <td>Средняя</td>
                            <td>Высокое</td>
                            <td>Бесплатный пробный период 1 мес, кейсы успеха</td>
                        </tr>
                        <tr>
                            <td>Высокий отток клиентов</td>
                            <td>Средняя</td>
                            <td>Высокое</td>
                            <td>Личный менеджер, автопродление, бонусы за годовую оплату</td>
                        </tr>
                        <tr>
                            <td>Конкуренты (Авито, Яндекс)</td>
                            <td>Высокая</td>
                            <td>Среднее</td>
                            <td>Узкая ниша (почасовая), прямые сделки, 0% комиссия</td>
                        </tr>
                        <tr>
                            <td>Сезонность спроса</td>
                            <td>Низкая</td>
                            <td>Низкое</td>
                            <td>Почасовая аренда востребована круглый год</td>
                        </tr>
                        <tr>
                            <td>Проблемы с модерацией</td>
                            <td>Средняя</td>
                            <td>Среднее</td>
                            <td>Автоматическая проверка фото, рейтинги отелей</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="footer">
            <p>📊 Бизнес-план проекта 120 МИНУТ • 2026 год</p>
            <p style="margin-top: 0.5rem;">Дата создания: """ + datetime.now().strftime('%d.%m.%Y') + """</p>
            <p style="margin-top: 1rem; font-size: 0.85rem;">
                Для печати: Ctrl+P (Windows) или Cmd+P (Mac) → Сохранить как PDF
            </p>
        </div>
    </div>
</body>
</html>
    """
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/html; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
        },
        'body': html_content
    }
