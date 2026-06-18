# Endpoints — Addresses

|                    |                                                                 |
| ------------------ | --------------------------------------------------------------- |
| **Base path**      | `/user/:entityId/address` · `/establishments/:entityId/address` |
| **Autenticação**   | Requerida em GET, POST e PUT (Bearer Token)                     |
| **Modelo**         | [Address](../models.md#address)                                 |
| **Casos de teste** | [test-cases/addresses.md](../../qa/test-cases/addresses.md)     |

---

## Sobre

Endereços são subdocumentos — não possuem coleção própria no banco. Vivem dentro de `User` ou `Establishment` e são acessados via ID da entidade pai (`entityId`).

As mesmas rotas e o mesmo controller atendem usuários e estabelecimentos. O sistema identifica automaticamente o tipo da entidade pelo `entityId`.

---

## Índice

- [GET /:entityId/address](#get-entityidaddress)
- [POST /:entityId/address](#post-entityidaddress)
- [PUT /:entityId/address/:addressId](#put-entityidaddressaddressid)
- [DELETE /:entityId/address/:addressId](#delete-entityidaddressaddressid)

---

## GET /:entityId/address

Retorna todos os endereços de um usuário ou estabelecimento.

### Request

**Headers**

```
Authorization: Bearer <token>
```

**Path params**

| Parâmetro  | Tipo     | Descrição                        |
| ---------- | -------- | -------------------------------- |
| `entityId` | ObjectId | ID do usuário ou estabelecimento |

### Responses

**200 OK — sucesso**

```json
{
  "address": [
    {
      "street": "Rua das Flores",
      "number": "123",
      "complement": "Apto 4",
      "neighborhood": "Centro",
      "city": "Teresina",
      "state": "PI",
      "postalCode": "64000-000",
      "country": "Brasil",
      "description": "Casa"
    }
  ]
}
```

**401 Unauthorized — token ausente**

```json
{
  "message": "Access denied. No token provided."
}
```

**404 Not Found — entidade não encontrada**

```json
{
  "message": "Entity not found."
}
```

**400 Bad Request — ID com formato inválido**

```json
{
  "message": "Bad Request: incorrect input data",
  "status": 400
}
```

---

## POST /:entityId/address

Adiciona um novo endereço a um usuário ou estabelecimento.

### Request

**Headers**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path params**

| Parâmetro  | Tipo     | Descrição                        |
| ---------- | -------- | -------------------------------- |
| `entityId` | ObjectId | ID do usuário ou estabelecimento |

**Body**

| Campo          | Tipo   | Obrigatório | Notas                      |
| -------------- | ------ | ----------- | -------------------------- |
| `street`       | String | ✅          |                            |
| `number`       | String | ✅          | Aceita `"S/N"`, `"101A"`   |
| `city`         | String | ✅          |                            |
| `state`        | String | ✅          |                            |
| `description`  | String | ❌          | Ex: `"Casa"`, `"Trabalho"` |
| `complement`   | String | ❌          |                            |
| `neighborhood` | String | ❌          |                            |
| `postalCode`   | String | ❌          |                            |
| `country`      | String | ❌          | default: `"Unknown"`       |

**Exemplo**

```json
{
  "street": "Rua das Flores",
  "number": "123",
  "neighborhood": "Centro",
  "city": "Teresina",
  "state": "PI",
  "postalCode": "64000-000",
  "country": "Brasil",
  "description": "Casa"
}
```

### Responses

**200 OK — sucesso**

```json
{
  "message": "Address added successfully",
  "address": [
    {
      "street": "Rua das Flores",
      "number": "123",
      "neighborhood": "Centro",
      "city": "Teresina",
      "state": "PI",
      "postalCode": "64000-000",
      "country": "Brasil",
      "description": "Casa"
    }
  ]
}
```

> A resposta retorna o array completo de endereços da entidade, não apenas o endereço adicionado.

**409 Conflict — endereço já existe**

```json
{
  "message": "Address already exists."
}
```

**401 Unauthorized — token ausente**

```json
{
  "message": "Access denied. No token provided."
}
```

**404 Not Found — entidade não encontrada**

```json
{
  "message": "Entity not found."
}
```

### Comportamento e regras de negócio

- Duplicidade verificada comparando `street`, `number`, `city` e `state` — campos suficientes para identificar unicidade
- A verificação é feita no código, sem índice único no banco
- Não há limite de endereços por entidade

---

## PUT /:entityId/address/:addressId

Atualiza um endereço existente.

### Request

**Headers**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path params**

| Parâmetro   | Tipo     | Descrição                        |
| ----------- | -------- | -------------------------------- |
| `entityId`  | ObjectId | ID do usuário ou estabelecimento |
| `addressId` | ObjectId | ID do endereço                   |

**Body**

Todos os campos são opcionais — enviar apenas os campos a atualizar.

| Campo          | Tipo   | Notas |
| -------------- | ------ | ----- |
| `street`       | String |       |
| `number`       | String |       |
| `complement`   | String |       |
| `neighborhood` | String |       |
| `city`         | String |       |
| `state`        | String |       |
| `postalCode`   | String |       |
| `country`      | String |       |
| `description`  | String |       |

**Exemplo**

```json
{
  "complement": "Apto 4",
  "postalCode": "64001-000"
}
```

### Responses

**200 OK — sucesso**

```json
{
  "message": "Address updated successfully",
  "address": {
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apto 4",
    "neighborhood": "Centro",
    "city": "Teresina",
    "state": "PI",
    "postalCode": "64001-000",
    "country": "Brasil",
    "description": "Casa"
  }
}
```

**401 Unauthorized — token ausente**

```json
{
  "message": "Access denied. No token provided."
}
```

**404 Not Found — entidade não encontrada**

```json
{
  "message": "Entity not found."
}
```

**404 Not Found — endereço não encontrado**

```json
{
  "message": "Address not found."
}
```

### Comportamento e regras de negócio

- Atualização feita via `Object.assign` diretamente no subdocumento, seguido de `entity.save()`
- A resposta retorna apenas o endereço atualizado, não o array completo

---

## DELETE /:entityId/address/:addressId

Remove um endereço de um usuário ou estabelecimento.

### Request

> ⚠️ **Esta rota não exige autenticação.** Qualquer requisição com IDs válidos pode deletar um endereço. Ver [BUG-007](../../qa/bugs/BUG-007-delete-address-no-auth.md).

**Path params**

| Parâmetro   | Tipo     | Descrição                        |
| ----------- | -------- | -------------------------------- |
| `entityId`  | ObjectId | ID do usuário ou estabelecimento |
| `addressId` | ObjectId | ID do endereço                   |

### Responses

**200 OK — sucesso**

```json
{
  "message": "Address deleted successfully"
}
```

**404 Not Found — entidade não encontrada**

```json
{
  "message": "Entity not found."
}
```

**404 Not Found — endereço não encontrado**

```json
{
  "message": "Address not found."
}
```

**400 Bad Request — ID com formato inválido**

```json
{
  "message": "Bad Request: incorrect input data",
  "status": 400
}
```

### Comportamento e regras de negócio

- Remoção feita via `splice` no array de subdocumentos, seguido de `entity.save()`
- Operação irreversível — não há soft delete

---

## Resumo das rotas

| Método   | Rota                            | Autenticação | Descrição          |
| -------- | ------------------------------- | ------------ | ------------------ |
| `GET`    | `/:entityId/address`            | ✅           | Listar endereços   |
| `POST`   | `/:entityId/address`            | ✅           | Adicionar endereço |
| `PUT`    | `/:entityId/address/:addressId` | ✅           | Atualizar endereço |
| `DELETE` | `/:entityId/address/:addressId` | ⚠️ Ausente   | Remover endereço   |

> As rotas funcionam tanto para usuários (`/user/:entityId/address`) quanto para estabelecimentos (`/establishments/:entityId/address`).
