# Инструкция

Задание:
https://wz24.atlassian.net/wiki/spaces/test/pages/72220673/Backend+middle

Проект использует nodejs, postgresql

Как развернуть проект:
1. Запустить `npm run install`
2. Создать базу данных
3. Скопировать файл `.env.example` в `.env`
4. Прописать в файл `.env` доступы
5. Запустить миграции в корне проекта командой `db-migrate up`
6. Запустить команду `node bin/www`

### Мои заметки
- Модуль db-migrate можно устанавливать глобально и писать о его 
  необходимости в README.md, чтобы уменьшить размер проекта.
- В тестах используется проверка текста в интерфейсе - зависимость от языка/интерфейса.
  Конечно, по хорошему нужно отдавать в JSON и фронт делать на чем-то вроде Vue/React, 
  чтобы тесты полностью не зависели от интерфейса.
- Не доделал обновление токена по refreshToken
- Не успел доедалть все тесты, но сделал список тестов, думаю понятно будет какие тесты я бы стал делать
