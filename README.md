# Sellgar Storefront

Серверная витрина на Next.js. Исходники и Yarn workspace находятся в `code/`.
Node.js — 24+, Yarn — 4.18.0. Локальные команды:

```bash
git submodule update --init --recursive
cd code
yarn install --immutable
yarn dev:desktop_ui
```

## Структура

```text
code/                         исходники, workspace, lockfile и библиотеки
helm/
  values.app.yaml             общие параметры приложения
  dev/values.yaml             dev ConfigMap с .env и параметры среды
  prod/values.yaml            prod параметры; ingress пока отключён
.github/workflows/
  ci.yml                      unit → build → publish → deploy
  production.yml              ручное продвижение проверенного release
Dockerfile                    builder и standalone Node.js runtime
```

Общий chart Deployment/Service/Ingress/ConfigMap находится в
`sellgar.infrastructure/charts/application`. В `helm/` витрины шаблоны Kubernetes
не дублируются. Инфраструктурный Application при подключении выбирает SHA chart,
SHA этих values и digest образа из успешного CI.

## Конфигурация при запуске

Образ собирается без настроек среды. ConfigMap из `helm/<environment>/values.yaml`
монтирует `.env` в `/app/clients/desktop/.env`. Node.js читает его до старта Next:

```text
node --env-file=.env server.js
```

Переменные:

| Переменная | Назначение |
|---|---|
| `CLIENT_GATEWAY_URL` | адрес client gateway для серверных запросов SSR и proxy |
| `PUBLIC_CLIENT_GATEWAY_URL` | доступный браузеру адрес client gateway |
| `PUBLIC_SOCKET_GATEWAY_URL` | доступный браузеру адрес socket gateway |
| `PUBLIC_CDN_IMAGES_URL` | публичный адрес изображений, например `https://cdn.dev.sellgar.ru/images` |

`PUBLIC_*` — явный список публичных полей, передаваемых через существующий
ApplicationSnapshot. Браузер восстанавливает настройки до создания bindings.
`NEXT_PUBLIC_*` не используется для средовых настроек: Next фиксирует эти значения
во время build. Внутренний endpoint и остальные переменные не сериализуются.
URL изображений каталога, карточки, опций и корзины формируются через
`PUBLIC_CDN_IMAGES_URL` и при SSR, и при socket-обновлениях. Без этой переменной
сохраняется прежнее обращение через публичный gateway для локальной разработки.

Секреты не записываются в ConfigMap, Git, build args или image. Если серверу
понадобится секрет, он должен подключаться в pod из Kubernetes Secret отдельно
от публичного ConfigMap. В текущем приложении секретных настроек нет;
подключение Secret этим этапом не добавляется. Env процесса имеет приоритет
над значениями файла. При изменении ConfigMap checksum
общего chart запускает rollout; существующий Node процесс .env не перечитывает.

Dev values задают публичный origin `https://dev.sellgar.ru`. Серверный
`CLIENT_GATEWAY_URL` обращается к `http://client-gateway:8080` внутри кластера;
браузер использует `/api/client` и `/socket.io` на публичном HTTPS origin.
Ingress витрины обслуживает `/`; админка размещается на отдельном
`https://admin.dev.sellgar.ru/`. TLS Secret `sellgar-dev-tls` содержит сертификат
этих имён и `cdn.dev.sellgar.ru`. Prod ingress включается после настройки production-среды.

## CI и доставка

Push в `development` запускает unit → build → publish → deploy.
`unit` — обязательная job с юнит-тестами из Docker target `tests` до сборки приложения.
Если тесты не прошли, deploy не запускается.
Сборка, тесты и публикация выполняются на GitHub-hosted runners;
deploy — на общем organization runner в dev VM.
Обычная раскатка выполняется Helm с ожиданием готовности и проверкой image digest.
Argo CD продолжает управлять платформой, но не этим приложением.

Docker targets: `application`, `tests`.
Миграционного образа и миграционной job у этого приложения нет.

Настройки среды хранятся в `helm/dev/values.yaml`, Secret refs — в
`helm/values.app.yaml`. Версионный immutable ConfigMap монтируется через
`environmentFile`; значения credentials не передаются в GitHub-hosted jobs или Git.
Внутренний HTTP-порт — 8080, в dev одна реплика.

PR запускает unit → build без публикации и деплоя. Push в `release/*` публикует
кандидат с `release.json`; ручной production workflow из `master` принимает
`candidate-<run-number>.<attempt>`, проверяет успешный исходный CI и идентичность
дерева, продвигает те же digest без пересборки. Production ещё не подготовлен:
нужны его values, Secrets, runner и GitHub environment protections.
Откат миграций в эту схему не включён.

Общие workflows закреплены тегом `delivery-v0.7.0` в `sellgar.infrastructure`.
Порядок установки runner и передачи управления: [доставка приложений](https://github.com/sellgar/sellgar.infrastructure/blob/development/docs/application-delivery.md).

## Проверки

Из `code/`: `yarn lint`, `yarn typecheck`, `yarn test:storefront`, `yarn build:desktop_ui`.
Из корня:

```bash
python3 -B -m unittest discover -s .github/scripts -p 'test_*.py'
docker build -t sellgar-storefront:local .
```

Подробности приложения — в [code/clients/desktop/README.md](code/clients/desktop/README.md).
