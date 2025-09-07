# Blockchain API

по два ендпоинта для двух sei(EVM) и Cosmos(ATOM) 

## Установка

```bash
npm install
```

## Настройка переменных окружения

Скопируйте файл `environment.example` в `.env` и настройте параметры:

## Запуск

```bash
# Разработка
npm run start:dev
```

## API Endpoints

### EVM
- `GET /evm/block/:height` - получить блок из сети SEI по высоте
- `GET /evm/transactions/:hash` - получить транзакцию из сети SEI по хешу

### Cosmos
- `GET /cosmos/block/:height` - получить блок из блокчейна Cosmos по высоте
- `GET /cosmos/transactions/:hash` - получить транзакцию из блокчейна Cosmos по хешу