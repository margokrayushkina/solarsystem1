# ☀️ Солнечная система — Интерактивная демонстрация

Интерактивная обучающая демонстрация Солнечной системы с анимированными орбитами всех 8 планет.

## 🚀 Деплой на GitHub Pages

### Настройка GitHub Actions (автоматический деплой)

1. Перейдите в **Settings → Pages** вашего репозитория
2. В разделе **Source** выберите **GitHub Actions** (НЕ "Deploy from a branch")
3. Сохраните настройки

После этого workflow `.github/workflows/deploy.yml` будет автоматически:
- Собирать проект при каждом push в ветку `main`
- Публиковать содержимое `dist/` на GitHub Pages

### Ручной запуск workflow

Вы также можете запустить деплой вручную:
1. Перейдите в **Actions** → **Deploy to GitHub Pages**
2. Нажмите **Run workflow** → **Run workflow**

## 🛠️ Локальная разработка

```bash
npm install
npm run dev
```

## 📦 Сборка

```bash
npm run build
```

Собранные файлы появятся в папке `dist/`.

## ⚙️ Конфигурация

- `vite.config.js` — параметр `base: '/solarsystem1/'` настроен для корректной работы на GitHub Pages
- `.github/workflows/deploy.yml` — автоматический деплой через GitHub Actions

## 🌐 URL

После успешного деплоя сайт будет доступен по адресу:
`https://<username>.github.io/solarsystem1/`
