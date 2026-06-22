# Test Cases — Orders

|                 |                                                                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Módulo**      | Pedidos                                                                                                                                                                        |
| **Endpoints**   | `GET /orders` · `GET /:entityId/orders` · `GET /:entityId/orders/:orderId` · `POST /:entityId/orders` · `PUT /:entityId/orders/:orderId` · `DELETE /:entityId/orders/:orderId` |
| **Referências** | [test-strategy.md](../test-strategy.md) · [orders.md](../../api/endpoints/orders.md)                                                                                           |
| **Casos**       | 27 total · 1 executados · 26 pendentes                                                                                                                                         |

---

## Pré-condições gerais

- API em execução
- Banco de dados limpo antes de cada caso de teste
- Nenhuma rota deste módulo exige autenticação — ausência documentada em [BUG-011](../bugs/BUG-011-orders-no-auth.md)
- `entityId` pode ser um `User` ou `Establishment` — casos especificam o tipo quando o comportamento difere

---

## Payload base para criação de pedido

Reutilizado nos casos de teste de `POST`. Substitua os IDs conforme necessário.

```json
{
  "establishmentId": "64f1a2b3c4d5e6f7a8b9c0d3",
  "orderNumber": "ORD-001",
  "products": [
    {
      "productId": "64f1a2b3c4d5e6f7a8b9c0d4",
      "name": "Pizza Margherita",
      "price": 45.9,
      "quantity": 2,
      "subtotal": 91.8
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

---

## GET /orders

---

### TC-ORD-001 — Listar todos os pedidos

| Campo          | Detalhe                 |
| -------------- | ----------------------- |
| **ID**         | TC-ORD-001              |
| **Título**     | Listar todos os pedidos |
| **Tipo**       | Funcional — sucesso     |
| **Prioridade** | Média                   |
| **Status**     | 🔜 Pendente             |

**Pré-condições**

- Ao menos um pedido cadastrado no banco

**Dados de entrada**

```
GET /orders
```

**Resultado esperado**

- Status `200 OK`
- Mensagem: `"Orders fetched successfully"`
- Body contém array `orders` sem populate — apenas IDs das entidades relacionadas

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-002 — Listar todos os pedidos com banco vazio

| Campo          | Detalhe                                 |
| -------------- | --------------------------------------- |
| **ID**         | TC-ORD-002                              |
| **Título**     | Listar todos os pedidos com banco vazio |
| **Tipo**       | Funcional — lista vazia                 |
| **Prioridade** | Baixa                                   |
| **Status**     | 🔜 Pendente                             |

**Dados de entrada**

```
GET /orders
```

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "Orders list empty.", "orders": [] }`

> ⚠️ Lista vazia retorna `404` neste endpoint — comportamento diferente de outros módulos que retornam `200` com array vazio.

**Resultado atual**

- 🔜 Pendente

---

## GET /:entityId/orders

---

### TC-ORD-003 — Listar pedidos de um usuário

| Campo          | Detalhe                      |
| -------------- | ---------------------------- |
| **ID**         | TC-ORD-003                   |
| **Título**     | Listar pedidos de um usuário |
| **Tipo**       | Funcional — sucesso          |
| **Prioridade** | Alta                         |
| **Status**     | 🔜 Pendente                  |

**Pré-condições**

- Usuário com ao menos um pedido cadastrado

**Dados de entrada**

```
GET /user/:entityId/orders
```

**Resultado esperado**

- Status `200 OK`
- Body contém array `orders`
- `establishmentId` populado com `name` e `logo`
- `products.productId` populado com `name`, `price` e `productImage`
- `userId` **não aparece** na resposta (perspectiva do comprador)

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-004 — Listar pedidos de um estabelecimento

| Campo          | Detalhe                              |
| -------------- | ------------------------------------ |
| **ID**         | TC-ORD-004                           |
| **Título**     | Listar pedidos de um estabelecimento |
| **Tipo**       | Funcional — sucesso                  |
| **Prioridade** | Alta                                 |
| **Status**     | 🔜 Pendente                          |

**Pré-condições**

