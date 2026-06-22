# Test Cases — Users

|                 |                                                                                    |
| --------------- | ---------------------------------------------------------------------------------- |
| **Módulo**      | Usuários                                                                           |
| **Endpoints**   | `GET /user/:id` · `PUT /user/:id` · `DELETE /user/:id`                             |
| **Referências** | [test-strategy.md](../test-strategy.md) · [users.md](../../api/endpoints/users.md) |
| **Casos**       | 15 total · 0 executados · 15 pendentes                                             |

---

## Pré-condições gerais

- API em execução
- Banco de dados limpo antes de cada caso de teste
- Requisições autenticadas enviadas com `Authorization: Bearer <token>`
- Usuário criado via factory quando necessário

---

## GET /user/:id

---

### TC-USER-001 — Buscar usuário existente

| Campo          | Detalhe                  |
| -------------- | ------------------------ |
| **ID**         | TC-USER-001              |
| **Título**     | Buscar usuário existente |
| **Tipo**       | Funcional — sucesso      |
| **Prioridade** | Alta                     |
| **Status**     | 🔜 Pendente              |

**Pré-condições**

- Usuário criado via factory
- Token válido obtido via `POST /login`

**Dados de entrada**

```
GET /user/:id
Authorization: Bearer <token>
```

**Resultado esperado**

- Status `200 OK`
- Body contém `_id`, `name`, `email`, `phone`, `avatar`
- Campo `password` ausente na resposta

**Resultado atual**

- 🔜 Pendente

---

### TC-USER-002 — Buscar usuário sem autenticação

| Campo          | Detalhe                         |
| -------------- | ------------------------------- |
| **ID**         | TC-USER-002                     |
| **Título**     | Buscar usuário sem autenticação |
| **Tipo**       | Negativo — autenticação         |
| **Prioridade** | Alta                            |
| **Status**     | 🔜 Pendente                     |

**Dados de entrada**

```
GET /user/:id
(sem header Authorization)
```

**Resultado esperado**

- Status `401 Unauthorized`
- Body: `{ "message": "Access denied. No token provided." }`

**Resultado atual**

- 🔜 Pendente

---

### TC-USER-003 — Buscar usuário com ID inexistente

| Campo          | Detalhe                           |
| -------------- | --------------------------------- |
| **ID**         | TC-USER-003                       |
| **Título**     | Buscar usuário com ID inexistente |
| **Tipo**       | Negativo — recurso não encontrado |
| **Prioridade** | Alta                              |
| **Status**     | 🔜 Pendente                       |

**Pré-condições**

- Token válido

**Dados de entrada**

```
GET /user/64f1a2b3c4d5e6f7a8b9c0d1
Authorization: Bearer <token>
```

