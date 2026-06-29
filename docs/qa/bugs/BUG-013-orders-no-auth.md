# BUG-013 — Endpoints de Orders sem autenticação

|                    |                                      |
| ------------------ | ------------------------------------ |
| **ID**             | BUG-013                              |
| **Módulo**         | Orders — todas as rotas              |
| **Severidade**     | Crítica                              |
| **Prioridade**     | Alta                                 |
| **Status**         | 🔴 Aberto                            |
| **Encontrado em**  | TC-ORD-009                           |
| **Encontrado por** | Análise de código — `orderRouter.ts` |

---

## Descrição

Nenhuma rota do módulo de pedidos exige autenticação. Qualquer pessoa pode criar, consultar, atualizar status e deletar pedidos sem fornecer token. Adicionalmente, o endpoint `GET /:entityId/orders/:orderId` não verifica se o pedido pertence à entidade informada — qualquer `entityId` válido acessa qualquer pedido pelo `orderId`.

---

## Passos para reproduzir

**Cenário 1 — criar pedido sem autenticação:**

1. Enviar `POST /user/:entityId/orders` sem header de autenticação com payload válido

**Cenário 2 — acesso cruzado entre entidades:**

1. Criar usuário A e usuário B
2. Criar pedido com o usuário A
3. Buscar o pedido usando o `entityId` do usuário B:

```status-code
GET /user/:entityIdB/orders/:orderIdA
```

---

## Resultado esperado

**Cenário 1:**

- Status `401 Unauthorized`

**Cenário 2:**

- Status `404 Not Found` — pedido não pertence ao usuário B

## Resultado atual

**Cenário 1:**

- Status `201 Created` — pedido criado sem autenticação

**Cenário 2:**

- Status `200 OK` — pedido retornado mesmo pertencendo a outro usuário

---

## Causa raiz

O middleware `checkToken` não foi aplicado a nenhuma rota do `orderRouter`:

```typescript
// src/routes/orderRouter.ts
orderRouter.post('/:entityId/orders', createOrder);
orderRouter.get('/orders', getAllOrders);
orderRouter.get('/:entityId/orders', getOrdersByEntity);
orderRouter.get('/:entityId/orders/:orderId', getOrderById);
orderRouter.put('/:entityId/orders/:orderId', updateOrder);
orderRouter.delete('/:entityId/orders/:orderId', deleteOrder);
// ❌ nenhuma rota usa checkToken
```

O controller `getOrderById` valida que o `entityId` existe no banco mas não verifica se o pedido pertence àquela entidade:

```typescript
// src/controllers/orderController.ts — getOrderById
const entity = (await User.findById(entityId)) || (await Establishment.findById(entityId));
if (!entity) return res.status(404).json({ message: 'Entity not found.' });

const order = await Order.findById(orderId); // ❌ busca por orderId sem filtrar por entityId
```

---

## Impacto

- Consulta de pedidos de outros usuários — exposição de dados pessoais e financeiros
- Criação de pedidos fraudulentos em nome de qualquer usuário
- Alteração de status de pedidos por terceiros — impacta fluxo operacional
- Deleção de pedidos por terceiros

---

## Sugestão de correção

**1. Adicionar `checkToken` em todas as rotas:**

```typescript
orderRouter.post('/:entityId/orders', checkToken, createOrder);
orderRouter.get('/:entityId/orders', checkToken, getOrdersByEntity);
orderRouter.get('/:entityId/orders/:orderId', checkToken, getOrderById);
orderRouter.put('/:entityId/orders/:orderId', checkToken, updateOrder);
orderRouter.delete('/:entityId/orders/:orderId', checkToken, deleteOrder);
```

**2. Filtrar pedido por entidade em `getOrderById`:**

```typescript
// Verificar se o pedido pertence ao entityId informado
const order = await Order.findOne({
  _id: orderId,
  $or: [{ userId: entityId }, { establishmentId: entityId }]
});
```
