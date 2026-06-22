# Test Cases — Addresses

|                 |                                                                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Módulo**      | Endereços                                                                                                                           |
| **Endpoints**   | `GET /:entityId/address` · `POST /:entityId/address` · `PUT /:entityId/address/:addressId` · `DELETE /:entityId/address/:addressId` |
| **Referências** | [test-strategy.md](../test-strategy.md) · [addresses.md](../../api/endpoints/addresses.md)                                          |
| **Casos**       | 17 total · 1 executados · 16 pendentes                                                                                              |

---

## Pré-condições gerais

- API em execução
- Banco de dados limpo antes de cada caso de teste
- Requisições autenticadas enviadas com `Authorization: Bearer <token>`
- Os mesmos endpoints atendem `User` e `Establishment` — casos marcados com **(User)** ou **(Establishment)** quando o comportamento difere

---

## GET /:entityId/address

---

### TC-ADDR-001 — Listar endereços de um usuário

| Campo          | Detalhe                        |
| -------------- | ------------------------------ |
| **ID**         | TC-ADDR-001                    |
| **Título**     | Listar endereços de um usuário |
| **Tipo**       | Funcional — sucesso            |
| **Prioridade** | Alta                           |
| **Status**     | 🔜 Pendente                    |

**Pré-condições**

- Usuário criado via factory
- Token válido
- Usuário possui ao menos um endereço cadastrado

**Dados de entrada**

```
GET /user/:entityId/address
Authorization: Bearer <token>
```

**Resultado esperado**

- Status `200 OK`
- Body contém array `address` com os endereços do usuário

**Resultado atual**

- 🔜 Pendente

---

### TC-ADDR-002 — Listar endereços de um usuário sem endereços

| Campo          | Detalhe                                               |
| -------------- | ----------------------------------------------------- |
| **ID**         | TC-ADDR-002                                           |
| **Título**     | Listar endereços de usuário sem endereços cadastrados |
| **Tipo**       | Funcional — lista vazia                               |
| **Prioridade** | Média                                                 |
| **Status**     | 🔜 Pendente                                           |

**Pré-condições**

- Usuário criado via factory sem endereços
- Token válido

**Dados de entrada**

```
GET /user/:entityId/address
Authorization: Bearer <token>
```

**Resultado esperado**

- Status `200 OK`
- Body: `{ "address": [] }`

**Resultado atual**

- 🔜 Pendente

---

### TC-ADDR-003 — Listar endereços sem autenticação

| Campo          | Detalhe                           |
| -------------- | --------------------------------- |
| **ID**         | TC-ADDR-003                       |
| **Título**     | Listar endereços sem autenticação |
| **Tipo**       | Negativo — autenticação           |
| **Prioridade** | Alta                              |
| **Status**     | 🔜 Pendente                       |

**Dados de entrada**

```
GET /user/:entityId/address
(sem header Authorization)
```

**Resultado esperado**

- Status `401 Unauthorized`
- Body: `{ "message": "Access denied. No token provided." }`

**Resultado atual**

- 🔜 Pendente

---

### TC-ADDR-004 — Listar endereços com entityId inexistente

| Campo          | Detalhe                                   |
| -------------- | ----------------------------------------- |
| **ID**         | TC-ADDR-004                               |
| **Título**     | Listar endereços com entityId inexistente |
| **Tipo**       | Negativo — recurso não encontrado         |
| **Prioridade** | Alta                                      |
| **Status**     | 🔜 Pendente                               |

**Pré-condições**

- Token válido

**Dados de entrada**

