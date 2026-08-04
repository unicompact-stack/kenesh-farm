# Деплой на GitHub Pages (5 минут)

## Что такое GitHub Pages
Бесплатный хостинг статических сайтов. Подходит для нашего проекта — 
один HTML-файл, никакого сервера.

---

## Шаг 1: Установить Git

### Windows
1. Скачай Git: https://git-scm.com/download/win
2. Установи (все настройки по умолчанию)
3. Перезагрузи терминал

### Проверка
```bash
git --version
# Должно вывести: git version 2.xx.x
```

---

## Шаг 2: Создать репозиторий на GitHub

1. Зайди на https://github.com
2. Нажми зелёную кнопку «New» (или «+» → «New repository»)
3. Заполни:
   - **Repository name:** `kinesh-farm` (или любое название)
   - **Description:** «Покупательское приложение КФХ Кенеш»
   - **Public** (бесплатно для GitHub Pages)
4. Нажми «Create repository»

---

## Шаг 3: Запушить код в GitHub

Открой терминал в папке проекта и выполни по очереди:

```bash
# 1. Инициализация git
git init

# 2. Добавить все файлы
git add .

# 3. Первый коммит
git commit -m "Первая версия приложения КФХ Кенеш"

# 4. Подключить репозиторий (замени ЛОГИН на свой)
git remote add origin https://github.com/ЛОГИН/kinesh-farm.git

# 5. Отправить код
git push -u origin main
```

**Если git запросит логин/пароль** — используй Personal Access Token вместо пароля:
1. Зайди на https://github.com/settings/tokens
2. «Generate new token (classic)»
3. Отметь `repo`
4. Скопируй токен и вставь вместо пароля

---

## Шаг 4: Настроить GitHub Pages

1. В твоём репозитории перейди в **Settings** (вкладка вверху)
2. В левом меню выбери **Pages**
3. В блоке **Source** выбери:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/dist**
4. Нажми **Save**

---

## Шаг 5: Собрать проект для деплоя

```bash
# Убедись что зависимости установлены
npm install

# Собери проект
npm run build
```

После этого появится папка `dist/` с файлом `index.html`.

---

## Шаг 6: Запушить собранную версию

```bash
git add dist/
git commit -m "Сборка для деплоя"
git push
```

---

## Шаг 7: Готово!

Подожди 1-2 минуты. Сайт будет доступен по адресу:

**`https://ЛОГИН.github.io/kinesh-farm/`**

---

## Как обновлять сайт

После любых изменений:

```bash
# 1. Собрать
npm run build

# 2. Запушить
git add .
git commit -m "Описание изменений"
git push
```

GitHub автоматически обновит сайт через 1-2 минуты.

---

## Админ-панель

Ссылка для продавца: `https://ЛОГИН.github.io/kinesh-farm/#admin`

---

## Частые ошибки

| Проблема | Решение |
|----------|---------|
| «permission denied» | Используй Personal Access Token вместо пароля |
| Сайт не обновился | Подожди 2-3 минуты, или нажми «Clear cache» в Settings → Pages |
| 404 ошибка | Проверь что папка `/dist` задеплоена, а не `/` |
| Картинки не грузятся | Убедись что они в `public/images/` и ты сделал `npm run build` |

---

## Альтернатива: Vercel (ещё проще)

1. Зарегистрируйся на https://vercel.com
2. Нажми «Add New...» → «Project»
3. Выбери репозиторий с GitHub
4. Framework: **Vite**
5. Нажми **Deploy**
6. Готово! Vercel даст ссылку вида `https://kinesh-farm.vercel.app`

Преимущество Vercel — не нужно вручную собирать и пушить `dist/`.
Он собирает автоматически при каждом коммите.