- Estabelecimento com ao menos um pedido cadastrado

**Dados de entrada**

```
GET /establishments/:entityId/orders
```

**Resultado esperado**

- Status `200 OK`
- Body contém array `orders`
- `userId` populado com `name` e `email`
- `products.productId` populado com `name`, `price` e `productImage`
- `establishmentId` **não aparece** na resposta (perspectiva do vendedor)

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-005 — Listar pedidos de entidade sem pedidos

| Campo          | Detalhe                                            |
| -------------- | -------------------------------------------------- |
| **ID**         | TC-ORD-005                                         |
| **Título**     | Listar pedidos de entidade sem pedidos cadastrados |
| **Tipo**       | Funcional — lista vazia                            |
| **Prioridade** | Média                                              |
| **Status**     | 🔜 Pendente                                        |

**Pré-condições**

- Usuário sem pedidos

**Dados de entrada**

```
GET /user/:entityId/orders
```

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "Orders list empty.", "orders": [] }`

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-006 — Listar pedidos com entityId inexistente

| Campo          | Detalhe                                 |
| -------------- | --------------------------------------- |
| **ID**         | TC-ORD-006                              |
| **Título**     | Listar pedidos com entityId inexistente |
| **Tipo**       | Negativo — recurso não encontrado       |
| **Prioridade** | Alta                                    |
| **Status**     | 🔜 Pendente                             |

**Dados de entrada**

```
GET /user/64f1a2b3c4d5e6f7a8b9c0d1/orders
```

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "Entity not found." }`

**Resultado atual**

- 🔜 Pendente

---

## GET /:entityId/orders/:orderId

---

### TC-ORD-007 — Buscar pedido por ID

| Campo          | Detalhe              |
| -------------- | -------------------- |
| **ID**         | TC-ORD-007           |
| **Título**     | Buscar pedido por ID |
| **Tipo**       | Funcional — sucesso  |
| **Prioridade** | Alta                 |
| **Status**     | 🔜 Pendente          |

**Pré-condições**

- Pedido cadastrado no banco

**Dados de entrada**

```
GET /user/:entityId/orders/:orderId
```

**Resultado esperado**

- Status `200 OK`
- Body contém `order` com todos os campos
- `userId`, `establishmentId` e `products.productId` populados
- `deliveryAddress` e `payment` presentes

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-008 — Buscar pedido com orderId inexistente

| Campo          | Detalhe                               |
| -------------- | ------------------------------------- |
| **ID**         | TC-ORD-008                            |
| **Título**     | Buscar pedido com orderId inexistente |
| **Tipo**       | Negativo — recurso não encontrado     |
| **Prioridade** | Alta                                  |
| **Status**     | 🔜 Pendente                           |

**Pré-condições**

- Usuário válido

**Dados de entrada**