```
GET /user/64f1a2b3c4d5e6f7a8b9c0d1/address
Authorization: Bearer <token>
```

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "Entity not found." }`

**Resultado atual**

- 🔜 Pendente

---

## POST /:entityId/address

---

### TC-ADDR-005 — Adicionar endereço a um usuário

| Campo          | Detalhe                         |
| -------------- | ------------------------------- |
| **ID**         | TC-ADDR-005                     |
| **Título**     | Adicionar endereço a um usuário |
| **Tipo**       | Funcional — sucesso             |
| **Prioridade** | Alta                            |
| **Status**     | 🔜 Pendente                     |

**Pré-condições**

- Usuário criado via factory
- Token válido

**Dados de entrada**

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

**Resultado esperado**

- Status `200 OK`
- Mensagem: `"Address added successfully"`
- Body contém array `address` com o endereço adicionado

**Resultado atual**

- 🔜 Pendente

---

### TC-ADDR-006 — Adicionar endereço a um estabelecimento

| Campo          | Detalhe                                 |
| -------------- | --------------------------------------- |
| **ID**         | TC-ADDR-006                             |
| **Título**     | Adicionar endereço a um estabelecimento |
| **Tipo**       | Funcional — sucesso                     |
| **Prioridade** | Alta                                    |
| **Status**     | 🔜 Pendente                             |

**Pré-condições**

- Estabelecimento criado no banco
- Token válido

**Dados de entrada**

```json
{
  "street": "Av. Central",
  "number": "500",
  "city": "Teresina",
  "state": "PI",
  "country": "Brasil"
}
```

**Resultado esperado**

- Status `200 OK`
- Mensagem: `"Address added successfully"`
- Body contém array `address` com o endereço adicionado

**Resultado atual**

- 🔜 Pendente

---

### TC-ADDR-007 — Adicionar endereço duplicado

| Campo          | Detalhe                      |
| -------------- | ---------------------------- |
| **ID**         | TC-ADDR-007                  |
| **Título**     | Adicionar endereço duplicado |
| **Tipo**       | Negativo — duplicidade       |
| **Prioridade** | Alta                         |
| **Status**     | 🔜 Pendente                  |

**Pré-condições**

- Usuário com endereço já cadastrado (`street`, `number`, `city`, `state` iguais)
- Token válido

**Dados de entrada**

```json
{
  "street": "Rua das Flores",
  "number": "123",
  "city": "Teresina",
  "state": "PI"
}
```

**Resultado esperado**

- Status `409 Conflict`
- Body: `{ "message": "Address already exists." }`

**Resultado atual**

- 🔜 Pendente

---

### TC-ADDR-008 — Adicionar endereço sem campos obrigatórios

| Campo          | Detalhe                                    |
| -------------- | ------------------------------------------ |
| **ID**         | TC-ADDR-008                                |
| **Título**     | Adicionar endereço sem campos obrigatórios |
| **Tipo**       | Negativo — campos obrigatórios             |
| **Prioridade** | Alta                                       |
| **Status**     | 🔜 Pendente                                |

**Pré-condições**

- Usuário criado via factory
- Token válido

**Dados de entrada**

```json
{
  "neighborhood": "Centro",
  "postalCode": "64000-000"
}
```

**Resultado esperado**

- Status `400 Bad Request` ou `500`
- Body contém mensagem de erro indicando campos ausentes (`street`, `number`, `city`, `state`)

> Ver [BUG-005](../bugs/BUG-005-missing-fields-500.md) — campos obrigatórios ausentes podem retornar `500`.

**Resultado atual**

- 🔜 Pendente

---

### TC-ADDR-009 — Adicionar múltiplos endereços ao mesmo usuário

| Campo          | Detalhe                                        |
| -------------- | ---------------------------------------------- |
| **ID**         | TC-ADDR-009                                    |
| **Título**     | Adicionar múltiplos endereços ao mesmo usuário |
| **Tipo**       | Funcional — acumulação                         |
| **Prioridade** | Média                                          |
| **Status**     | 🔜 Pendente                                    |

**Pré-condições**

- Usuário criado via factory
- Token válido

**Passos**

1. Adicionar endereço A
2. Adicionar endereço B (campos diferentes de A)
3. Buscar endereços com `GET /:entityId/address`

**Resultado esperado**

- Ambos os `POST` retornam `200 OK`
- `GET` retorna array com os dois endereços

**Resultado atual**

- 🔜 Pendente

---

### TC-ADDR-010 — Adicionar endereço sem autenticação

| Campo          | Detalhe                             |
| -------------- | ----------------------------------- |
| **ID**         | TC-ADDR-010                         |
| **Título**     | Adicionar endereço sem autenticação |
| **Tipo**       | Negativo — autenticação             |
| **Prioridade** | Alta                                |
| **Status**     | 🔜 Pendente                         |

**Dados de entrada**

```json
{
  "street": "Rua das Flores",
  "number": "123",
  "city": "Teresina",
  "state": "PI"
}
```

```
POST /user/:entityId/address
(sem header Authorization)
```

**Resultado esperado**

- Status `401 Unauthorized`
- Body: `{ "message": "Access denied. No token provided." }`

**Resultado atual**

- 🔜 Pendente

---

## PUT /:entityId/address/:addressId

---

### TC-ADDR-011 — Atualizar endereço existente

| Campo          | Detalhe                      |
| -------------- | ---------------------------- |
| **ID**         | TC-ADDR-011                  |
| **Título**     | Atualizar endereço existente |
| **Tipo**       | Funcional — sucesso          |
| **Prioridade** | Alta                         |
| **Status**     | 🔜 Pendente                  |

**Pré-condições**

- Usuário com endereço cadastrado
- Token válido

**Dados de entrada**

```json
{
  "complement": "Apto 4",
  "postalCode": "64001-000"
}
```

**Resultado esperado**

- Status `200 OK`
- Mensagem: `"Address updated successfully"`
- Body contém endereço com campos atualizados
- Campos não enviados permanecem inalterados

**Resultado atual**

- 🔜 Pendente

---

### TC-ADDR-012 — Atualizar endereço sem autenticação

| Campo          | Detalhe                             |
| -------------- | ----------------------------------- |
| **ID**         | TC-ADDR-012                         |
| **Título**     | Atualizar endereço sem autenticação |
| **Tipo**       | Negativo — autenticação             |
| **Prioridade** | Alta                                |
| **Status**     | 🔜 Pendente                         |

**Dados de entrada**

```json
{
  "complement": "Apto 4"
}
```

```
PUT /user/:entityId/address/:addressId
(sem header Authorization)
```

**Resultado esperado**

- Status `401 Unauthorized`
- Body: `{ "message": "Access denied. No token provided." }`

**Resultado atual**

- 🔜 Pendente

---

### TC-ADDR-013 — Atualizar endereço com addressId inexistente

| Campo          | Detalhe                                      |
| -------------- | -------------------------------------------- |
| **ID**         | TC-ADDR-013                                  |
| **Título**     | Atualizar endereço com addressId inexistente |
| **Tipo**       | Negativo — recurso não encontrado            |
| **Prioridade** | Alta                                         |
| **Status**     | 🔜 Pendente                                  |

**Pré-condições**

- Usuário criado via factory
- Token válido

**Dados de entrada**

```json
{
  "complement": "Apto 4"
}
```

```
PUT /user/:entityId/address/64f1a2b3c4d5e6f7a8b9c0d1
Authorization: Bearer <token>
```

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "Address not found." }`

