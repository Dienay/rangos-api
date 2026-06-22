# Test Cases — Products

|                 |                                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Módulo**      | Produtos                                                                                                                                               |
| **Endpoints**   | `GET /products` · `GET /products/top` · `GET /products/search` · `GET /products/:id` · `POST /products` · `PUT /products/:id` · `DELETE /products/:id` |
| **Referências** | [test-strategy.md](../test-strategy.md) · [products.md](../../api/endpoints/products.md)                                                               |
| **Casos**       | 21 total · 2 executados · 19 pendentes                                                                                                                 |

---

## Pré-condições gerais

- API em execução
- Banco de dados limpo antes de cada caso de teste
- Nenhuma rota deste módulo exige autenticação — ausência documentada em [BUG-010](../bugs/BUG-010-products-no-auth.md)

---

## GET /products

---

### TC-PROD-001 — Listar todos os produtos

| Campo          | Detalhe                  |
| -------------- | ------------------------ |
| **ID**         | TC-PROD-001              |
| **Título**     | Listar todos os produtos |
| **Tipo**       | Funcional — sucesso      |
| **Prioridade** | Alta                     |
| **Status**     | 🔜 Pendente              |

**Pré-condições**

- Ao menos um produto cadastrado com estabelecimento vinculado

**Dados de entrada**

```
GET /products
```

**Resultado esperado**

- Status `200 OK`
- Body contém array `products`
- `productImage` retornado como URL completa
- `establishmentId` populado com `name` e `logo`

**Resultado atual**

- 🔜 Pendente

---

### TC-PROD-002 — Listar produtos com banco vazio

| Campo          | Detalhe                         |
| -------------- | ------------------------------- |
| **ID**         | TC-PROD-002                     |
| **Título**     | Listar produtos com banco vazio |
| **Tipo**       | Funcional — lista vazia         |
| **Prioridade** | Média                           |
| **Status**     | 🔜 Pendente                     |

**Dados de entrada**

```
GET /products
```

**Resultado esperado**

- Status `200 OK`
- Body: `{ "products": [] }`

**Resultado atual**

- 🔜 Pendente

---

## GET /products/top

---

### TC-PROD-003 — Listar top produtos com pedidos no banco

| Campo          | Detalhe                                  |
| -------------- | ---------------------------------------- |
| **ID**         | TC-PROD-003                              |
| **Título**     | Listar top produtos com pedidos no banco |
| **Tipo**       | Funcional — sucesso                      |
| **Prioridade** | Alta                                     |
| **Status**     | 🔜 Pendente                              |

**Pré-condições**

- Ao menos um pedido finalizado com produtos no banco

**Dados de entrada**

```
GET /products/top
```

**Resultado esperado**

- Status `200 OK`
- Body contém array `topProducts` com no máximo 10 itens
- Itens ordenados por `totalSales` decrescente
- `productImage` retornado como URL completa
- Cada item contém `_id`, `name`, `price`, `productImage`, `totalSales`

**Resultado atual**

- 🔜 Pendente

---

### TC-PROD-004 — Listar top produtos sem pedidos no banco

| Campo          | Detalhe                                  |
| -------------- | ---------------------------------------- |
| **ID**         | TC-PROD-004                              |
| **Título**     | Listar top produtos sem pedidos no banco |
| **Tipo**       | Funcional — lista vazia                  |
| **Prioridade** | Média                                    |
| **Status**     | 🔜 Pendente                              |

**Dados de entrada**

```
GET /products/top
```

**Resultado esperado**

- Status `200 OK`
- Body: `{ "topProducts": [] }`

**Resultado atual**

- 🔜 Pendente

---

### TC-PROD-005 — Verificar limite de 10 itens no top produtos

| Campo          | Detalhe                                               |
| -------------- | ----------------------------------------------------- |
| **ID**         | TC-PROD-005                                           |
| **Título**     | Verificar que top produtos retorna no máximo 10 itens |
| **Tipo**       | Funcional — regra de negócio                          |
| **Prioridade** | Média                                                 |
| **Status**     | 🔜 Pendente                                           |

**Pré-condições**

- Mais de 10 produtos com pedidos no banco

**Dados de entrada**

```
GET /products/top
```

**Resultado esperado**

- Status `200 OK`
- Array `topProducts` contém exatamente 10 itens

**Resultado atual**

- 🔜 Pendente

---

## GET /products/search

---

### TC-PROD-006 — Buscar produto por nome exato

| Campo          | Detalhe                       |
| -------------- | ----------------------------- |
| **ID**         | TC-PROD-006                   |
| **Título**     | Buscar produto por nome exato |
| **Tipo**       | Funcional — sucesso           |
| **Prioridade** | Alta                          |
| **Status**     | 🔜 Pendente                   |

**Pré-condições**