```
GET /user/:entityId/orders/64f1a2b3c4d5e6f7a8b9c0d9
```

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "Order not found." }`

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-009 — Verificar que qualquer entidade acessa qualquer pedido pelo orderId

| Campo          | Detalhe                                              |
| -------------- | ---------------------------------------------------- |
| **ID**         | TC-ORD-009                                           |
| **Título**     | Verificar que entityId não filtra o pedido retornado |
| **Tipo**       | Segurança — acesso indevido                          |
| **Prioridade** | Alta                                                 |
| **Status**     | 🔜 Pendente                                          |

**Pré-condições**

- Dois usuários distintos (A e B)
- Pedido criado pelo usuário A

**Passos**

1. Buscar pedido do usuário A usando o `entityId` do usuário B

```
GET /user/:entityIdB/orders/:orderIdA
```

**Resultado esperado**

- Status `404 Not Found` — usuário B não deveria acessar pedido de A

**Resultado atual**

- ❌ Status `200 OK` — `entityId` é validado mas não filtra o pedido; qualquer entidade válida acessa qualquer pedido pelo `orderId`

---

## POST /:entityId/orders

---

### TC-ORD-010 — Criar pedido como usuário

| Campo          | Detalhe                   |
| -------------- | ------------------------- |
| **ID**         | TC-ORD-010                |
| **Título**     | Criar pedido como usuário |
| **Tipo**       | Funcional — sucesso       |
| **Prioridade** | Alta                      |
| **Status**     | 🔜 Pendente               |

**Pré-condições**

- Usuário cadastrado no banco

**Dados de entrada**

Ver [payload base](#payload-base-para-criação-de-pedido).

**Resultado esperado**

- Status `201 Created`
- Mensagem: `"Order created successfully"`
- Body contém `_id`, `orderNumber`, `status: "Ordered"`, `subtotal`, `totalPrice`

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-011 — Verificar cálculo de subtotal e totalPrice

| Campo          | Detalhe                                                |
| -------------- | ------------------------------------------------------ |
| **ID**         | TC-ORD-011                                             |
| **Título**     | Verificar que servidor recalcula subtotal e totalPrice |
| **Tipo**       | Funcional — regra de negócio                           |
| **Prioridade** | Alta                                                   |
| **Status**     | 🔜 Pendente                                            |

**Pré-condições**

- Usuário cadastrado no banco

**Dados de entrada**

```json
{
  "establishmentId": "64f1a2b3c4d5e6f7a8b9c0d3",
  "orderNumber": "ORD-002",
  "products": [
    {
      "productId": "64f1a2b3c4d5e6f7a8b9c0d4",
      "name": "Pizza Margherita",
      "price": 45.9,
      "quantity": 2,
      "subtotal": 0
    }
  ],
  "shipping": 5.0,
  "subtotal": 0,
  "totalPrice": 0,
  "deliveryAddress": {
    "street": "Rua das Flores",
    "number": "123",
    "city": "Teresina",
    "state": "PI",
    "country": "Brasil"
  },
  "payment": { "method": "Pix", "transactionId": "TXN-002" }
}
```

> Valores de `subtotal` e `totalPrice` enviados como `0` intencionalmente para verificar se o servidor recalcula.

**Resultado esperado**

- Status `201 Created`
- `subtotal` retornado como `91.80` (45.90 × 2)
- `totalPrice` retornado como `96.80` (91.80 + 5.00)

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-012 — Criar pedido como estabelecimento

| Campo          | Detalhe                           |
| -------------- | --------------------------------- |
| **ID**         | TC-ORD-012                        |
| **Título**     | Criar pedido como estabelecimento |
| **Tipo**       | Negativo — regra de negócio       |
| **Prioridade** | Alta                              |
| **Status**     | 🔜 Pendente                       |

**Pré-condições**

- Estabelecimento cadastrado no banco

**Dados de entrada**

Ver [payload base](#payload-base-para-criação-de-pedido) com `entityId` de um estabelecimento.

**Resultado esperado**

- Status `403 Forbidden`
- Body: `{ "message": "Only customer users can create orders." }`

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-013 — Criar pedido com orderNumber duplicado

| Campo          | Detalhe                                |
| -------------- | -------------------------------------- |
| **ID**         | TC-ORD-013                             |
| **Título**     | Criar pedido com orderNumber duplicado |
| **Tipo**       | Negativo — duplicidade                 |
| **Prioridade** | Alta                                   |
| **Status**     | 🔜 Pendente                            |

**Pré-condições**

- Pedido com `orderNumber: "ORD-001"` já cadastrado

**Dados de entrada**

Ver [payload base](#payload-base-para-criação-de-pedido) com mesmo `orderNumber`.

**Resultado esperado**

- Status `400 Bad Request` ou `409 Conflict`

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-014 — Criar pedido sem campos obrigatórios

| Campo          | Detalhe                              |
| -------------- | ------------------------------------ |
| **ID**         | TC-ORD-014                           |
| **Título**     | Criar pedido sem campos obrigatórios |
| **Tipo**       | Negativo — campos obrigatórios       |
| **Prioridade** | Alta                                 |
| **Status**     | 🔜 Pendente                          |

**Pré-condições**

- Usuário cadastrado no banco

**Dados de entrada**

```json
{
  "notes": "Sem campos obrigatórios"
}
```

**Resultado esperado**

- Status `400 Bad Request`
- Body contém mensagem indicando campos ausentes

> Ver [BUG-005](../bugs/BUG-005-missing-fields-500.md) — pode retornar `500`.

**Resultado atual**

- 🔜 Pendente

---

## PUT /:entityId/orders/:orderId — Máquina de estados

---

### TC-ORD-015 — Transição válida: Ordered → Paid

| Campo          | Detalhe                             |
| -------------- | ----------------------------------- |
| **ID**         | TC-ORD-015                          |
| **Título**     | Transição de status: Ordered → Paid |
| **Tipo**       | Funcional — máquina de estados      |
| **Prioridade** | Alta                                |
| **Status**     | 🔜 Pendente                         |

**Pré-condições**

- Pedido com status `Ordered`

**Dados de entrada**

```json
{ "status": "Paid" }
```

**Resultado esperado**

- Status `200 OK`
- `order.status` retornado como `"Paid"`

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-016 — Transição válida: Paid → Preparing

| Campo          | Detalhe                               |
| -------------- | ------------------------------------- |
| **ID**         | TC-ORD-016                            |
| **Título**     | Transição de status: Paid → Preparing |
| **Tipo**       | Funcional — máquina de estados        |
| **Prioridade** | Alta                                  |
| **Status**     | 🔜 Pendente                           |

**Pré-condições**

- Pedido com status `Paid`

**Dados de entrada**

```json
{ "status": "Preparing" }
```

**Resultado esperado**

- Status `200 OK`
- `order.status` retornado como `"Preparing"`

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-017 — Transição válida: Preparing → Sent

| Campo          | Detalhe                               |
| -------------- | ------------------------------------- |
| **ID**         | TC-ORD-017                            |
| **Título**     | Transição de status: Preparing → Sent |
| **Tipo**       | Funcional — máquina de estados        |
| **Prioridade** | Alta                                  |
| **Status**     | 🔜 Pendente                           |

**Pré-condições**

- Pedido com status `Preparing`

**Dados de entrada**

```json
{ "status": "Sent" }
```

**Resultado esperado**

- Status `200 OK`
- `order.status` retornado como `"Sent"`

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-018 — Transição válida: Sent → Delivered

| Campo          | Detalhe                               |
| -------------- | ------------------------------------- |
| **ID**         | TC-ORD-018                            |
| **Título**     | Transição de status: Sent → Delivered |
| **Tipo**       | Funcional — máquina de estados        |
| **Prioridade** | Alta                                  |
| **Status**     | 🔜 Pendente                           |

**Pré-condições**

- Pedido com status `Sent`

**Dados de entrada**

```json
{ "status": "Delivered" }
```

**Resultado esperado**

- Status `200 OK`
- `order.status` retornado como `"Delivered"`

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-019 — Cancelar pedido em Ordered

| Campo          | Detalhe                            |
| -------------- | ---------------------------------- |
| **ID**         | TC-ORD-019                         |
| **Título**     | Cancelar pedido com status Ordered |
| **Tipo**       | Funcional — máquina de estados     |
| **Prioridade** | Alta                               |
| **Status**     | 🔜 Pendente                        |

**Pré-condições**

- Pedido com status `Ordered`

**Dados de entrada**

```json
{ "status": "Canceled" }
```

**Resultado esperado**

- Status `200 OK`
- `order.status` retornado como `"Canceled"`

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-020 — Transição inválida: Ordered → Delivered

| Campo          | Detalhe                                           |
| -------------- | ------------------------------------------------- |
| **ID**         | TC-ORD-020                                        |
| **Título**     | Transição de status inválida: Ordered → Delivered |
| **Tipo**       | Negativo — máquina de estados                     |
| **Prioridade** | Alta                                              |
| **Status**     | 🔜 Pendente                                       |

**Pré-condições**

- Pedido com status `Ordered`

**Dados de entrada**

```json
{ "status": "Delivered" }
```

**Resultado esperado**

- Status `400 Bad Request`
- Body: `{ "message": "Invalid status transition from Ordered to Delivered." }`

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-021 — Transição inválida: Delivered → qualquer status

| Campo          | Detalhe                                   |
| -------------- | ----------------------------------------- |
| **ID**         | TC-ORD-021                                |
| **Título**     | Tentar mudar status de pedido já entregue |
| **Tipo**       | Negativo — status terminal                |
| **Prioridade** | Alta                                      |
| **Status**     | 🔜 Pendente                               |

**Pré-condições**

- Pedido com status `Delivered`

**Dados de entrada**

```json
{ "status": "Canceled" }
```

**Resultado esperado**

- Status `400 Bad Request`
- Body contém mensagem de transição inválida

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-022 — Transição inválida: Canceled → qualquer status

| Campo          | Detalhe                          |
| -------------- | -------------------------------- |
| **ID**         | TC-ORD-022                       |
| **Título**     | Tentar reativar pedido cancelado |
| **Tipo**       | Negativo — status terminal       |
| **Prioridade** | Alta                             |
| **Status**     | 🔜 Pendente                      |

**Pré-condições**

- Pedido com status `Canceled`

**Dados de entrada**

```json
{ "status": "Ordered" }
```

**Resultado esperado**

- Status `400 Bad Request`
- Body contém mensagem de transição inválida

**Resultado atual**

- 🔜 Pendente

---

## DELETE /:entityId/orders/:orderId

---

### TC-ORD-023 — Deletar pedido com status Ordered

| Campo          | Detalhe                           |
| -------------- | --------------------------------- |
| **ID**         | TC-ORD-023                        |
| **Título**     | Deletar pedido com status Ordered |
| **Tipo**       | Funcional — sucesso               |
| **Prioridade** | Alta                              |
| **Status**     | 🔜 Pendente                       |

**Pré-condições**

- Usuário com pedido no status `Ordered`

**Dados de entrada**

```
DELETE /user/:entityId/orders/:orderId
```

**Resultado esperado**

- Status `200 OK`
- Mensagem: `"Order deleted successfully"`

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-024 — Deletar pedido com status Paid

| Campo          | Detalhe                        |
| -------------- | ------------------------------ |
| **ID**         | TC-ORD-024                     |
| **Título**     | Deletar pedido com status Paid |
| **Tipo**       | Funcional — sucesso            |
| **Prioridade** | Alta                           |
| **Status**     | 🔜 Pendente                    |

**Pré-condições**

- Usuário com pedido no status `Paid`

**Dados de entrada**

```
DELETE /user/:entityId/orders/:orderId
```

**Resultado esperado**

- Status `200 OK`
- Mensagem: `"Order deleted successfully"`

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-025 — Deletar pedido com status Preparing

| Campo          | Detalhe                                          |
| -------------- | ------------------------------------------------ |
| **ID**         | TC-ORD-025                                       |
| **Título**     | Não permitir deletar pedido com status Preparing |
| **Tipo**       | Negativo — regra de negócio                      |
| **Prioridade** | Alta                                             |
| **Status**     | 🔜 Pendente                                      |

**Pré-condições**

- Usuário com pedido no status `Preparing`

**Dados de entrada**

```
DELETE /user/:entityId/orders/:orderId
```

**Resultado esperado**

- Status `400 Bad Request`
- Body: `{ "message": "You can\`t delete this order." }`

> ⚠️ Mensagem usa backtick (`` ` ``) em vez de apóstrofo — testar com o caractere exato.

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-026 — Estabelecimento não pode deletar pedido

