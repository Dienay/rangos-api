# Test Cases — Establishments

|                 |                                                                                                                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Módulo**      | Estabelecimentos                                                                                                                                                                                          |
| **Endpoints**   | `GET /establishments` · `GET /establishments/search` · `GET /establishments/:id` · `GET /establishments/:id/products` · `POST /establishments` · `PUT /establishments/:id` · `DELETE /establishments/:id` |
| **Referências** | [test-strategy.md](../test-strategy.md) · [establishments.md](../../api/endpoints/establishments.md)                                                                                                      |
| **Casos**       | 20 total · 0 executados · 20 pendentes                                                                                                                                                                    |

---

## Pré-condições gerais

- API em execução
- Banco de dados limpo antes de cada caso de teste
- Nenhuma rota deste módulo exige autenticação — casos de autenticação documentados para registrar comportamento esperado vs atual

---

## GET /establishments

---

### TC-EST-001 — Listar todos os estabelecimentos

| Campo          | Detalhe                          |
| -------------- | -------------------------------- |
| **ID**         | TC-EST-001                       |
| **Título**     | Listar todos os estabelecimentos |
| **Tipo**       | Funcional — sucesso              |
| **Prioridade** | Alta                             |
| **Status**     | 🔜 Pendente                      |

**Pré-condições**

- Ao menos um estabelecimento cadastrado no banco

**Dados de entrada**

```
GET /establishments
```

**Resultado esperado**

- Status `200 OK`
- Body contém array `establishments` com os estabelecimentos
- Campo `logo` retornado como URL completa

**Resultado atual**

- 🔜 Pendente

---

### TC-EST-002 — Listar estabelecimentos com banco vazio

| Campo          | Detalhe                                 |
| -------------- | --------------------------------------- |
| **ID**         | TC-EST-002                              |
| **Título**     | Listar estabelecimentos com banco vazio |
| **Tipo**       | Funcional — lista vazia                 |
| **Prioridade** | Média                                   |
| **Status**     | 🔜 Pendente                             |

**Dados de entrada**

```
GET /establishments
```

**Resultado esperado**

- Status `200 OK`
- Body: `{ "establishments": [] }`

**Resultado atual**

- 🔜 Pendente

---

## GET /establishments/search

---

### TC-EST-003 — Buscar estabelecimento por nome exato

| Campo          | Detalhe                               |
| -------------- | ------------------------------------- |
| **ID**         | TC-EST-003                            |
| **Título**     | Buscar estabelecimento por nome exato |
| **Tipo**       | Funcional — sucesso                   |
| **Prioridade** | Alta                                  |
| **Status**     | 🔜 Pendente                           |

**Pré-condições**

- Estabelecimento com nome `"Pizza do João"` cadastrado

**Dados de entrada**

```
GET /establishments/search?name=Pizza do João
```

**Resultado esperado**

- Status `200 OK`
- Body contém array `establishments` com o estabelecimento encontrado

**Resultado atual**

- 🔜 Pendente

---

### TC-EST-004 — Buscar estabelecimento por nome parcial

| Campo          | Detalhe                                 |
| -------------- | --------------------------------------- |
| **ID**         | TC-EST-004                              |
| **Título**     | Buscar estabelecimento por nome parcial |
| **Tipo**       | Funcional — busca parcial               |
| **Prioridade** | Alta                                    |
| **Status**     | 🔜 Pendente                             |

**Pré-condições**

- Estabelecimento com nome `"Pizza do João"` cadastrado

**Dados de entrada**

```
GET /establishments/search?name=pizza
```

**Resultado esperado**

- Status `200 OK`
- Busca é case-insensitive — retorna estabelecimento mesmo com termo em minúsculo

**Resultado atual**

- 🔜 Pendente

---

### TC-EST-005 — Buscar estabelecimento inexistente

| Campo          | Detalhe                                     |
| -------------- | ------------------------------------------- |
| **ID**         | TC-EST-005                                  |
| **Título**     | Buscar estabelecimento com nome inexistente |
| **Tipo**       | Funcional — sem resultado                   |
| **Prioridade** | Média                                       |
| **Status**     | 🔜 Pendente                                 |

**Dados de entrada**

```
GET /establishments/search?name=inexistente
```

**Resultado esperado**

- Status `200 OK`
- Body: `{ "message": "Establishment ( inexistente ) is not found." }`

> Endpoint retorna `200` mesmo sem resultados — não usa `404`.

**Resultado atual**

- 🔜 Pendente

---

## GET /establishments/:id

---

### TC-EST-006 — Buscar estabelecimento por ID

| Campo          | Detalhe                       |
| -------------- | ----------------------------- |
| **ID**         | TC-EST-006                    |
| **Título**     | Buscar estabelecimento por ID |
| **Tipo**       | Funcional — sucesso           |
| **Prioridade** | Alta                          |
| **Status**     | 🔜 Pendente                   |