- Produto com nome `"Pizza Margherita"` cadastrado

**Dados de entrada**

```
GET /products/search?name=Pizza Margherita
```

**Resultado esperado**

- Status `200 OK`
- Body contém array `products` com o produto encontrado

**Resultado atual**

- 🔜 Pendente

---

### TC-PROD-007 — Buscar produto por nome parcial

| Campo          | Detalhe                                            |
| -------------- | -------------------------------------------------- |
| **ID**         | TC-PROD-007                                        |
| **Título**     | Buscar produto por nome parcial e case-insensitive |
| **Tipo**       | Funcional — busca parcial                          |
| **Prioridade** | Alta                                               |
| **Status**     | 🔜 Pendente                                        |

**Pré-condições**

- Produto com nome `"Pizza Margherita"` cadastrado

**Dados de entrada**

```
GET /products/search?name=pizza
```

**Resultado esperado**

- Status `200 OK`
- Retorna produto mesmo com termo em minúsculo

**Resultado atual**

- 🔜 Pendente

---

### TC-PROD-008 — Buscar produto inexistente

| Campo          | Detalhe                             |
| -------------- | ----------------------------------- |
| **ID**         | TC-PROD-008                         |
| **Título**     | Buscar produto com nome inexistente |
| **Tipo**       | Funcional — sem resultado           |
| **Prioridade** | Média                               |
| **Status**     | 🔜 Pendente                         |

**Dados de entrada**

```
GET /products/search?name=inexistente
```

**Resultado esperado**

- Status `200 OK`
- Body: `{ "message": "Product ( inexistente ) is not found." }`

> Endpoint retorna `200` mesmo sem resultados — não usa `404`.

**Resultado atual**

- 🔜 Pendente

---

## GET /products/:id

---

### TC-PROD-009 — Buscar produto por ID

| Campo          | Detalhe               |
| -------------- | --------------------- |
| **ID**         | TC-PROD-009           |
| **Título**     | Buscar produto por ID |
| **Tipo**       | Funcional — sucesso   |
| **Prioridade** | Alta                  |
| **Status**     | 🔜 Pendente           |

**Pré-condições**

- Produto cadastrado no banco

**Dados de entrada**

```
GET /products/:id
```

**Resultado esperado**

- Status `200 OK`
- Body contém objeto `product` com todos os campos
- `productImage` retornado como URL completa
- `establishmentId` retornado como ObjectId simples (não populado)

**Resultado atual**

- 🔜 Pendente

---

### TC-PROD-010 — Buscar produto com ID inexistente

| Campo          | Detalhe                           |
| -------------- | --------------------------------- |
| **ID**         | TC-PROD-010                       |
| **Título**     | Buscar produto com ID inexistente |
| **Tipo**       | Negativo — recurso não encontrado |
| **Prioridade** | Alta                              |
| **Status**     | 🔜 Pendente                       |

**Dados de entrada**