**Resultado atual**

- 🔜 Pendente

---

## DELETE /:entityId/address/:addressId

---

### TC-ADDR-014 — Deletar endereço existente

| Campo          | Detalhe                    |
| -------------- | -------------------------- |
| **ID**         | TC-ADDR-014                |
| **Título**     | Deletar endereço existente |
| **Tipo**       | Funcional — sucesso        |
| **Prioridade** | Alta                       |
| **Status**     | 🔜 Pendente                |

**Pré-condições**

- Usuário com endereço cadastrado

> ⚠️ Este endpoint não exige autenticação — ver [BUG-007](../bugs/BUG-007-delete-address-no-auth.md).

**Dados de entrada**

```
DELETE /user/:entityId/address/:addressId
```

**Resultado esperado**

- Status `200 OK`
- Mensagem: `"Address deleted successfully"`
- Endereço não aparece mais em `GET /:entityId/address`

**Resultado atual**

- 🔜 Pendente

---

### TC-ADDR-015 — Deletar endereço sem autenticação

| Campo          | Detalhe                           |
| -------------- | --------------------------------- |
| **ID**         | TC-ADDR-015                       |
| **Título**     | Deletar endereço sem autenticação |
| **Tipo**       | Segurança — autenticação ausente  |
| **Prioridade** | Alta                              |
| **Status**     | 🔜 Pendente                       |

