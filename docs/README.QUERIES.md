# Шаблоны запросов GraphQL

Шаблоны запросов GraphQL для работы с API

### Примеры запросов для работы с B2B интерфейсом

1)Логин, получение Authorization - токена:

    MUTATION:
    mutation login($input: LoginInputDTO!){
    			  login(input: $input){
    			    accessToken
    			  }
    			}

    VARIABLES:
    {
      "input": {
        "username": "test@test.com",
        "password": "345422"
      }
    }

2)Кастомный запрос для сохранения или изменения Site + Charger + Connector

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
            "id":127,
            "name": "Site Name",
            "site": "Site",
            "site_area": "site_area",
            "information": "Information",
            "zip_code": 100000,
            "phone_number": "+7923923923",
            "default_price": 0.25,
            "location":{
              "type":"Point",
              "coordinates":[90,90]
            },
            "instant_power": 100,
            "chargepoints": [{
                  "id":115,
                  "chargePointHardwareId": "15",
                  "chargePointName": "chargePoint #1",
                  "instantPower": 100,
                  "power": 100,
                  "siteId": "1",
                  "connectors": [{
                    "label": "Type 1",
                    "connectorId":127,
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
                  "id":116,
                  "chargePointHardwareId": "16",
                  "chargePointName": "chargePoint #1",
                  "instantPower": 100,
                  "power": 100,
                  "siteId": "1"}]
            }
          }
        }

#### 3)Удаление Site/Charger/ Connector

> **ВАЖНО!!** Следует учесть, что вы можете удалить только свою Локацию/Станцию/Коннектор. Т.е. ваш userId должен совападать с ownerId
> этих станций, иначе вернет 404. хотя на самом деле станция существует

Site(локация) имеет древовидную структуру, где к Site привязаны зарядные станции(Chargers), а далее к этим станциям привязаны коннекторы(Connector). Каждая зарядная станция имеет один или более коннекторов.
При удалении сайта удалются также и станции, которые к нему привязаны вместе с принадлежащими к ним коннекторами.(**Каскадное удаление**)
Аналогично, при удалении зарядных станций удаляются и его коннекторы

Схема1. Структура Site

```mermaid
graph LR
A(Site 1) --> B(Chager 1 )
A --> C(Charger 2)
B --> G(Connector 1)
B --> D(Connector 2)
C --> E(Connector 1)
C --> F(Connector 2)
```

Удаление коннектора(Connector)

    MUTATION:
    mutation deleteOneConnector($input: DeleteOneConnectorInput!){
    			  deleteOneConnector(input: $input){
    			    id
    			  }
    			}

    HEADERS:
    	{
    		"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9sZWdAaWNhcGlhLmNvbSIsInN1YiI6NCwibmFtZSI6Ik9sZWcgVGFyYXNvdiIsImVtYWlsIjoib2xlZ0BpY2FwaWEuY29tIiwiaWF0IjoxNjg3Mzc1OTQ0LCJleHAiOjE2ODk5Njc5NDR9.dHuR0ety9EgXVJuxrbIRRfG-VevSnaLHqALnsUz2fZ8"
    	}

    VARIABLES:
    {
      "input": {
        "id": 226
      }
    }

Удаление Зарядной станции(Charger/ChargePoint)

    MUTATION:
    mutation deleteOneChargePoint($input: DeleteOneChargePointInput!){
    			  deleteOneChargePoint(input: $input){
    			    id
    			  }
    			}

    HEADERS:
    	{
    		"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9sZWdAaWNhcGlhLmNvbSIsInN1YiI6NCwibmFtZSI6Ik9sZWcgVGFyYXNvdiIsImVtYWlsIjoib2xlZ0BpY2FwaWEuY29tIiwiaWF0IjoxNjg3Mzc1OTQ0LCJleHAiOjE2ODk5Njc5NDR9.dHuR0ety9EgXVJuxrbIRRfG-VevSnaLHqALnsUz2fZ8"
    	}

    VARIABLES:
    {
      "input": {
        "id": 123
      }

Удаление Локации зарядных станций(Site)

    MUTATION:
    mutation deleteOneSite($input: DeleteOneSiteInput!){
    			  deleteOneSite(input: $input){
    			    id
    			  }
    			}

    HEADERS:
    	{
    		"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9sZWdAaWNhcGlhLmNvbSIsInN1YiI6NCwibmFtZSI6Ik9sZWcgVGFyYXNvdiIsImVtYWlsIjoib2xlZ0BpY2FwaWEuY29tIiwiaWF0IjoxNjg3Mzc1OTQ0LCJleHAiOjE2ODk5Njc5NDR9.dHuR0ety9EgXVJuxrbIRRfG-VevSnaLHqALnsUz2fZ8"
    	}

    VARIABLES:
    {
      "input": {
        "id": 123
      }

#### 4)Шаблоны запросов создания/изменения/удаления организации

Создание организации

Удаление организации с отвязкой принадлежащих ему станций(Site)

    MUTATION:
    mutation deleteOrganization($input: CustomDeleteOrganizationInput!){
                deleteOrganization(input: $input){
                  deletedCount
                }
              }

    HEADERS:
    	{
    		"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9sZWdAaWNhcGlhLmNvbSIsInN1YiI6NCwibmFtZSI6Ik9sZWcgVGFyYXNvdiIsImVtYWlsIjoib2xlZ0BpY2FwaWEuY29tIiwiaWF0IjoxNjg3Mzc1OTQ0LCJleHAiOjE2ODk5Njc5NDR9.dHuR0ety9EgXVJuxrbIRRfG-VevSnaLHqALnsUz2fZ8"
    	}

    VARIABLES:
    {
      "input": {
        "organizationId": 39
      }
    }