```
GET /products/64f1a2b3c4d5e6f7a8b9c0d1
```

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "Product Id not found.", "status": 404 }`

**Resultado atual**

- 🔜 Pendente

---

### TC-PROD-011 — Buscar produto com ID em formato inválido

| Campo          | Detalhe                                   |
| -------------- | ----------------------------------------- |
| **ID**         | TC-PROD-011                               |
| **Título**     | Buscar produto com ID em formato inválido |
| **Tipo**       | Negativo — formato inválido               |
| **Prioridade** | Média                                     |
| **Status**     | 🔜 Pendente                               |

**Dados de entrada**

```
GET /products/id-invalido
```

**Resultado esperado**

- Status `400 Bad Request`
- Body: `{ "message": "Bad Request: incorrect input data", "status": 400 }`

**Resultado atual**

- 🔜 Pendente

---

## POST /products

---

### TC-PROD-012 — Criar produto com campos obrigatórios

| Campo          | Detalhe                               |
| -------------- | ------------------------------------- |
| **ID**         | TC-PROD-012                           |
| **Título**     | Criar produto com campos obrigatórios |
| **Tipo**       | Funcional — sucesso                   |
| **Prioridade** | Alta                                  |
| **Status**     | 🔜 Pendente                           |

**Pré-condições**

- Estabelecimento cadastrado no banco

**Dados de entrada**

```json
{
  "name": "Pizza Margherita",
  "price": 45.9,
  "establishmentId": "64f1a2b3c4d5e6f7a8b9c0d2"
}
```

**Resultado esperado**

- Status `201 Created`
- Mensagem: `"Product created successfully."`
- Body contém `_id` e dados do produto criado

**Resultado atual**

- 🔜 Pendente

---

### TC-PROD-013 — Criar produto com todos os campos

| Campo          | Detalhe                           |
| -------------- | --------------------------------- |
| **ID**         | TC-PROD-013                       |
| **Título**     | Criar produto com todos os campos |
| **Tipo**       | Funcional — sucesso               |
| **Prioridade** | Alta                              |
| **Status**     | 🔜 Pendente                       |

**Pré-condições**

- Estabelecimento cadastrado no banco

**Dados de entrada**

```json
{
  "name": "Pizza Margherita",
  "price": 45.9,
  "description": "Molho, mussarela e manjericão",
  "establishmentId": "64f1a2b3c4d5e6f7a8b9c0d2"
}
```

**Resultado esperado**

- Status `201 Created`
- Body contém todos os campos enviados

**Resultado atual**

- 🔜 Pendente

---

### TC-PROD-014 — Criar produto sem campos obrigatórios

| Campo          | Detalhe                               |
| -------------- | ------------------------------------- |
| **ID**         | TC-PROD-014                           |
| **Título**     | Criar produto sem campos obrigatórios |
| **Tipo**       | Negativo — campos obrigatórios        |
| **Prioridade** | Alta                                  |
| **Status**     | 🔜 Pendente                           |

**Dados de entrada**

```json
{
  "description": "Apenas descrição"
}
```

**Resultado esperado**

- Status `400 Bad Request`
- Body contém mensagem indicando campos ausentes (`name`, `price`, `establishmentId`)

> Ver [BUG-005](../bugs/BUG-005-missing-fields-500.md) — campos obrigatórios ausentes retornam `500` em vez de `400`.

**Resultado atual**

- ❌ Status `500 Internal Server Error` — ver BUG-005

---

### TC-PROD-015 — Criar produto com establishmentId inexistente

| Campo          | Detalhe                                       |
| -------------- | --------------------------------------------- |
| **ID**         | TC-PROD-015                                   |
| **Título**     | Criar produto com establishmentId inexistente |
| **Tipo**       | Negativo — referência inválida                |
| **Prioridade** | Média                                         |
| **Status**     | 🔜 Pendente                                   |

**Dados de entrada**

```json
{
  "name": "Pizza Margherita",
  "price": 45.9,
  "establishmentId": "64f1a2b3c4d5e6f7a8b9c0d9"
}
```

**Resultado esperado**

- Status `400 Bad Request` ou `404 Not Found`
- Body contém mensagem indicando que o estabelecimento não existe

**Resultado atual**

- ❌ Status `201 Created` — produto criado com `establishmentId` órfão, sem validação de existência

---

## PUT /products/:id

---

### TC-PROD-016 — Atualizar produto existente

| Campo          | Detalhe                       |
| -------------- | ----------------------------- |
| **ID**         | TC-PROD-016                   |
| **Título**     | Atualizar dados de um produto |
| **Tipo**       | Funcional — sucesso           |
| **Prioridade** | Alta                          |
| **Status**     | 🔜 Pendente                   |

**Pré-condições**

- Produto cadastrado no banco

**Dados de entrada**

```json
{
  "price": 49.9,
  "description": "Descrição atualizada"
}
```

**Resultado esperado**

- Status `200 OK`
- Mensagem: `"Product updated successfully"`
- Body contém os campos atualizados

**Resultado atual**

- 🔜 Pendente

---

### TC-PROD-017 — Verificar que response do PUT retorna dados do body

| Campo          | Detalhe                                                                    |
| -------------- | -------------------------------------------------------------------------- |
| **ID**         | TC-PROD-017                                                                |
| **Título**     | Verificar que PUT retorna dados enviados no body, não o documento completo |
| **Tipo**       | Funcional — comportamento da resposta                                      |
| **Prioridade** | Média                                                                      |
| **Status**     | 🔜 Pendente                                                                |

**Pré-condições**

- Produto cadastrado com `name`, `price` e `description`

**Dados de entrada**

```json
{
  "price": 49.9
}
```

**Resultado esperado**

- Status `200 OK`
- Body `product` contém apenas `{ "price": 49.90 }` — somente o campo enviado
- `name` e `description` **não aparecem** na resposta mesmo existindo no banco

> ⚠️ O endpoint retorna `newData` do body em vez do documento atualizado — campos não enviados ficam ausentes da resposta mesmo existindo no banco.

**Resultado atual**

- 🔜 Pendente

---

### TC-PROD-018 — Atualizar produto com ID inexistente

| Campo          | Detalhe                              |
| -------------- | ------------------------------------ |
| **ID**         | TC-PROD-018                          |
| **Título**     | Atualizar produto com ID inexistente |
| **Tipo**       | Negativo — recurso não encontrado    |
| **Prioridade** | Alta                                 |
| **Status**     | 🔜 Pendente                          |

**Dados de entrada**

```json
{
  "price": 49.9
}
```

```
PUT /products/64f1a2b3c4d5e6f7a8b9c0d1
```

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "Product Id not found.", "status": 404 }`

**Resultado atual**

