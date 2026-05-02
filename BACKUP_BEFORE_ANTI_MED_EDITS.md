# Backup Before Anti-Med Edits

**Дата:** 2026-05-02
**Ветка:** `backup-before-anti-med-edits`
**Путь к бэкапу:** `d:\Coding\backup_before_anti_med_edits_oleg_site`

## Ключевые файлы сайта
- `src/App.jsx` - Основной роутинг и структура
- `src/components/Hero.jsx` - Главный блок (уже применены правки по верстке)
- `src/components/About.jsx` - Описание методики и специалиста
- `src/components/Cases.jsx` - Кейсы пациентов
- `src/components/Method.jsx` - Описание метода лечения
- `src/components/Problems.jsx` - Список симптомов
- `src/index.css` - Основные стили (Tailwind)
- `public/` - Статические изображения и иконки
- `package.json` - Конфигурация проекта и зависимости

## Как откатиться
1. **Через Git:**
   ```bash
   git checkout backup-before-anti-med-edits
   ```
2. **Через бэкап-папку:**
   Скопировать содержимое `d:\Coding\backup_before_anti_med_edits_oleg_site` обратно в корень проекта.

## Что нельзя удалять без необходимости
- Компоненты в `src/components/ui/` (общие элементы интерфейса)
- `src/utils/telegram.js` - Интеграция с ботом
- Файлы конфигурации (`tailwind.config.js`, `vite.config.js`, `eslint.config.js`)
- Мета-теги и скрипты аналитики в `index.html` и `public/`

## Результаты проверки (Build/Lint)
- `npm run lint`: **FAILED** (13 ошибок: неиспользуемые переменные и ошибки окружения в `yandex-cloud/index.js`).
- `npm run build`: **SUCCESS** (Сборка прошла успешно за 3.21 сек).
