EV Backend - система управления зарядными станциями для электромобилей с биллингом

### Принцип работы

EV Backend - использует
Фильтрация данных осуществляется с помощью запросов GraphQL.

### Стэк

В проекти использованы: Nest.js, TypeORM, PostgreSQL, Redis, WebSocket, Nest.js Microservices, GraphQL, Docker, Docker-compose

## Getting started

Для запуска приложения потребуется наличие установленной **Docker**
Скачайте репозиторий:

    git clone ...

Перейдите в папку репозитория:

    cd ev-backend

Скопируйте и переимнуйте файл конфигурации

    cp .env.example .env

Откройте файл .env и обязательно внесите свои данные в следующие строки:

    sudo nano .env

Файл .env

    ...
    DATABASE_PASSWORD="YOUR DATABASE PASSWORD"
    ...
    ...

Остальное можно поправить относительно, относительно вашей конфигурации сети и домена.

Запустите приложение командой:

    sudo docker-compose up -d

### Запуск локально для разработки

Поправьте .env для локальной работы.
Запустите только только Redis и PostgreSQL контейнеры docker командой:

    sudo docker-compose -f docker-compose.db.yml up -d

Вы можете использовать установленные, либо установить Redis и PostgreSQL локально. если у вас не установлен Docker  
Далее можете запускать сервисы приложения отдельно переходя в соответсвующие папки:

Для API:

    cd apps/api-service
    # скопировать и переименовать .env
     cp .env.example .env

    # внести изменения в конфигурацию
     sudo nano .env

    # установить пакеты
    sudo yarn

    # запустить сервис
    sudo yarn start

    # or for wath
    sudo yarn start:dev

Для OCPP-CS:

    cd apps/ocpp-service
    # скопировать и переименовать .env
     cp .env.example .env

    # внести изменения в конфигурацию
     sudo nano .env

    # установить пакеты
    sudo yarn

    # запустить сервис
    sudo yarn start

    # or for wath
    sudo yarn start:dev

# Шаблоны запросов GraphQL

[Шаблоны запросов GraphQL для работы с B2B интерфейсом](./docs/README.QUERIES.md)

1Получить массив геоточек с данными о количестве свободных коннекторов, с применением фильтра

    QUERY:
    query getFilteredMarkers($input:InputFilterMarkersDto!){
        getFilteredMarkers(input:$input){
    	    siteid
    	    location
    	    available
    	    total
    	  }
        }


    VARIABLES:


           {
      "input": {
        "connectorTypesSelected":["Type 1","Type 2","Tesla","CCS1","CCS2","CHAdeMO"],
        "minPrice": 0,
        "maxPrice": 100,
        "minPower": 0,
        "maxPower": 100
      }
    }

1.2Подписаться на изменения состояний маркеров в реальном времени

    subscription subscribeMarkersUpdated($input:InputFilterMarkersDto!){
      markerUpdated(input:$input){
      siteid
      location
      available
      total
      }
    }

    VARIABLES:
     {
      "input": {
        "connectorTypesSelected":["Type 1","Type 2","Tesla","CCS1","CCS2","CHAdeMO"],
        "minPrice": 0,
        "maxPrice": 100,
        "minPower": 0,
        "maxPower": 100
      }
    }

2Получить данные о свободных коннекторах геоточки(site) по id(siteId) по типам с применением фильтра

    QUERY:
      query getFilteredSite($input:InputFilterSiteDto!){
        getFilteredSite(input:$input){
          site_name
          site_address
          connector_type
          power
          price
          available
          available_ids
          total
        }
      }

    VARIABLES:
    {
      "input": {
        "connectorTypesSelected":["Type 1","Type 2","Tesla","CCS1","CCS2"],
        "minPrice": 0,
        "maxPrice": 100,
        "minPower": 0,
        "maxPower": 100,
        "siteId": 93
      }
    }

2.1Подписаться на изменения site по siteId состояний коннекторов в реальном времени

    subscription subscribeSiteUpdated($input:InputFilterSiteDto!){
      siteUpdated(input:$input){
        site_name
        site_address
        connector_type
        power
        price
        available
        available_ids
        total
      }
    }

    VARIABLES:
    {
      "input": {
        "connectorTypesSelected":["Type 1","Type 2","Tesla","CCS1","CCS2","CHAdeMO"],
        "minPrice": 0,
        "maxPrice": 100,
        "minPower": 0,
        "maxPower": 100,
        "siteId": 2
      }
    }