> ID válido no formato ObjectId mas inexistente no banco.

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "User not found." }`

**Resultado atual**

- 🔜 Pendente

---

### TC-USER-004 — Buscar usuário com ID em formato inválido

| Campo          | Detalhe                                   |
| -------------- | ----------------------------------------- |
| **ID**         | TC-USER-004                               |
| **Título**     | Buscar usuário com ID em formato inválido |
| **Tipo**       | Negativo — formato inválido               |
| **Prioridade** | Média                                     |
| **Status**     | 🔜 Pendente                               |

**Pré-condições**

- Token válido

**Dados de entrada**

```
GET /user/id-invalido
Authorization: Bearer <token>
```

**Resultado esperado**

- Status `400 Bad Request`
- Body: `{ "message": "Bad Request: incorrect input data", "status": 400 }`

**Resultado atual**

- 🔜 Pendente

---

### TC-USER-005 — Verificar que password não é retornado

| Campo          | Detalhe                                |
| -------------- | -------------------------------------- |
| **ID**         | TC-USER-005                            |
| **Título**     | Verificar que password não é retornado |
| **Tipo**       | Segurança — exposição de dados         |
| **Prioridade** | Alta                                   |
| **Status**     | 🔜 Pendente                            |

**Pré-condições**

- Usuário criado via factory
- Token válido

**Dados de entrada**

```
GET /user/:id
Authorization: Bearer <token>
```

**Resultado esperado**

- Status `200 OK`
- Campo `password` **ausente** no body da resposta

**Resultado atual**

- 🔜 Pendente

---

## PUT /user/:id

---

### TC-USER-006 — Atualizar dados do usuário

| Campo          | Detalhe                    |
| -------------- | -------------------------- |
| **ID**         | TC-USER-006                |
| **Título**     | Atualizar dados do usuário |
| **Tipo**       | Funcional — sucesso        |
| **Prioridade** | Alta                       |
| **Status**     | 🔜 Pendente                |

**Pré-condições**

- Usuário criado via factory
- Token válido

**Dados de entrada**

```json
{
  "name": "Nome Atualizado",
  "email": "atualizado@email.com"
}
```

**Resultado esperado**

- Status `200 OK`
- Body contém `name: "Nome Atualizado"` e `email: "atualizado@email.com"`
- Mensagem: `"User updated already."`

**Resultado atual**

- 🔜 Pendente

---

### TC-USER-007 — Atualizar apenas um campo

| Campo          | Detalhe                         |
| -------------- | ------------------------------- |
| **ID**         | TC-USER-007                     |
| **Título**     | Atualizar apenas um campo       |
| **Tipo**       | Funcional — atualização parcial |
| **Prioridade** | Média                           |
| **Status**     | 🔜 Pendente                     |

**Pré-condições**

- Usuário criado via factory
- Token válido

**Dados de entrada**

```json
{
  "name": "Só o Nome Mudou"
}
```

**Resultado esperado**

- Status `200 OK`
- `name` atualizado
- `email` e `phone` permanecem inalterados

**Resultado atual**

- 🔜 Pendente

---

### TC-USER-008 — Atualizar usuário sem autenticação

| Campo          | Detalhe                            |
| -------------- | ---------------------------------- |
| **ID**         | TC-USER-008                        |
| **Título**     | Atualizar usuário sem autenticação |
| **Tipo**       | Negativo — autenticação            |
| **Prioridade** | Alta                               |
| **Status**     | 🔜 Pendente                        |

**Dados de entrada**

```json
{
  "name": "Tentativa sem token"
}
```

```
PUT /user/:id
(sem header Authorization)
```

**Resultado esperado**

- Status `401 Unauthorized`
- Body: `{ "message": "Access denied. No token provided." }`

**Resultado atual**

- 🔜 Pendente

---

### TC-USER-009 — Atualizar usuário com ID inexistente

| Campo          | Detalhe                              |
| -------------- | ------------------------------------ |
| **ID**         | TC-USER-009                          |
| **Título**     | Atualizar usuário com ID inexistente |
| **Tipo**       | Negativo — recurso não encontrado    |
| **Prioridade** | Alta                                 |
| **Status**     | 🔜 Pendente                          |

**Pré-condições**

- Token válido

**Dados de entrada**

```json
{
  "name": "Usuário Fantasma"
}
```

```
PUT /user/64f1a2b3c4d5e6f7a8b9c0d1
Authorization: Bearer <token>
```

**Resultado esperado**

- Status `404 Not Found`

**Resultado atual**

- 🔜 Pendente

---

### TC-USER-010 — Verificar que password não pode ser atualizado

| Campo          | Detalhe                                                |
| -------------- | ------------------------------------------------------ |
| **ID**         | TC-USER-010                                            |
| **Título**     | Verificar que password não pode ser atualizado via PUT |
| **Tipo**       | Segurança — campo protegido                            |
| **Prioridade** | Alta                                                   |
| **Status**     | 🔜 Pendente                                            |

**Pré-condições**

- Usuário criado via factory com senha `"123456"`
- Token válido

**Dados de entrada**

```json
{
  "password": "novaSenha999"
}
```

**Resultado esperado**

- Status `200 OK`
- Login com senha `"novaSenha999"` **falha** após o update — senha não foi alterada

**Resultado atual**

- 🔜 Pendente

---

### TC-USER-011 — Verificar que typeUser não pode ser atualizado

| Campo          | Detalhe                                                |
| -------------- | ------------------------------------------------------ |
| **ID**         | TC-USER-011                                            |
| **Título**     | Verificar que typeUser não pode ser atualizado via PUT |
| **Tipo**       | Segurança — campo protegido                            |
| **Prioridade** | Alta                                                   |
| **Status**     | 🔜 Pendente                                            |

**Pré-condições**

- Usuário criado via factory com `typeUser: "Customer"`
- Token válido

**Dados de entrada**

```json
{
  "typeUser": "Establishment"
}
```

**Resultado esperado**

- Status `200 OK`
- `typeUser` permanece `"Customer"` após o update

**Resultado atual**

- 🔜 Pendente

---

## DELETE /user/:id

---

### TC-USER-012 — Deletar usuário existente

| Campo          | Detalhe                   |
| -------------- | ------------------------- |
| **ID**         | TC-USER-012               |
| **Título**     | Deletar usuário existente |
| **Tipo**       | Funcional — sucesso       |
| **Prioridade** | Alta                      |
| **Status**     | 🔜 Pendente               |

**Pré-condições**

- Usuário criado via factory
- Token válido

**Dados de entrada**

```
DELETE /user/:id
Authorization: Bearer <token>
```

**Resultado esperado**

- Status `200 OK`
- Mensagem: `"User deleted successfully"`
- Body contém dados do usuário deletado
- Campo `password` ausente no body

**Resultado atual**

- 🔜 Pendente

---

### TC-USER-013 — Deletar usuário sem autenticação

| Campo          | Detalhe                          |
| -------------- | -------------------------------- |
| **ID**         | TC-USER-013                      |
| **Título**     | Deletar usuário sem autenticação |
| **Tipo**       | Negativo — autenticação          |
| **Prioridade** | Alta                             |
| **Status**     | 🔜 Pendente                      |

**Dados de entrada**

```
DELETE /user/:id
(sem header Authorization)
```

**Resultado esperado**

- Status `401 Unauthorized`
- Body: `{ "message": "Access denied. No token provided." }`

**Resultado atual**

- 🔜 Pendente

---

### TC-USER-014 — Deletar usuário com ID inexistente

| Campo          | Detalhe                            |
| -------------- | ---------------------------------- |
| **ID**         | TC-USER-014                        |
| **Título**     | Deletar usuário com ID inexistente |
| **Tipo**       | Negativo — recurso não encontrado  |
| **Prioridade** | Alta                               |
| **Status**     | 🔜 Pendente                        |

**Pré-condições**

- Token válido

**Dados de entrada**

```
DELETE /user/64f1a2b3c4d5e6f7a8b9c0d1
Authorization: Bearer <token>
```

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "User not found" }`