**Dados de entrada**

```
DELETE /user/:entityId/address/:addressId
(sem header Authorization)
```

**Resultado esperado**

- Status `401 Unauthorized`

**Resultado atual**

- ❌ Status `200 OK` — endpoint não protegido, deleção executada sem token — ver [BUG-007](../bugs/BUG-007-delete-address-no-auth.md)

---

### TC-ADDR-016 — Deletar endereço com addressId inexistente

| Campo          | Detalhe                                    |
| -------------- | ------------------------------------------ |
| **ID**         | TC-ADDR-016                                |
| **Título**     | Deletar endereço com addressId inexistente |
| **Tipo**       | Negativo — recurso não encontrado          |
| **Prioridade** | Alta                                       |
| **Status**     | 🔜 Pendente                                |

**Pré-condições**

- Usuário criado via factory

**Dados de entrada**

```
DELETE /user/:entityId/address/64f1a2b3c4d5e6f7a8b9c0d1
```

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "Address not found." }`

**Resultado atual**

- 🔜 Pendente

---

### TC-ADDR-017 — Verificar integridade após deleção

| Campo          | Detalhe                                                 |
| -------------- | ------------------------------------------------------- |
| **ID**         | TC-ADDR-017                                             |
| **Título**     | Verificar que endereço deletado não aparece na listagem |
| **Tipo**       | Funcional — integridade pós-deleção                     |
| **Prioridade** | Média                                                   |
| **Status**     | 🔜 Pendente                                             |

**Pré-condições**

- Usuário com dois endereços cadastrados
- Token válido

**Passos**

1. Deletar o primeiro endereço via `DELETE`
2. Buscar endereços via `GET /:entityId/address`

**Resultado esperado**

- `DELETE` retorna `200 OK`
- `GET` retorna array com apenas o segundo endereço

**Resultado atual**

- 🔜 Pendente

---

## Resumo

| ID          | Título                               | Tipo                | Status      |
| ----------- | ------------------------------------ | ------------------- | ----------- |
| TC-ADDR-001 | Listar endereços de usuário          | Sucesso             | 🔜 Pendente |
| TC-ADDR-002 | Listar sem endereços cadastrados     | Lista vazia         | 🔜 Pendente |
| TC-ADDR-003 | Listar sem autenticação              | Autenticação        | 🔜 Pendente |
| TC-ADDR-004 | Listar entityId inexistente          | Não encontrado      | 🔜 Pendente |
| TC-ADDR-005 | Adicionar endereço a usuário         | Sucesso             | 🔜 Pendente |
| TC-ADDR-006 | Adicionar endereço a estabelecimento | Sucesso             | 🔜 Pendente |
| TC-ADDR-007 | Adicionar endereço duplicado         | Duplicidade         | 🔜 Pendente |
| TC-ADDR-008 | Adicionar sem campos obrigatórios    | Campos obrigatórios | 🔜 Pendente |
| TC-ADDR-009 | Adicionar múltiplos endereços        | Acumulação          | 🔜 Pendente |
| TC-ADDR-010 | Adicionar sem autenticação           | Autenticação        | 🔜 Pendente |
| TC-ADDR-011 | Atualizar endereço existente         | Sucesso             | 🔜 Pendente |
| TC-ADDR-012 | Atualizar sem autenticação           | Autenticação        | 🔜 Pendente |
| TC-ADDR-013 | Atualizar addressId inexistente      | Não encontrado      | 🔜 Pendente |
| TC-ADDR-014 | Deletar endereço existente           | Sucesso             | 🔜 Pendente |
| TC-ADDR-015 | Deletar sem autenticação             | Segurança           | ❌ BUG-007  |
| TC-ADDR-016 | Deletar addressId inexistente        | Não encontrado      | 🔜 Pendente |
| TC-ADDR-017 | Integridade pós-deleção              | Integridade         | 🔜 Pendente |

**Total: 17 casos · 1 com resultado conhecido (❌ BUG-007) · 16 pendentes**