3Создать пользователя обязательно к заполнению номер телефона

    MUTATION:
        mutation updateUser($input:UpdateOneUserInput!){
            updateOneUser(input:$input){
              id
              name
              email
            }
          }

    VARIABLES:
      {
        "input": {
          "id": 1,
          "update": {
            "name": "Steve Steve",
            "email": "steve@steve.com",
          }
        }
      }

3.2Обновить данные пользователя (пример: заполнение адреса)

    MUTATION:
        mutation updateUser($input:UpdateOneUserInput!){
            updateOneUser(input:$input){
              id
              country
              state
              address
              unit
              city
              zip
            }
          }

    VARIABLES:
      {
        "input": {
          "id": 1,
          "update": {
            "country": "USA",
            "state": "Florida",
            "address": "address",
            "unit": "unit",
            "city": "city",
            "zip": 234234
          }
        }
      }

3.1Получить историю зарядных сессий пользователя

    QUERY:
        query chargingHistory(
            $filter: ChargingHistoryFilter!,
            $sorting: [ChargingHistorySort!]){
            chargingHistories(filter:$filter, sorting:$sorting){
              siteAddress
              session_start
              connectorType
              powerSpend
              moneySpent
            }
          }

    VARIABLES:
      {
        "filter": {"userId":{"eq":1}},
        "sorting": [{"field":"id","direction":"DESC"}]
      }

## 4.Создать/Обновить Site+ChargePoints+Connectors

    MUTATION:
        mutation createOrUpdateSiteWithChargePoints($input:  CustomSiteCreateInputDto!){
          createOrUpdateSiteWithChargePoints(input:$input)
          {
            siteId
          }
        }

    HEADERS:
        {
          "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9sZWdAaWNhcGlhLmNvbSIsInN1YiI6NCwibmFtZSI6Ik9sZWcgVGFyYXNvdiIsImVtYWlsIjoib2xlZ0BpY2FwaWEuY29tIiwiaWF0IjoxNjg3Mzc1OTQ0LCJleHAiOjE2ODk5Njc5NDR9.dHuR0ety9EgXVJuxrbIRRfG-VevSnaLHqALnsUz2fZ8"
        }

    VARIABLES:
      {
        "input": {
            "data": {
            "name": "Site Name",
            "site": "Site",
            "site_area": "site_area",
            "information": "Information",
            "zip_code": 100000,
            "phone_number": "+7923923923",
            "default_price": 0.25,
            "instant_power": 100,
            "chargepoints": [{
                  "id":46,
                  "chargePointHardwareId": "15",
                  "chargePointName": "chargePoint #1",
                  "instantPower": 100,
                  "power": 100,
                  "siteId": "1",
                  "connectors": [{
                    "label": "Type 1",
                    "chargePointHardwareId": "10",
                    "connectorTypeName": "Type 1",
                    "connectorTypeId": "1",
                    "power": 100,
                    "maxPower": 220,
                    "price": 0.25,
                    "priceUnit": 0.2,
                    "chargePointId": 10,
                    "siteId": 1
                    }
                  ]
              },
              {
                  "id":48,
                  "chargePointHardwareId": "16",
                  "chargePointName": "chargePoint #1",
                  "instantPower": 100,
                  "power": 100,
                  "siteId": "1"}]
            }
          }
        }

### История зарадных сессий

4.Получить историю транзакций клиента

    QUERY:
    query userCharginHistory($input: ChargingHistoryInput!){
        userChargingHistory(input:$input){
          count
          data{
            id
            transactionId
            chargePointHardwareId
            connectorId
            userId
            meterStart
            meterStop
            session_start
            session_end
          }
        }
      }


    VARIABLES:
    {
      "input": {
        "paging":{"limit":10,"offset":0}
      }
    }

1.2Подписаться на изменения состояний маркеров в реальном времени

### Схема базы данных

![enter image description here](./readme-imgs/schema_db.png)
