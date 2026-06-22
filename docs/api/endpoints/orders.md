# Endpoints — Orders

|                    |                                                       |
| ------------------ | ----------------------------------------------------- |
| **Base path**      | `/:entityId/orders`                                   |
| **Autenticação**   | Ausente em todas as rotas                             |
| **Modelo**         | [Order](../models.md#order)                           |
| **Casos de teste** | [test-cases/orders.md](../../qa/test-cases/orders.md) |

---

> ⚠️ **Nenhuma rota deste módulo exige autenticação.** Qualquer pessoa pode criar, atualizar e deletar pedidos. Ver [BUG-011](../../qa/bugs/BUG-011-orders-no-auth.md).

---

## Sobre

Pedidos são acessados via ID da entidade pai (`entityId`), que pode ser um `User` ou um `Establishment`. O sistema identifica o tipo automaticamente e adapta o comportamento:

- **User** → vê seus próprios pedidos como comprador
- **Establishment** → vê os pedidos recebidos como vendedor

As mesmas rotas atendem os dois contextos. O prefixo muda conforme onde são montadas:

```
/user/:entityId/orders
/establishments/:entityId/orders
```

Existe também uma rota administrativa na raiz:

```
GET /orders   → retorna todos os pedidos sem filtro
```

---

## Índice

- [GET /orders](#get-orders-admin)
- [GET /:entityId/orders](#get-entityidorders)
- [GET /:entityId/orders/:orderId](#get-entityidordersorderid)
- [POST /:entityId/orders](#post-entityidorders)
- [PUT /:entityId/orders/:orderId](#put-entityidordersorderid)
- [DELETE /:entityId/orders/:orderId](#delete-entityidordersorderid)

---

## Máquina de estados

Todo pedido segue um ciclo de vida controlado. Transições fora do fluxo permitido são rejeitadas com `400`.

```
Ordered ──→ Paid ──→ Preparing ──→ Sent ──→ Delivered
   │           │          │
   └──────→ Canceled ←───┘
```

| Status atual | Transições permitidas   |
| ------------ | ----------------------- |
| `Ordered`    | `Paid`, `Canceled`      |
| `Paid`       | `Preparing`, `Canceled` |
| `Preparing`  | `Sent`, `Canceled`      |
| `Sent`       | `Delivered`             |
| `Delivered`  | — (terminal)            |
| `Canceled`   | — (terminal)            |

---

## GET /orders (admin)

Retorna todos os pedidos cadastrados sem filtro por entidade.

### Request

Não requer autenticação ou parâmetros.

### Responses

**200 OK — sucesso**

```json
{
  "message": "Orders fetched successfully",
  "orders": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "orderNumber": "ORD-001",
      "status": "Ordered",
      "userId": "64f1a2b3c4d5e6f7a8b9c0d2",
      "establishmentId": "64f1a2b3c4d5e6f7a8b9c0d3",
      "subtotal": 45.9,
      "shipping": 5.0,
      "totalPrice": 50.9,
      "createdAt": "2025-01-01T12:00:00.000Z",
      "updatedAt": "2025-01-01T12:00:00.000Z"
    }
  ]
}
```

**404 Not Found — lista vazia**

```json
{
  "message": "Orders list empty.",
  "orders": []
}
```

### Comportamento e regras de negócio

- Sem paginação — retorna todos os registros
- Sem populate — retorna apenas IDs das entidades relacionadas
- Destinado a uso administrativo

---

## GET /:entityId/orders

Retorna todos os pedidos de um usuário ou estabelecimento.

### Request

**Path params**

| Parâmetro  | Tipo     | Descrição                        |
| ---------- | -------- | -------------------------------- |
| `entityId` | ObjectId | ID do usuário ou estabelecimento |

### Responses

**200 OK — pedidos de um User**

```json
{
  "message": "Orders fetched successfully",
  "orders": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "orderNumber": "ORD-001",
      "status": "Ordered",
      "establishmentId": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
        "name": "Pizza do João",
        "logo": "1234567890-logo.jpg"
      },
      "products": [
        {
          "productId": {
            "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
            "name": "Pizza Margherita",
            "price": 45.9,
            "productImage": "1234567890-pizza.jpg"
          },
          "quantity": 1,
          "price": 45.9
        }
      ],
      "subtotal": 45.9,
      "shipping": 5.0,
      "totalPrice": 50.9
    }
  ]
}
```

**200 OK — pedidos de um Establishment**

```json
{
  "message": "Orders fetched successfully",
  "orders": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "orderNumber": "ORD-001",
      "status": "Ordered",
      "userId": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
        "name": "João Silva",
        "email": "joao@email.com"
      },
      "products": [
        {
          "productId": {
            "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
            "name": "Pizza Margherita",
            "price": 45.9,
            "productImage": "1234567890-pizza.jpg"
          },
          "quantity": 1,
          "price": 45.9
        }
      ]
    }
  ]
}
```

**404 Not Found — entidade não encontrada**

```json
{
  "message": "Entity not found."
}
```

**404 Not Found — lista vazia**

```json
{
  "message": "Orders list empty.",
  "orders": []
}
```

### Comportamento e regras de negócio

- Quando `entityId` é um **User**: popula `establishmentId` com `name` e `logo`
- Quando `entityId` é um **Establishment**: popula `userId` com `name` e `email`
- Em ambos os casos: popula `products.productId` com `name`, `price` e `productImage`
- Visões diferentes para o mesmo endpoint conforme o tipo da entidade

---

## GET /:entityId/orders/:orderId

Retorna um pedido específico pelo ID.

### Request

**Path params**

| Parâmetro  | Tipo     | Descrição                        |
| ---------- | -------- | -------------------------------- |
| `entityId` | ObjectId | ID do usuário ou estabelecimento |
| `orderId`  | ObjectId | ID do pedido                     |

### Responses

**200 OK — sucesso**

```json
{
  "message": "Order fetched successfully",
  "order": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "orderNumber": "ORD-001",
    "status": "Ordered",
    "userId": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "name": "João Silva",
      "email": "joao@email.com"
    },
    "establishmentId": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "name": "Pizza do João",
      "logo": "1234567890-logo.jpg"
    },
    "products": [
      {
        "productId": {
          "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
          "name": "Pizza Margherita",
          "price": 45.9,
          "productImage": "1234567890-pizza.jpg"
        },
        "quantity": 1,
        "price": 45.9,
        "subtotal": 45.9
      }
    ],
    "subtotal": 45.9,
    "shipping": 5.0,
    "totalPrice": 50.9,
    "deliveryAddress": {
      "street": "Rua das Flores",
      "number": "123",
      "city": "Teresina",
      "state": "PI"
    },
    "payment": {
      "method": "Pix",
      "status": "Pending",
      "transactionId": "TXN-001"
    },
    "notes": "Sem cebola",
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z"
  }
}
```

**404 Not Found — entidade não encontrada**

```json
{
  "message": "Entity not found."
}
```

**404 Not Found — pedido não encontrado**

```json
{
  "message": "Order not found."
}
```

### Comportamento e regras de negócio

- Popula `userId`, `establishmentId` e `products.productId` — response mais completo que `GET /:entityId/orders`
- O `entityId` é validado mas não filtra o pedido — qualquer entidade válida pode acessar qualquer pedido pelo `orderId`

---

## POST /:entityId/orders

Cria um novo pedido.

### Request

**Headers**

```
Content-Type: application/json
```

**Path params**

| Parâmetro  | Tipo     | Descrição                      |
| ---------- | -------- | ------------------------------ |
| `entityId` | ObjectId | ID do usuário criando o pedido |

**Body**

| Campo             | Tipo             | Obrigatório | Notas                           |
| ----------------- | ---------------- | ----------- | ------------------------------- |
| `establishmentId` | ObjectId         | ✅          | Estabelecimento do pedido       |
| `orderNumber`     | String           | ✅          | Único — gerado pelo cliente     |
| `products`        | OrderedProduct[] | ✅          | Lista de itens                  |
| `shipping`        | Number           | ✅          | Custo de entrega                |
| `deliveryAddress` | Address          | ✅          | Snapshot do endereço de entrega |
| `payment`         | PaymentInfo      | ✅          | Dados de pagamento              |
| `notes`           | String           | ❌          | Observações de entrega          |

**Estrutura de `products[]`**

| Campo       | Tipo     | Obrigatório |
| ----------- | -------- | ----------- |
| `productId` | ObjectId | ✅          |
| `name`      | String   | ✅          |
| `price`     | Number   | ✅          |
| `quantity`  | Number   | ✅          |
| `subtotal`  | Number   | ✅          |

**Exemplo**

```json
{
  "establishmentId": "64f1a2b3c4d5e6f7a8b9c0d3",
  "orderNumber": "ORD-001",
  "products": [
    {
      "productId": "64f1a2b3c4d5e6f7a8b9c0d4",
      "name": "Pizza Margherita",
      "price": 45.9,
      "quantity": 1,
      "subtotal": 45.9
    }
  ],
  "shipping": 5.0,
  "deliveryAddress": {
    "street": "Rua das Flores",
    "number": "123",
    "city": "Teresina",
    "state": "PI",
    "country": "Brasil"
  },
  "payment": {
    "method": "Pix",
    "transactionId": "TXN-001"
  }
}
```

### Responses

**201 Created — sucesso**

```json
{
  "message": "Order created successfully",
  "order": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "orderNumber": "ORD-001",
    "status": "Ordered",
    "subtotal": 45.9,
    "shipping": 5.0,
    "totalPrice": 50.9
  }
}
```

**403 Forbidden — estabelecimento tentando criar pedido**

```json
{
  "message": "Only customer users can create orders."
}
```

**404 Not Found — entidade não encontrada**

```json
{
  "message": "Entity not found."
}
```

### Comportamento e regras de negócio

- Apenas entidades do tipo `User` podem criar pedidos — `Establishment` recebe `403`
- `subtotal` e `totalPrice` são **recalculados no servidor**: `subtotal = Σ (price × quantity)`, `totalPrice = subtotal + shipping` — valores enviados no body são ignorados
- `subtotal` de cada `OrderedProduct` individual **não é calculado** pelo servidor — o valor enviado no body é aceito sem validação
- `orderNumber` é gerado pelo cliente — sem validação de formato, apenas unicidade
- Status inicial sempre `Ordered`

---

## PUT /:entityId/orders/:orderId

Atualiza um pedido, incluindo transição de status.

### Request

**Headers**

```
Content-Type: application/json
```

**Path params**

| Parâmetro  | Tipo     | Descrição                        |
| ---------- | -------- | -------------------------------- |
| `entityId` | ObjectId | ID do usuário ou estabelecimento |
| `orderId`  | ObjectId | ID do pedido                     |

**Body**

| Campo     | Tipo        | Notas                                         |
| --------- | ----------- | --------------------------------------------- |
| `status`  | String      | Ver [máquina de estados](#máquina-de-estados) |
| `notes`   | String      |                                               |
| `payment` | PaymentInfo |                                               |

**Exemplo**

```json
{
  "status": "Paid"
}
```

### Responses

**200 OK — sucesso**

```json
{
  "message": "Order updated successfully",
  "order": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "orderNumber": "ORD-001",
    "status": "Paid"
  }
}
```

**400 Bad Request — transição de status inválida**

```json
{
  "message": "Invalid status transition from Ordered to Delivered."
}
```

**404 Not Found — entidade não encontrada**

```json
{
  "message": "Entity not found."
}
```

**404 Not Found — pedido não encontrado**

```json
{
  "message": "Order not found."
}
```

### Comportamento e regras de negócio

- Transições de status são validadas conforme a máquina de estados — transição inválida retorna `400` com mensagem descritiva
- Atualização feita via `Object.assign` + `order.save()`
- Sem restrição de qual tipo de entidade pode fazer qual transição — tanto `User` quanto `Establishment` podem mover o pedido para qualquer status permitido

---

## DELETE /:entityId/orders/:orderId

Remove um pedido.

### Request

**Path params**

| Parâmetro  | Tipo     | Descrição     |
| ---------- | -------- | ------------- |
| `entityId` | ObjectId | ID do usuário |
| `orderId`  | ObjectId | ID do pedido  |

### Responses

**200 OK — sucesso**

```json
{
  "message": "Order deleted successfully"
}
```

**400 Bad Request — estabelecimento tentando deletar pedido**

```json
{
  "message": "Only costumer user can delete order."
}
```

**400 Bad Request — status não permite exclusão**

```json
{
  "message": "You can`t delete this order."
}
```

**404 Not Found — entidade não encontrada**

```json
{
  "message": "Entity not found."
}
```

**404 Not Found — pedido não encontrado**

```json
{
  "message": "Order not found."
}
```

### Comportamento e regras de negócio

- Apenas `User` pode deletar pedidos — `Establishment` recebe `400`
- Somente pedidos com status `Ordered` ou `Paid` podem ser deletados
- Pedidos em `Preparing`, `Sent`, `Delivered` ou `Canceled` não podem ser removidos
- Typo na mensagem de erro: `"costumer"` em vez de `"customer"`
- Typo na mensagem de erro: ``"You can`t"`` usa backtick em vez de apóstrofo

---

## Resumo das rotas

| Método   | Rota                         | Autenticação | Descrição                |
| -------- | ---------------------------- | ------------ | ------------------------ |
| `GET`    | `/orders`                    | ⚠️ Ausente   | Listar todos (admin)     |
| `GET`    | `/:entityId/orders`          | ⚠️ Ausente   | Listar por entidade      |
| `GET`    | `/:entityId/orders/:orderId` | ⚠️ Ausente   | Buscar por ID            |
| `POST`   | `/:entityId/orders`          | ⚠️ Ausente   | Criar pedido             |
| `PUT`    | `/:entityId/orders/:orderId` | ⚠️ Ausente   | Atualizar / mudar status |
| `DELETE` | `/:entityId/orders/:orderId` | ⚠️ Ausente   | Remover pedido           |