**Pré-condições**

- Estabelecimento cadastrado no banco

**Dados de entrada**

```
GET /establishments/:id
```

**Resultado esperado**

- Status `200 OK`
- Body contém documento completo do estabelecimento
- Campo `logo` retornado como URL completa

**Resultado atual**

- 🔜 Pendente

---

### TC-EST-007 — Buscar estabelecimento com ID inexistente

| Campo          | Detalhe                                   |
| -------------- | ----------------------------------------- |
| **ID**         | TC-EST-007                                |
| **Título**     | Buscar estabelecimento com ID inexistente |
| **Tipo**       | Negativo — recurso não encontrado         |
| **Prioridade** | Alta                                      |
| **Status**     | 🔜 Pendente                               |

**Dados de entrada**

```
GET /establishments/64f1a2b3c4d5e6f7a8b9c0d1
```

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "Establishment Id not found.", "status": 404 }`

**Resultado atual**

- 🔜 Pendente

---

### TC-EST-008 — Buscar estabelecimento com ID em formato inválido

| Campo          | Detalhe                                           |
| -------------- | ------------------------------------------------- |
| **ID**         | TC-EST-008                                        |
| **Título**     | Buscar estabelecimento com ID em formato inválido |
| **Tipo**       | Negativo — formato inválido                       |
| **Prioridade** | Média                                             |
| **Status**     | 🔜 Pendente                                       |

**Dados de entrada**

```
GET /establishments/id-invalido
```

**Resultado esperado**

- Status `400 Bad Request`
- Body: `{ "message": "Bad Request: incorrect input data", "status": 400 }`

**Resultado atual**

- 🔜 Pendente

---

## GET /establishments/:id/products

---

### TC-EST-009 — Buscar estabelecimento com produtos

| Campo          | Detalhe                                        |
| -------------- | ---------------------------------------------- |
| **ID**         | TC-EST-009                                     |
| **Título**     | Buscar estabelecimento com produtos vinculados |
| **Tipo**       | Funcional — sucesso                            |
| **Prioridade** | Alta                                           |
| **Status**     | 🔜 Pendente                                    |

**Pré-condições**

- Estabelecimento com ao menos um produto cadastrado

**Dados de entrada**

```
GET /establishments/:id/products
```

**Resultado esperado**

- Status `200 OK`
- Body contém `establishment` com `name`, `logo`, `category`, `deliveryTime`, `shippingCost`, `address`
- Body contém array `products` com `name`, `description`, `price`, `productImage` como URL completa

**Resultado atual**

- 🔜 Pendente

---

### TC-EST-010 — Buscar estabelecimento sem produtos

| Campo          | Detalhe                                        |
| -------------- | ---------------------------------------------- |
| **ID**         | TC-EST-010                                     |
| **Título**     | Buscar estabelecimento sem produtos vinculados |
| **Tipo**       | Funcional — lista vazia                        |
| **Prioridade** | Média                                          |
| **Status**     | 🔜 Pendente                                    |

**Pré-condições**

- Estabelecimento cadastrado sem produtos

**Dados de entrada**

```
GET /establishments/:id/products
```

**Resultado esperado**

- Status `200 OK`
- Body contém `establishment` com apenas `name` e `logo`
- Body contém `products: []`

> ⚠️ Quando sem produtos, retorna subconjunto menor do estabelecimento (`name` e `logo` apenas) em vez dos dados completos retornados quando há produtos — comportamento inconsistente.

**Resultado atual**

- 🔜 Pendente

---

## POST /establishments

---

### TC-EST-011 — Criar estabelecimento com campos obrigatórios

| Campo          | Detalhe                                       |
| -------------- | --------------------------------------------- |
| **ID**         | TC-EST-011                                    |
| **Título**     | Criar estabelecimento com campos obrigatórios |
| **Tipo**       | Funcional — sucesso                           |
| **Prioridade** | Alta                                          |
| **Status**     | 🔜 Pendente                                   |

**Dados de entrada**

```json
{
  "name": "Pizza do João",
  "openingHours": "[{\"day\":\"Monday\",\"periods\":[{\"open\":\"11:00\",\"close\":\"23:00\"}]}]"
}
```

**Resultado esperado**

- Status `201 Created`
- Mensagem: `"Establishment created successfully."`
- Body contém `_id` e dados do estabelecimento criado

**Resultado atual**

- 🔜 Pendente

---

### TC-EST-012 — Criar estabelecimento com nome duplicado

| Campo          | Detalhe                                  |
| -------------- | ---------------------------------------- |
| **ID**         | TC-EST-012                               |
| **Título**     | Criar estabelecimento com nome duplicado |
| **Tipo**       | Negativo — duplicidade                   |
| **Prioridade** | Alta                                     |
| **Status**     | 🔜 Pendente                              |

**Pré-condições**

- Estabelecimento com nome `"Pizza do João"` já cadastrado

**Dados de entrada**

```json
{
  "name": "Pizza do João",
  "openingHours": "[{\"day\":\"Tuesday\",\"periods\":[{\"open\":\"11:00\",\"close\":\"22:00\"}]}]"
}
```

**Resultado esperado**

- Status `409 Conflict`
- Body: `{ "message": "Establishment with the same name already exists." }`

**Resultado atual**

- 🔜 Pendente

---

### TC-EST-013 — Criar estabelecimento com categoria inválida

| Campo          | Detalhe                                      |
| -------------- | -------------------------------------------- |
| **ID**         | TC-EST-013                                   |
| **Título**     | Criar estabelecimento com categoria inválida |
| **Tipo**       | Negativo — validação de enum                 |
| **Prioridade** | Média                                        |
| **Status**     | 🔜 Pendente                                  |

**Dados de entrada**

```json
{
  "name": "Novo Lugar",
  "openingHours": "[{\"day\":\"Monday\",\"periods\":[{\"open\":\"08:00\",\"close\":\"18:00\"}]}]",
  "category": "FastFood"
}
```

**Resultado esperado**

- Status `400 Bad Request` ou `500`
- Body contém mensagem indicando categoria inválida

> Ver [BUG-005](../bugs/BUG-005-missing-fields-500.md) — erros de validação de enum podem retornar `500`.

**Resultado atual**

- 🔜 Pendente

---

### TC-EST-014 — Criar estabelecimento com openingHours em formato inválido

| Campo          | Detalhe                                                 |
| -------------- | ------------------------------------------------------- |
| **ID**         | TC-EST-014                                              |
| **Título**     | Criar estabelecimento com openingHours em JSON inválido |
| **Tipo**       | Negativo — formato inválido                             |
| **Prioridade** | Alta                                                    |
| **Status**     | 🔜 Pendente                                             |

**Dados de entrada**

```json
{
  "name": "Novo Lugar",
  "openingHours": "isso nao e json"
}
```

**Resultado esperado**

- Status `400 Bad Request`
- Body: `{ "message": "Invalid JSON format in openingHours field." }`

> ⚠️ O middleware `parseJsonFields` tem bug: o `return` dentro do `forEach` não interrompe a execução — `next()` pode ser chamado mesmo após o erro. Ver [BUG-009](../bugs/BUG-009-parse-json-fields.md).

**Resultado atual**

- 🔜 Pendente

---

### TC-EST-015 — Criar estabelecimento com horário em formato inválido

| Campo          | Detalhe                                                 |
| -------------- | ------------------------------------------------------- |
| **ID**         | TC-EST-015                                              |
| **Título**     | Criar estabelecimento com horário fora do formato HH:mm |
| **Tipo**       | Negativo — validação de formato                         |
| **Prioridade** | Média                                                   |
| **Status**     | 🔜 Pendente                                             |

**Dados de entrada**

```json
{
  "name": "Novo Lugar",
  "openingHours": "[{\"day\":\"Monday\",\"periods\":[{\"open\":\"8h\",\"close\":\"18h\"}]}]"
}
```

**Resultado esperado**

- Status `400 Bad Request` ou `500`
- Body contém mensagem indicando formato de horário inválido

**Resultado atual**

- 🔜 Pendente

---

## PUT /establishments/:id

---

### TC-EST-016 — Atualizar estabelecimento existente

| Campo          | Detalhe                               |
| -------------- | ------------------------------------- |
| **ID**         | TC-EST-016                            |
| **Título**     | Atualizar dados de um estabelecimento |
| **Tipo**       | Funcional — sucesso                   |
| **Prioridade** | Alta                                  |
| **Status**     | 🔜 Pendente                           |

**Pré-condições**

- Estabelecimento cadastrado no banco

**Dados de entrada**

```json
{
  "shippingCost": 8.5,
  "category": "Pizzeria"
}
```

**Resultado esperado**

- Status `200 OK`
- Mensagem: `"Establishment updated successfully"`
- Body contém dados atualizados

**Resultado atual**

- 🔜 Pendente

---

### TC-EST-017 — Atualizar estabelecimento com ID inexistente

| Campo          | Detalhe                                      |
| -------------- | -------------------------------------------- |
| **ID**         | TC-EST-017                                   |
| **Título**     | Atualizar estabelecimento com ID inexistente |
| **Tipo**       | Negativo — recurso não encontrado            |
| **Prioridade** | Alta                                         |
| **Status**     | 🔜 Pendente                                  |

**Dados de entrada**

```json
{
  "shippingCost": 8.5
}
```

```
PUT /establishments/64f1a2b3c4d5e6f7a8b9c0d1
```

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "Establishment Id not found.", "status": 404 }`