- 🔜 Pendente

---

## DELETE /products/:id

---

### TC-PROD-019 — Deletar produto existente

| Campo          | Detalhe                   |
| -------------- | ------------------------- |
| **ID**         | TC-PROD-019               |
| **Título**     | Deletar produto existente |
| **Tipo**       | Funcional — sucesso       |
| **Prioridade** | Alta                      |
| **Status**     | 🔜 Pendente               |

**Pré-condições**

- Produto cadastrado no banco

**Dados de entrada**

```
DELETE /products/:id
```

**Resultado esperado**

- Status `200 OK`
- Mensagem: `"Product deleted successfully"`
- Body contém dados do produto deletado

**Resultado atual**

- 🔜 Pendente

---

### TC-PROD-020 — Deletar produto com ID inexistente

| Campo          | Detalhe                            |
| -------------- | ---------------------------------- |
| **ID**         | TC-PROD-020                        |
| **Título**     | Deletar produto com ID inexistente |
| **Tipo**       | Negativo — recurso não encontrado  |
| **Prioridade** | Alta                               |
| **Status**     | 🔜 Pendente                        |

**Dados de entrada**

```
DELETE /products/64f1a2b3c4d5e6f7a8b9c0d1
```

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "Product Id not found.", "status": 404 }`

**Resultado atual**

- 🔜 Pendente

---

### TC-PROD-021 — Verificar snapshot em pedidos após deletar produto

| Campo          | Detalhe                                                          |
| -------------- | ---------------------------------------------------------------- |
| **ID**         | TC-PROD-021                                                      |
| **Título**     | Verificar que pedidos preservam snapshot do produto após deleção |
| **Tipo**       | Funcional — integridade referencial                              |
| **Prioridade** | Média                                                            |
| **Status**     | 🔜 Pendente                                                      |

**Pré-condições**

- Produto cadastrado e presente em ao menos um pedido

**Passos**

1. Buscar pedido e verificar dados do produto (`name`, `price`)
2. Deletar o produto via `DELETE /products/:id`
3. Buscar o mesmo pedido novamente

**Resultado esperado**

- `DELETE` retorna `200 OK`
- Pedido ainda contém `name` e `price` do produto no array `products` — dados preservados pelo snapshot

**Resultado atual**

- 🔜 Pendente

---

## Resumo

| ID          | Título                             | Tipo                    | Status           |
| ----------- | ---------------------------------- | ----------------------- | ---------------- |
| TC-PROD-001 | Listar todos os produtos           | Sucesso                 | 🔜 Pendente      |
| TC-PROD-002 | Listar com banco vazio             | Lista vazia             | 🔜 Pendente      |
| TC-PROD-003 | Top produtos com pedidos           | Sucesso                 | 🔜 Pendente      |
| TC-PROD-004 | Top produtos sem pedidos           | Lista vazia             | 🔜 Pendente      |
| TC-PROD-005 | Top produtos — limite de 10        | Regra de negócio        | 🔜 Pendente      |
| TC-PROD-006 | Buscar por nome exato              | Sucesso                 | 🔜 Pendente      |
| TC-PROD-007 | Buscar por nome parcial            | Busca parcial           | 🔜 Pendente      |
| TC-PROD-008 | Buscar nome inexistente            | Sem resultado           | 🔜 Pendente      |
| TC-PROD-009 | Buscar por ID                      | Sucesso                 | 🔜 Pendente      |
| TC-PROD-010 | Buscar ID inexistente              | Não encontrado          | 🔜 Pendente      |
| TC-PROD-011 | Buscar ID formato inválido         | Formato inválido        | 🔜 Pendente      |
| TC-PROD-012 | Criar com campos obrigatórios      | Sucesso                 | 🔜 Pendente      |
| TC-PROD-013 | Criar com todos os campos          | Sucesso                 | 🔜 Pendente      |
| TC-PROD-014 | Criar sem campos obrigatórios      | Campos obrigatórios     | ❌ BUG-005       |
| TC-PROD-015 | Criar com establishmentId inválido | Referência inválida     | ❌ Sem validação |
| TC-PROD-016 | Atualizar produto                  | Sucesso                 | 🔜 Pendente      |
| TC-PROD-017 | PUT retorna dados do body          | Comportamento resposta  | 🔜 Pendente      |
| TC-PROD-018 | Atualizar ID inexistente           | Não encontrado          | 🔜 Pendente      |
| TC-PROD-019 | Deletar produto                    | Sucesso                 | 🔜 Pendente      |
| TC-PROD-020 | Deletar ID inexistente             | Não encontrado          | 🔜 Pendente      |
| TC-PROD-021 | Snapshot preservado após deleção   | Integridade referencial | 🔜 Pendente      |

**Total: 21 casos · 2 com resultado conhecido (❌) · 19 pendentes**
