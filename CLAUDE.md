# CLAUDE.md — КФХ Кенеш

## Описание проекта
Покупательское веб-приложение молочных продуктов КФХ «Кенеш». Покупатель выбирает товары, заполняет адрес и телефон, отправляет заказ. Продавец видит заказы в админ-панели.

## Стек технологий
- **React 19** — UI-библиотека
- **TypeScript** — типизация
- **Vite 7** — сборщик
- **Tailwind CSS 4** — стили
- **lucide-react** — иконки
- **Supabase** — база данных (PostgreSQL)
- **VK API** — уведомления о заказах (через BossYoki)
- **Vercel** — хостинг (авто-деплой при git push)

## Хранилище данных
- **Supabase PostgreSQL** — товары (`kenesh_products`) и заказы (`kenesh_orders`)
- **Vercel** — статика (index.html + images)
- **BossYoki** — VK-уведомления продавцу о новых заказах

## Структура папок
```
adaptive-dairy-delivery-interface/
├── src/
│   ├── App.tsx              — Главный компонент (мобильная + десктопная версия)
│   ├── index.css            — Стили (палитра, адаптивность)
│   ├── main.tsx             — Точка входа
│   ├── api/
│   │   ├── orders.ts        — API заказов (loadOrders, saveOrder, updateOrderStatus)
│   │   └── products.ts      — API товаров (loadProducts, saveProducts, addProduct, deleteProduct)
│   ├── lib/
│   │   └── supabase.ts      — Конфиг Supabase (URL, ключ)
│   ├── types/               — TypeScript-типы (Product, CartItem, ProductStatus)
│   ├── utils/cn.ts          — Утилита слияния классов
│   └── components/
│       ├── AdminPanel.tsx   — Админ-панель продавца (товары + заказы)
│       ├── Breadcrumbs.tsx  — Хлебные крошки
│       ├── Cart.tsx         — Корзина (не подключена)
│       ├── ProductCard.tsx  — Карточка товара (не подключена)
│       └── Header.tsx       — Шапка (не подключена)
├── public/images/           — Картинки товаров и фоны
├── dist/                    — Собранный проект
├── supabase-setup.sql       — SQL для создания таблиц
└── CLAUDE.md                — Этот файл
```

## Ключевые ограничения
1. **Supabase ключ** — публичный (anon), безопасен для клиента
2. **VK-бот** — уведомления идут через BossYoki (не напрямую)
3. **Картинки** — не инлайнены, копируются отдельно в `dist/images/`
4. **Контакты** — могут быть заглушками, проверять перед публикацией

## Важно для новой сессии

### Где что лежит
| Что | Где |
|-----|-----|
| Код приложения | `src/App.tsx` |
| API заказов | `src/api/orders.ts` |
| API товаров | `src/api/products.ts` |
| Конфиг Supabase | `src/lib/supabase.ts` |
| Админ-панель | `src/components/AdminPanel.tsx` |
| SQL скрипт | `supabase-setup.sql` |
| Деплой | Vercel → kenesh-farm.vercel.app |
| БД | Supabase PostgreSQL (wyfwofsotrijlahoupau) |
| VK-уведомления | BossYoki/smart_bot.py (check_dairy_orders) |

### Текущие проблемы
1. **Контакты-заглушки** — телефон/email могут быть ненастоящими
2. **Компоненты не подключены** — Cart.tsx, ProductCard.tsx, Header.tsx написаны, но не используются
3. **Нет авторизации** — админка доступна по `/#admin` без пароля

### Как деплоить
```bash
cd "молочные продукты/adaptive-dairy-delivery-interface"
npm run build
git add .
git commit -m "Описание изменений"
git push
# → Vercel автоматически пересобирает (1-2 мин)
```

### Как проверить
- Сайт: https://kenesh-farm.vercel.app
- Админка: https://kenesh-farm.vercel.app/#admin
- Заказы: Supabase → kenesh_orders
- Товары: Supabase → kenesh_products

### Версии
| Версия | Что |
|--------|-----|
| v1.0.0 | Первая версия: покупательское приложение + админка |
| v1.1.0 | Supabase (товары + заказы) + VK-уведомления |
| v1.1.1 | Мобильная версия: бейджи, адаптивная админка |

---

*Обновлено: 07.08.2026*