**Resultado atual**

- 🔜 Pendente

---

## DELETE /establishments/:id

---

### TC-EST-018 — Deletar estabelecimento existente

| Campo          | Detalhe                           |
| -------------- | --------------------------------- |
| **ID**         | TC-EST-018                        |
| **Título**     | Deletar estabelecimento existente |
| **Tipo**       | Funcional — sucesso               |
| **Prioridade** | Alta                              |
| **Status**     | 🔜 Pendente                       |

**Pré-condições**

- Estabelecimento cadastrado no banco

**Dados de entrada**

```
DELETE /establishments/:id
```

**Resultado esperado**

- Status `200 OK`
- Mensagem: `"Establishment deleted successfully"`
- Body contém dados do estabelecimento deletado

**Resultado atual**

- 🔜 Pendente

---

### TC-EST-019 — Deletar estabelecimento com ID inexistente

| Campo          | Detalhe                                    |
| -------------- | ------------------------------------------ |
| **ID**         | TC-EST-019                                 |
| **Título**     | Deletar estabelecimento com ID inexistente |
| **Tipo**       | Negativo — recurso não encontrado          |
| **Prioridade** | Alta                                       |
| **Status**     | 🔜 Pendente                                |

**Dados de entrada**

```
DELETE /establishments/64f1a2b3c4d5e6f7a8b9c0d1
```

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "Establishment Id not found.", "status": 404 }`

**Resultado atual**

- 🔜 Pendente

---

### TC-EST-020 — Verificar que produtos não são removidos ao deletar estabelecimento

| Campo          | Detalhe                                             |
| -------------- | --------------------------------------------------- |
| **ID**         | TC-EST-020                                          |
| **Título**     | Verificar que produtos não são removidos em cascata |
| **Tipo**       | Funcional — integridade referencial                 |
| **Prioridade** | Média                                               |
| **Status**     | 🔜 Pendente                                         |

**Pré-condições**

- Estabelecimento com ao menos um produto cadastrado

**Passos**

1. Deletar o estabelecimento via `DELETE /establishments/:id`
2. Buscar produto via `GET /products/:id`

**Resultado esperado**

- `DELETE` retorna `200 OK`
- `GET /products/:id` retorna `200 OK` — produto ainda existe no banco com `establishmentId` órfão

**Resultado atual**

- 🔜 Pendente

---

## Resumo

| ID         | Título                            | Tipo                    | Status      |
| ---------- | --------------------------------- | ----------------------- | ----------- |
| TC-EST-001 | Listar todos os estabelecimentos  | Sucesso                 | 🔜 Pendente |
| TC-EST-002 | Listar com banco vazio            | Lista vazia             | 🔜 Pendente |
| TC-EST-003 | Buscar por nome exato             | Sucesso                 | 🔜 Pendente |
| TC-EST-004 | Buscar por nome parcial           | Busca parcial           | 🔜 Pendente |
| TC-EST-005 | Buscar nome inexistente           | Sem resultado           | 🔜 Pendente |
| TC-EST-006 | Buscar por ID                     | Sucesso                 | 🔜 Pendente |
| TC-EST-007 | Buscar ID inexistente             | Não encontrado          | 🔜 Pendente |
| TC-EST-008 | Buscar ID formato inválido        | Formato inválido        | 🔜 Pendente |
| TC-EST-009 | Buscar com produtos               | Sucesso                 | 🔜 Pendente |
| TC-EST-010 | Buscar sem produtos               | Lista vazia             | 🔜 Pendente |
| TC-EST-011 | Criar com campos obrigatórios     | Sucesso                 | 🔜 Pendente |
| TC-EST-012 | Criar com nome duplicado          | Duplicidade             | 🔜 Pendente |
| TC-EST-013 | Criar com categoria inválida      | Validação enum          | 🔜 Pendente |
| TC-EST-014 | Criar com openingHours inválido   | Formato inválido        | 🔜 Pendente |
| TC-EST-015 | Criar com horário fora do formato | Formato inválido        | 🔜 Pendente |
| TC-EST-016 | Atualizar estabelecimento         | Sucesso                 | 🔜 Pendente |
| TC-EST-017 | Atualizar ID inexistente          | Não encontrado          | 🔜 Pendente |
| TC-EST-018 | Deletar estabelecimento           | Sucesso                 | 🔜 Pendente |
| TC-EST-019 | Deletar ID inexistente            | Não encontrado          | 🔜 Pendente |
| TC-EST-020 | Produtos não removidos em cascata | Integridade referencial | 🔜 Pendente |

**Total: 20 casos · 0 executados · 20 pendentes**