| Campo          | Detalhe                                 |
| -------------- | --------------------------------------- |
| **ID**         | TC-ORD-026                              |
| **Título**     | Estabelecimento não pode deletar pedido |
| **Tipo**       | Negativo — regra de negócio             |
| **Prioridade** | Alta                                    |
| **Status**     | 🔜 Pendente                             |

**Pré-condições**

- Estabelecimento com pedido cadastrado

**Dados de entrada**

```
DELETE /establishments/:entityId/orders/:orderId
```

**Resultado esperado**

- Status `400 Bad Request`
- Body: `{ "message": "Only costumer user can delete order." }`

> ⚠️ Typo na mensagem: `"costumer"` em vez de `"customer"` — testar com o texto exato.

**Resultado atual**

- 🔜 Pendente

---

### TC-ORD-027 — Deletar pedido com orderId inexistente

| Campo          | Detalhe                                |
| -------------- | -------------------------------------- |
| **ID**         | TC-ORD-027                             |
| **Título**     | Deletar pedido com orderId inexistente |
| **Tipo**       | Negativo — recurso não encontrado      |
| **Prioridade** | Alta                                   |
| **Status**     | 🔜 Pendente                            |

**Pré-condições**

- Usuário válido

**Dados de entrada**

```
DELETE /user/:entityId/orders/64f1a2b3c4d5e6f7a8b9c0d9
```

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "Order not found." }`

**Resultado atual**

- 🔜 Pendente

---

## Resumo

| ID         | Título                                     | Tipo                | Status            |
| ---------- | ------------------------------------------ | ------------------- | ----------------- |
| TC-ORD-001 | Listar todos os pedidos                    | Sucesso             | 🔜 Pendente       |
| TC-ORD-002 | Listar com banco vazio                     | Lista vazia         | 🔜 Pendente       |
| TC-ORD-003 | Listar pedidos de usuário                  | Sucesso             | 🔜 Pendente       |
| TC-ORD-004 | Listar pedidos de estabelecimento          | Sucesso             | 🔜 Pendente       |
| TC-ORD-005 | Listar entidade sem pedidos                | Lista vazia         | 🔜 Pendente       |
| TC-ORD-006 | Listar entityId inexistente                | Não encontrado      | 🔜 Pendente       |
| TC-ORD-007 | Buscar pedido por ID                       | Sucesso             | 🔜 Pendente       |
| TC-ORD-008 | Buscar orderId inexistente                 | Não encontrado      | 🔜 Pendente       |
| TC-ORD-009 | Acesso cruzado entre entidades             | Segurança           | ❌ Sem isolamento |
| TC-ORD-010 | Criar pedido como usuário                  | Sucesso             | 🔜 Pendente       |
| TC-ORD-011 | Verificar cálculo de subtotal e totalPrice | Regra de negócio    | 🔜 Pendente       |
| TC-ORD-012 | Criar pedido como estabelecimento          | Regra de negócio    | 🔜 Pendente       |
| TC-ORD-013 | Criar com orderNumber duplicado            | Duplicidade         | 🔜 Pendente       |
| TC-ORD-014 | Criar sem campos obrigatórios              | Campos obrigatórios | 🔜 Pendente       |
| TC-ORD-015 | Ordered → Paid                             | Máquina de estados  | 🔜 Pendente       |
| TC-ORD-016 | Paid → Preparing                           | Máquina de estados  | 🔜 Pendente       |
| TC-ORD-017 | Preparing → Sent                           | Máquina de estados  | 🔜 Pendente       |
| TC-ORD-018 | Sent → Delivered                           | Máquina de estados  | 🔜 Pendente       |
| TC-ORD-019 | Cancelar em Ordered                        | Máquina de estados  | 🔜 Pendente       |
| TC-ORD-020 | Ordered → Delivered (inválida)             | Máquina de estados  | 🔜 Pendente       |
| TC-ORD-021 | Delivered → qualquer (terminal)            | Status terminal     | 🔜 Pendente       |
| TC-ORD-022 | Canceled → qualquer (terminal)             | Status terminal     | 🔜 Pendente       |
| TC-ORD-023 | Deletar pedido Ordered                     | Sucesso             | 🔜 Pendente       |
| TC-ORD-024 | Deletar pedido Paid                        | Sucesso             | 🔜 Pendente       |
| TC-ORD-025 | Não deletar pedido Preparing               | Regra de negócio    | 🔜 Pendente       |
| TC-ORD-026 | Estabelecimento não deleta pedido          | Regra de negócio    | 🔜 Pendente       |
| TC-ORD-027 | Deletar orderId inexistente                | Não encontrado      | 🔜 Pendente       |

**Total: 27 casos · 1 com resultado conhecido (❌) · 26 pendentes**
