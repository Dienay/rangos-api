# Endpoints — Products

|                    |                                                           |
| ------------------ | --------------------------------------------------------- |
| **Base path**      | `/products`                                               |
| **Autenticação**   | Ausente em todas as rotas                                 |
| **Modelo**         | [Product](../models.md#product)                           |
| **Casos de teste** | [test-cases/products.md](../../qa/test-cases/products.md) |

---

> ⚠️ **Nenhuma rota deste módulo exige autenticação.** Qualquer pessoa pode criar, atualizar e deletar produtos. Ver [BUG-010](../../qa/bugs/BUG-010-products-no-auth.md).

---

## Índice

- [GET /products](#get-products)
- [GET /products/top](#get-productstop)
- [GET /products/search](#get-productssearch)
- [GET /products/:id](#get-productsid)
- [POST /products](#post-products)
- [PUT /products/:id](#put-productsid)
- [DELETE /products/:id](#delete-productsid)

---

## GET /products

Retorna todos os produtos cadastrados.

### Request

Não requer autenticação ou parâmetros.

### Responses

**200 OK — sucesso**

```json
{
  "products": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Pizza Margherita",
      "description": "Molho, mussarela e manjericão",
      "price": 45.9,
      "productImage": "http://localhost:3000/uploads/products/1234567890-pizza.jpg",
      "establishmentId": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
        "name": "Pizza do João",
        "logo": "1234567890-logo.jpg"
      }
    }
  ]
}
```

### Comportamento e regras de negócio

- `productImage` retornado como URL completa: `{protocol}://{host}/uploads/products/{filename}`
- `establishmentId` populado com `name` e `logo` do estabelecimento — `logo` não é retornado como URL completa aqui
- Sem paginação — retorna todos os registros

---

## GET /products/top

Retorna os 10 produtos mais vendidos, ordenados por quantidade total vendida.

### Request

Não requer autenticação ou parâmetros.

### Responses

**200 OK — sucesso**

```json
{
  "topProducts": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Pizza Margherita",
      "price": 45.9,
      "productImage": "http://localhost:3000/uploads/products/1234567890-pizza.jpg",
      "totalSales": 320
    }
  ]
}
```

### Comportamento e regras de negócio

- Resultado calculado via aggregation sobre a coleção `orders`:
  ```
  orders → unwind products → group por productId
         → sum quantity → sort desc → limit 10
         → lookup em products → retorna com detalhes
  ```
- Resultado cacheado no Redis com chave `top-products` por **1 hora**
- Se Redis indisponível, busca diretamente no MongoDB a cada requisição
- Cache limpo automaticamente ao encerrar a aplicação (`SIGINT`, `SIGTERM`)
- `productImage` retornado como URL completa

---

## GET /products/search

Busca produtos por nome.

### Request

**Query params**

| Parâmetro | Tipo   | Obrigatório | Descrição                                  |
| --------- | ------ | ----------- | ------------------------------------------ |
| `name`    | String | ❌          | Termo de busca (parcial, case-insensitive) |

**Exemplo**

```
GET /products/search?name=pizza
```

### Responses

**200 OK — resultados encontrados**

```json
{
  "products": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Pizza Margherita",
      "price": 45.9,
      "productImage": "1234567890-pizza.jpg"
    }
  ]
}
```

**200 OK — nenhum resultado**

```json
{
  "message": "Product ( pizza ) is not found."
}
```

### Comportamento e regras de negócio

- Busca via regex MongoDB (`$regex`, `$options: 'i'`) — aceita termos parciais
- Retorna `200` mesmo quando não há resultados — sem uso de `404`
- `productImage` não retornado como URL completa neste endpoint

---

## GET /products/:id

Retorna um produto pelo ID.

### Request

**Path params**

| Parâmetro | Tipo     | Descrição     |
| --------- | -------- | ------------- |
| `id`      | ObjectId | ID do produto |

### Responses

**200 OK — sucesso**

```json
{
  "product": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Pizza Margherita",
    "description": "Molho, mussarela e manjericão",
    "price": 45.9,
    "productImage": "http://localhost:3000/uploads/products/1234567890-pizza.jpg",
    "establishmentId": "64f1a2b3c4d5e6f7a8b9c0d2"
  }
}
```

**404 Not Found — produto não encontrado**

```json
{
  "message": "Product Id not found.",
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

- `productImage` retornado como URL completa
- `establishmentId` retornado como ObjectId simples — diferente de `GET /products` que popula o estabelecimento

---

## POST /products

Cria um novo produto.

### Request

**Headers**

```
Content-Type: multipart/form-data
```

**Body**

| Campo             | Tipo     | Obrigatório | Notas                                                 |
| ----------------- | -------- | ----------- | ----------------------------------------------------- |
| `name`            | String   | ✅          |                                                       |
| `price`           | Number   | ✅          |                                                       |
| `establishmentId` | ObjectId | ✅          | Referência para um estabelecimento existente          |
| `description`     | String   | ❌          |                                                       |
| `productImage`    | File     | ❌          | Imagem (`png`, `jpeg`, `jpg`, `gif`, `svg`) — max 8MB |

**Exemplo**

```json
{
  "name": "Pizza Margherita",
  "price": 45.9,
  "establishmentId": "64f1a2b3c4d5e6f7a8b9c0d2",
  "description": "Molho, mussarela e manjericão"
}
```

### Responses

**201 Created — sucesso**

```json
{
  "message": "Product created successfully.",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Pizza Margherita",
    "description": "Molho, mussarela e manjericão",
    "price": 45.9,
    "productImage": "1234567890-pizza.jpg",
    "establishmentId": "64f1a2b3c4d5e6f7a8b9c0d2"
  }
}
```

**500 Internal Server Error — campos obrigatórios ausentes**

```json
{
  "message": "Found errors: Path 'name' is required; Path 'price' is required",
  "status": 500
}
```

> ⚠️ Campos obrigatórios ausentes retornam `500` em vez de `400`. Ver [BUG-005](../../qa/bugs/BUG-005-missing-fields-500.md).

### Comportamento e regras de negócio

- Não verifica se `establishmentId` referencia um estabelecimento existente — aceita qualquer ObjectId válido
- `productImage` salvo apenas como nome do arquivo — não como URL completa
- Sem verificação de produto duplicado

---

## PUT /products/:id

Atualiza os dados de um produto. Suporta upload de nova imagem.

### Request

**Headers**

```
Content-Type: multipart/form-data
```

**Path params**

| Parâmetro | Tipo     | Descrição     |
| --------- | -------- | ------------- |
| `id`      | ObjectId | ID do produto |

**Body**

Todos os campos são opcionais — enviar apenas os campos a atualizar.

| Campo             | Tipo     | Notas                       |
| ----------------- | -------- | --------------------------- |
| `name`            | String   |                             |
| `price`           | Number   |                             |
| `description`     | String   |                             |
| `establishmentId` | ObjectId |                             |
| `productImage`    | File     | Substitui a imagem anterior |

### Responses

**200 OK — sucesso**

```json
{
  "message": "Product updated successfully",
  "product": {
    "name": "Pizza Margherita Especial",
    "price": 49.9
  }
}
```

**404 Not Found — produto não encontrado**

```json
{
  "message": "Product Id not found.",
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

- Se uma nova `productImage` for enviada, o arquivo anterior é deletado do disco antes de salvar o novo
- Se o arquivo anterior não existir no disco, a atualização prossegue normalmente
- Validação via `new Product(newData).validateSync()` antes de persistir
- A resposta retorna `product: newData` — os dados enviados no body, não o documento atualizado do banco. Campos não enviados não aparecem na resposta mesmo existindo no banco

---

## DELETE /products/:id

Remove um produto permanentemente.

### Request

**Path params**

| Parâmetro | Tipo     | Descrição     |
| --------- | -------- | ------------- |
| `id`      | ObjectId | ID do produto |

### Responses

**200 OK — sucesso**

```json
{
  "message": "Product deleted successfully",
  "product": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Pizza Margherita",
    "price": 45.9,
    "productImage": "1234567890-pizza.jpg",
    "establishmentId": "64f1a2b3c4d5e6f7a8b9c0d2"
  }
}
```

**404 Not Found — produto não encontrado**

```json
{
  "message": "Product Id not found.",
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

- O arquivo de `productImage` é deletado do disco junto com o registro
- Pedidos que referenciam o produto deletado **não são afetados** — o snapshot em `OrderedProduct` preserva `name` e `price`

---

## Resumo das rotas

| Método   | Rota               | Autenticação | Cache       | Descrição            |
| -------- | ------------------ | ------------ | ----------- | -------------------- |
| `GET`    | `/products`        | ⚠️ Ausente   | ❌          | Listar todos         |
| `GET`    | `/products/top`    | ⚠️ Ausente   | ✅ Redis 1h | Top 10 mais vendidos |
| `GET`    | `/products/search` | ⚠️ Ausente   | ❌          | Buscar por nome      |
| `GET`    | `/products/:id`    | ⚠️ Ausente   | ❌          | Buscar por ID        |
| `POST`   | `/products`        | ⚠️ Ausente   | ❌          | Criar produto        |
| `PUT`    | `/products/:id`    | ⚠️ Ausente   | ❌          | Atualizar produto    |
| `DELETE` | `/products/:id`    | ⚠️ Ausente   | ❌          | Remover produto      |
