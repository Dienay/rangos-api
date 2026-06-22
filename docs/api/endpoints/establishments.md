# Endpoints — Establishments

|                    |                                                                       |
| ------------------ | --------------------------------------------------------------------- |
| **Base path**      | `/establishments`                                                     |
| **Autenticação**   | Ausente em todas as rotas                                             |
| **Modelo**         | [Establishment](../models.md#establishment)                           |
| **Casos de teste** | [test-cases/establishments.md](../../qa/test-cases/establishments.md) |

---

> ⚠️ **Nenhuma rota deste módulo exige autenticação.** Qualquer pessoa pode criar, atualizar e deletar estabelecimentos. Ver [BUG-008](../../qa/bugs/BUG-008-establishments-no-auth.md).

---

## Índice

- [GET /establishments](#get-establishments)
- [GET /establishments/search](#get-establishmentssearch)
- [GET /establishments/:id](#get-establishmentsid)
- [GET /establishments/:id/products](#get-establishmentsidproducts)
- [POST /establishments](#post-establishments)
- [PUT /establishments/:id](#put-establishmentsid)
- [DELETE /establishments/:id](#delete-establishmentsid)

> Endereços do estabelecimento estão em [addresses.md](addresses.md).
> Pedidos do estabelecimento estão em [orders.md](orders.md).

---

## GET /establishments

Retorna todos os estabelecimentos cadastrados.

### Request

Não requer autenticação ou parâmetros.

### Responses

**200 OK — sucesso**

```json
{
  "establishments": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Pizza do João",
      "category": "Pizzeria",
      "logo": "http://localhost:3000/uploads/establishments/1234567890-logo.jpg",
      "deliveryTime": { "min": 30, "max": 50 },
      "shippingCost": 5.0,
      "openingHours": [
        {
          "day": "Monday",
          "periods": [{ "open": "11:00", "close": "23:00" }]
        }
      ],
      "rating": { "average": 4.5, "count": 120 },
      "paymentMethods": ["Pix", "CreditCard"],
      "address": []
    }
  ]
}
```

### Comportamento e regras de negócio

- `logo` é retornado como URL completa: `{protocol}://{host}/uploads/establishments/{filename}`
- Sem paginação — retorna todos os registros

---

## GET /establishments/search

Busca estabelecimentos por nome.

### Request

**Query params**

| Parâmetro | Tipo   | Obrigatório | Descrição                                  |
| --------- | ------ | ----------- | ------------------------------------------ |
| `name`    | String | ❌          | Termo de busca (parcial, case-insensitive) |

**Exemplo**

```
GET /establishments/search?name=pizza
```

### Responses

**200 OK — resultados encontrados**

```json
{
  "establishments": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Pizza do João",
      "category": "Pizzeria"
    }
  ]
}
```

**200 OK — nenhum resultado**

```json
{
  "message": "Establishment ( pizza ) is not found."
}
```

### Comportamento e regras de negócio

- Busca via regex MongoDB (`$regex`, `$options: 'i'`) — aceita termos parciais
- Retorna `200` mesmo quando não há resultados — sem uso de `404`
- Sem `logo` como URL completa neste endpoint — retorna apenas o nome do arquivo

---

## GET /establishments/:id

Retorna um estabelecimento pelo ID.

### Request

**Path params**

| Parâmetro | Tipo     | Descrição             |
| --------- | -------- | --------------------- |
| `id`      | ObjectId | ID do estabelecimento |

### Responses

**200 OK — sucesso**

```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Pizza do João",
  "category": "Pizzeria",
  "logo": "http://localhost:3000/uploads/establishments/1234567890-logo.jpg",
  "deliveryTime": { "min": 30, "max": 50 },
  "shippingCost": 5.0,
  "openingHours": [],
  "rating": { "average": 4.5, "count": 120 },
  "paymentMethods": ["Pix"],
  "address": []
}
```

**404 Not Found — estabelecimento não encontrado**

```json
{
  "message": "Establishment Id not found.",
  "status": 404
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

- `logo` retornado como URL completa
- Retorna o documento completo sem envelope `{ establishment: ... }` — diferente dos outros endpoints de busca por ID

---

## GET /establishments/:id/products

Retorna um estabelecimento com a lista de produtos vinculados.

### Request

**Path params**

| Parâmetro | Tipo     | Descrição             |
| --------- | -------- | --------------------- |
| `id`      | ObjectId | ID do estabelecimento |

### Responses

**200 OK — com produtos**

```json
{
  "establishment": {
    "name": "Pizza do João",
    "logo": "http://localhost:3000/uploads/establishments/1234567890-logo.jpg",
    "category": "Pizzeria",
    "deliveryTime": { "min": 30, "max": 50 },
    "shippingCost": 5.0,
    "address": []
  },
  "products": [
    {
      "name": "Pizza Margherita",
      "description": "Molho, mussarela e manjericão",
      "price": 45.9,
      "productImage": "http://localhost:3000/uploads/products/1234567890-pizza.jpg"
    }
  ]
}
```

**200 OK — sem produtos**

```json
{
  "establishment": {
    "name": "Pizza do João",
    "logo": "http://localhost:3000/uploads/establishments/1234567890-logo.jpg"
  },
  "products": []
}
```

**404 Not Found — estabelecimento não encontrado**

```json
{
  "message": "Establishment Id not found.",
  "status": 404
}
```

### Comportamento e regras de negócio

- Quando há produtos, retorna dados completos do estabelecimento
- Quando não há produtos, retorna apenas `name` e `logo` do estabelecimento — subconjunto menor que o cenário com produtos
- `productImage` retornado como URL completa
- Estabelecimento não encontrado usa `next(error)` enquanto lista vazia retorna `200` diretamente — comportamento inconsistente entre os dois cenários de "sem resultado"

---

## POST /establishments

Cria um novo estabelecimento.

### Request

**Headers**

```
Content-Type: multipart/form-data
```

**Body**

| Campo            | Tipo          | Obrigatório | Notas                                                             |
| ---------------- | ------------- | ----------- | ----------------------------------------------------------------- |
| `name`           | String        | ✅          | Deve ser único                                                    |
| `openingHours`   | String (JSON) | ✅          | Enviar como JSON serializado — ver abaixo                         |
| `category`       | String        | ❌          | Ver [categorias disponíveis](../models.md#categorias-disponíveis) |
| `deliveryTime`   | String (JSON) | ❌          | Enviar como JSON serializado                                      |
| `shippingCost`   | Number        | ❌          | min: 0                                                            |
| `paymentMethods` | String[]      | ❌          |                                                                   |
| `services`       | String[]      | ❌          |                                                                   |
| `logo`           | File          | ❌          | Imagem (`png`, `jpeg`, `jpg`, `gif`, `svg`) — max 8MB             |

**Formato de `openingHours`**

Como o endpoint usa `multipart/form-data`, campos complexos devem ser enviados como string JSON:

```json
"[{\"day\":\"Monday\",\"periods\":[{\"open\":\"11:00\",\"close\":\"23:00\"}]}]"
```

### Responses

**201 Created — sucesso**

```json
{
  "message": "Establishment created successfully.",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Pizza do João",
    "category": "Pizzeria",
    "logo": "1234567890-logo.jpg",
    "openingHours": [],
    "rating": { "average": 0, "count": 0 },
    "paymentMethods": [],
    "services": []
  }
}
```

**409 Conflict — nome já cadastrado**

```json
{
  "message": "Establishment with the same name already exists."
}
```

### Comportamento e regras de negócio

- `openingHours` e `address` são parseados de string JSON pelo middleware `parseJsonFields` antes de chegar ao controller
- `logo` salvo apenas como nome do arquivo — não como URL completa
- Unicidade de nome verificada no código via `findOne`, sem índice único no banco

> ⚠️ O middleware `parseJsonFields` tem um bug: o `return` dentro do `forEach` não interrompe a execução quando o JSON é inválido — `next()` é chamado mesmo após o erro. Ver [BUG-009](../../qa/bugs/BUG-009-parse-json-fields.md).

---

## PUT /establishments/:id

Atualiza os dados de um estabelecimento. Suporta upload de novo logo.

### Request

**Headers**

```
Content-Type: multipart/form-data
```

**Path params**

| Parâmetro | Tipo     | Descrição             |
| --------- | -------- | --------------------- |
| `id`      | ObjectId | ID do estabelecimento |

**Body**

Todos os campos são opcionais — enviar apenas os campos a atualizar.

| Campo            | Tipo          | Notas                        |
| ---------------- | ------------- | ---------------------------- |
| `name`           | String        |                              |
| `category`       | String        | Ver categorias disponíveis   |
| `openingHours`   | String (JSON) | Enviar como JSON serializado |
| `deliveryTime`   | String (JSON) | Enviar como JSON serializado |
| `shippingCost`   | Number        |                              |
| `paymentMethods` | String[]      |                              |
| `services`       | String[]      |                              |
| `logo`           | File          | Substitui o logo anterior    |

### Responses

**200 OK — sucesso**

```json
{
  "message": "Establishment updated successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Pizza do João Atualizado",
    "category": "Pizzeria"
  }
}
```

**404 Not Found — estabelecimento não encontrado**

```json
{
  "message": "Establishment Id not found.",
  "status": 404
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

- Se um novo `logo` for enviado, o arquivo anterior é deletado do disco antes de salvar o novo
- Se o arquivo anterior não existir no disco, a atualização prossegue normalmente
- Validação via `new Establishment(newData).validateSync()` antes de persistir

---

## DELETE /establishments/:id

Remove um estabelecimento permanentemente.

### Request

**Path params**

| Parâmetro | Tipo     | Descrição             |
| --------- | -------- | --------------------- |
| `id`      | ObjectId | ID do estabelecimento |

### Responses

**200 OK — sucesso**

```json
{
  "message": "Establishment deleted successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Pizza do João"
  }
}
```

**404 Not Found — estabelecimento não encontrado**

```json
{
  "message": "Establishment Id not found.",
  "status": 404
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

- O arquivo de `logo` é deletado do disco junto com o registro
- Produtos e pedidos vinculados ao estabelecimento **não são removidos** em cascata

---

## Resumo das rotas

| Método   | Rota                           | Autenticação | Descrição                 |
| -------- | ------------------------------ | ------------ | ------------------------- |
| `GET`    | `/establishments`              | ⚠️ Ausente   | Listar todos              |
| `GET`    | `/establishments/search`       | ⚠️ Ausente   | Buscar por nome           |
| `GET`    | `/establishments/:id`          | ⚠️ Ausente   | Buscar por ID             |
| `GET`    | `/establishments/:id/products` | ⚠️ Ausente   | Buscar com produtos       |
| `POST`   | `/establishments`              | ⚠️ Ausente   | Criar estabelecimento     |
| `PUT`    | `/establishments/:id`          | ⚠️ Ausente   | Atualizar estabelecimento |
| `DELETE` | `/establishments/:id`          | ⚠️ Ausente   | Remover estabelecimento   |