**Resultado atual**

- 🔜 Pendente

---

### TC-USER-015 — Verificar que usuário deletado não pode fazer login

| Campo          | Detalhe                                             |
| -------------- | --------------------------------------------------- |
| **ID**         | TC-USER-015                                         |
| **Título**     | Verificar que usuário deletado não pode fazer login |
| **Tipo**       | Funcional — integridade pós-deleção                 |
| **Prioridade** | Média                                               |
| **Status**     | 🔜 Pendente                                         |

**Pré-condições**

- Usuário criado via factory
- Token válido

**Passos**

1. Deletar o usuário via `DELETE /user/:id`
2. Tentar fazer login com o email e senha do usuário deletado

**Resultado esperado**

- `DELETE` retorna `200 OK`
- Login subsequente retorna `404 Not Found`

**Resultado atual**

- 🔜 Pendente

---

## Resumo

| ID          | Título                         | Tipo                | Status      |
| ----------- | ------------------------------ | ------------------- | ----------- |
| TC-USER-001 | Buscar usuário existente       | Sucesso             | 🔜 Pendente |
| TC-USER-002 | Buscar sem autenticação        | Autenticação        | 🔜 Pendente |
| TC-USER-003 | Buscar ID inexistente          | Não encontrado      | 🔜 Pendente |
| TC-USER-004 | Buscar ID formato inválido     | Formato inválido    | 🔜 Pendente |
| TC-USER-005 | Password não retornado         | Segurança           | 🔜 Pendente |
| TC-USER-006 | Atualizar dados                | Sucesso             | 🔜 Pendente |
| TC-USER-007 | Atualizar um campo             | Atualização parcial | 🔜 Pendente |
| TC-USER-008 | Atualizar sem autenticação     | Autenticação        | 🔜 Pendente |
| TC-USER-009 | Atualizar ID inexistente       | Não encontrado      | 🔜 Pendente |
| TC-USER-010 | Password não atualizável       | Segurança           | 🔜 Pendente |
| TC-USER-011 | typeUser não atualizável       | Segurança           | 🔜 Pendente |
| TC-USER-012 | Deletar usuário existente      | Sucesso             | 🔜 Pendente |
| TC-USER-013 | Deletar sem autenticação       | Autenticação        | 🔜 Pendente |
| TC-USER-014 | Deletar ID inexistente         | Não encontrado      | 🔜 Pendente |
| TC-USER-015 | Usuário deletado não faz login | Integridade         | 🔜 Pendente |

**Total: 15 casos · 0 executados · 15 pendentes**
