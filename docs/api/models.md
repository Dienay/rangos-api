# Modelos de Dados

Referência de todos os schemas Mongoose utilizados pela Rangos API. Subdocumentos compartilhados são descritos uma única vez e referenciados onde reutilizados.

---

## Índice

- [Address](#address)
- [User](#user)
- [Establishment](#establishment)
- [Product](#product)
- [Order](#order)

---

## Address

Subdocumento compartilhado — não possui coleção própria. É embutido em `User`, `Establishment` e `Order`.

| Campo          | Tipo   | Obrigatório | Descrição                               |
| -------------- | ------ | ----------- | --------------------------------------- |
| `description`  | String | ❌          | Rótulo opcional, ex: "Casa", "Trabalho" |
| `street`       | String | ✅          | Nome da rua                             |
| `number`       | String | ✅          | Número do imóvel (aceita "S/N", "101A") |
| `complement`   | String | ❌          | Apartamento, bloco, etc.                |
| `neighborhood` | String | ❌          | Bairro                                  |
| `city`         | String | ✅          | Cidade                                  |
| `state`        | String | ✅          | Estado                                  |
| `postalCode`   | String | ❌          | CEP                                     |
| `country`      | String | ❌          | País (default: `"Unknown"`)             |

> `{ _id: false }` — subdocumentos de endereço não geram `_id` próprio.

---

## User

**Coleção:** `users`

| Campo      | Tipo      | Obrigatório | Notas                                                     |
| ---------- | --------- | ----------- | --------------------------------------------------------- |
| `_id`      | ObjectId  | —           | Gerado automaticamente                                    |
| `avatar`   | String    | ❌          | Nome do arquivo de imagem                                 |
| `name`     | String    | ✅          |                                                           |
| `email`    | String    | ✅          | Único (`unique: true`)                                    |
| `phone`    | String    | ❌          | Único (`unique: true`)                                    |
| `password` | String    | ✅          | Armazenada com hash bcrypt (salt 12)                      |
| `address`  | Address[] | ❌          | Array de subdocumentos                                    |
| `typeUser` | String    | ❌          | Enum: `Customer` \| `Establishment` (default: `Customer`) |

**Campos nunca retornados nas respostas:** `password`

### Limitações conhecidas

- `phone` tem `unique: true` mas não é obrigatório — dois usuários sem telefone conflitam no índice
- `avatar` sem valor default — controllers montam URL `uploads/users/undefined` quando não enviado
- Sem validação de formato de email no schema — ver [BUG-001](../bugs/BUG-001-email-validation.md)
- Sem comprimento mínimo para `password` — ver [BUG-002](../bugs/BUG-002-password-min-length.md)
- Sem comprimento máximo para `name` — ver [BUG-003](../bugs/BUG-003-name-max-length.md)
- Sem validação de `name` em branco — ver [BUG-004](../bugs/BUG-004-name-blank.md)

---

## Establishment

**Coleção:** `establishments`

| Campo            | Tipo          | Obrigatório | Notas                           |
| ---------------- | ------------- | ----------- | ------------------------------- |
| `_id`            | ObjectId      | —           | Gerado automaticamente          |
| `logo`           | String        | ❌          | Nome do arquivo (default: `""`) |
| `coverImage`     | String        | ❌          | Nome do arquivo (default: `""`) |
| `name`           | String        | ✅          |                                 |
| `openingHours`   | OpeningHour[] | ✅          | Array com horários por dia      |
| `address`        | Address[]     | ❌          | Array de subdocumentos          |
| `category`       | String        | ❌          | Enum — ver lista abaixo         |
| `deliveryTime`   | DeliveryTime  | ❌          | Tempo estimado de entrega       |
| `shippingCost`   | Number        | ❌          | Custo de entrega (min: 0)       |
| `contact`        | Contact       | ❌          | Telefone e email de contato     |
| `rating`         | Rating        | ❌          | Média e contagem de avaliações  |
| `paymentMethods` | String[]      | ❌          | Métodos de pagamento aceitos    |
| `services`       | String[]      | ❌          | Serviços disponíveis            |

### Subdocumento: OpeningHour

| Campo     | Tipo     | Validação                                                                                      |
| --------- | -------- | ---------------------------------------------------------------------------------------------- |
| `day`     | String   | Enum: `Sunday` \| `Monday` \| `Tuesday` \| `Wednesday` \| `Thursday` \| `Friday` \| `Saturday` |
| `periods` | Period[] | Array de períodos de funcionamento                                                             |

### Subdocumento: Period

| Campo   | Tipo   | Validação               |
| ------- | ------ | ----------------------- |
| `open`  | String | Formato `HH:mm` (regex) |
| `close` | String | Formato `HH:mm` (regex) |

### Subdocumento: DeliveryTime

| Campo | Tipo   | Validação |
| ----- | ------ | --------- |
| `min` | Number | min: 0    |
| `max` | Number | min: 0    |

### Subdocumento: Rating

| Campo     | Tipo   | Validação                   |
| --------- | ------ | --------------------------- |
| `average` | Number | min: 0, max: 5 (default: 0) |
| `count`   | Number | min: 0 (default: 0)         |

### Subdocumento: Contact

| Campo   | Tipo   |
| ------- | ------ |
| `phone` | String |
| `email` | String |

### Categorias disponíveis

`Bakery` · `Bar` · `Bistro` · `Coffee Shop` · `Dessert Shop` · `Electronics Store` · `Fast Food Restaurant` · `Food Truck` · `Grocery Store` · `Healthy Food` · `Ice Cream Parlor` · `Ice Cream Shop` · `Italian Restaurant` · `Juice Bar` · `Mexican Restaurant` · `Pizza Place` · `Pizzeria` · `Pub` · `Restaurant` · `Sandwich Shop` · `Seafood Restaurant` · `Steakhouse` · `Store` · `Sushi Bar` · `Vegan Restaurant`

---

## Product

**Coleção:** `products`

| Campo             | Tipo     | Obrigatório | Notas                                                           |
| ----------------- | -------- | ----------- | --------------------------------------------------------------- |
| `_id`             | ObjectId | —           | Gerado automaticamente                                          |
| `name`            | String   | ✅          |                                                                 |
| `price`           | Number   | ✅          |                                                                 |
| `establishmentId` | ObjectId | ✅          | Referência para `establishments`                                |
| `productImage`    | String   | ❌          | Nome do arquivo (default: `""`)                                 |
| `thumbnail`       | String   | ❌          | Nome do arquivo (default: `""`) — não utilizado nos controllers |
| `description`     | String   | ❌          | (default: `""`)                                                 |

### Interface TopProduct

Retornada pelo endpoint `GET /products/top`. Gerada via aggregation sobre pedidos.

| Campo          | Tipo   | Descrição                  |
| -------------- | ------ | -------------------------- |
| `_id`          | String | ID do produto              |
| `name`         | String | Nome do produto            |
| `price`        | Number | Preço atual                |
| `productImage` | String | URL completa da imagem     |
| `totalSales`   | Number | Total de unidades vendidas |

---

## Order

**Coleção:** `orders`

| Campo             | Tipo             | Obrigatório | Notas                                           |
| ----------------- | ---------------- | ----------- | ----------------------------------------------- |
| `_id`             | ObjectId         | —           | Gerado automaticamente                          |
| `userId`          | ObjectId         | ✅          | Referência para `users`                         |
| `establishmentId` | ObjectId         | ✅          | Referência para `establishments`                |
| `orderNumber`     | String           | ✅          | Único (`unique: true`) — gerado pelo cliente    |
| `status`          | String           | ❌          | Enum — ver abaixo (default: `Ordered`)          |
| `products`        | OrderedProduct[] | ✅          | Lista de itens do pedido                        |
| `shipping`        | Number           | ✅          | Custo de entrega                                |
| `subtotal`        | Number           | ✅          | Calculado pelo servidor                         |
| `totalPrice`      | Number           | ✅          | `subtotal + shipping` — calculado pelo servidor |
| `deliveryAddress` | Address          | ✅          | Snapshot do endereço no momento do pedido       |
| `payment`         | PaymentInfo      | ✅          | Dados de pagamento                              |
| `notes`           | String           | ❌          | Observações de entrega                          |
| `createdAt`       | Date             | —           | Gerado automaticamente                          |
| `updatedAt`       | Date             | —           | Gerado automaticamente                          |

### Status do pedido

```
Ordered → Paid → Preparing → Sent → Delivered
   ↓        ↓        ↓
Canceled  Canceled  Canceled
```

| Status      | Transições permitidas   |
| ----------- | ----------------------- |
| `Ordered`   | `Paid`, `Canceled`      |
| `Paid`      | `Preparing`, `Canceled` |
| `Preparing` | `Sent`, `Canceled`      |
| `Sent`      | `Delivered`             |
| `Delivered` | — (terminal)            |
| `Canceled`  | — (terminal)            |

### Subdocumento: OrderedProduct

| Campo       | Tipo     | Obrigatório | Notas                                                      |
| ----------- | -------- | ----------- | ---------------------------------------------------------- |
| `productId` | ObjectId | ✅          | Referência para `products`                                 |
| `name`      | String   | ✅          | Snapshot do nome no momento da compra                      |
| `price`     | Number   | ✅          | Snapshot do preço no momento da compra                     |
| `quantity`  | Number   | ✅          | min: 1                                                     |
| `subtotal`  | Number   | ✅          | Esperado: `price × quantity` — não calculado pelo servidor |

### Subdocumento: PaymentInfo

| Campo           | Tipo   | Obrigatório | Notas                   |
| --------------- | ------ | ----------- | ----------------------- |
| `method`        | String | ✅          | Ex: `Pix`, `CreditCard` |
| `status`        | String | ❌          | default: `"Pending"`    |
| `transactionId` | String | ✅          | Referência da transação |

### Índices

| Campo             | Tipo        | Justificativa                          |
| ----------------- | ----------- | -------------------------------------- |
| `userId`          | Ascendente  | Queries de pedidos por usuário         |
| `establishmentId` | Ascendente  | Queries de pedidos por estabelecimento |
| `status`          | Ascendente  | Filtros por status                     |
| `createdAt`       | Descendente | Ordenação por data mais recente        |

---

## Relacionamentos

```
User ────────────────────────────────┐
 └── address[] (embedded)            │
                                     ▼
Establishment ──────────────────→ Order ←──── User
 └── address[] (embedded)     └── products[]
                                    └── productId → Product
                               └── deliveryAddress (snapshot)
```

> `deliveryAddress` em `Order` é um snapshot — não referencia o endereço original. Garante histórico mesmo que o endereço seja alterado ou removido posteriormente.
