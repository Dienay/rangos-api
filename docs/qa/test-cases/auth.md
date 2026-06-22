# Test Cases — Auth

|                 |                                                                        |
| --------------- | ---------------------------------------------------------------------- |
| **Módulo**      | Autenticação                                                           |
| **Endpoints**   | `POST /signup` · `POST /login`                                         |
| **Referências** | [test-strategy.md](../test-strategy.md) · [auth.md](../../api/auth.md) |
| **Casos**       | 22 total · 13 executados · 9 pendentes                                 |

---

## Pré-condições gerais

- API em execução
- Banco de dados limpo antes de cada caso de teste
- Requisições enviadas com `Content-Type: application/json`

> Endereços são gerenciados separadamente via `POST /address/:entityId`. Não fazem parte do fluxo de autenticação.

---

## Signup — `POST /signup`

**Response de sucesso**

```json
{
  "message": "User created successfully.",
  "_id": "...",
  "name": "...",
  "email": "...",
  "phone": "...",
  "typeUser": "Customer",
  "token": "..."
}
```

> A API retorna um token JWT já no cadastro.

---

### TC-AUTH-001 — Cadastro com todos os campos

| Campo          | Detalhe                      |
| -------------- | ---------------------------- |
| **ID**         | TC-AUTH-001                  |
| **Título**     | Cadastro com todos os campos |
| **Tipo**       | Funcional — sucesso          |
| **Prioridade** | Alta                         |
| **Status**     | ✅ Passou                    |

**Dados de entrada**

```json
{
  "name": "Test User",
  "email": "test@test.com",
  "password": "123456",
  "phone": "86999999999",
  "avatar": "https://example.com/avatar.jpg",
  "typeUser": "Customer"
}
```

**Passos**

1. Enviar `POST /signup` com todos os campos preenchidos

**Resultado esperado**

- Status `201 Created`
- Body contém `_id`, `token`, `name`, `email`, `phone`, `typeUser`

**Resultado atual**

- ✅ Conforme esperado

---

### TC-AUTH-002 — Cadastro com campos obrigatórios apenas

| Campo          | Detalhe                                 |
| -------------- | --------------------------------------- |
| **ID**         | TC-AUTH-002                             |
| **Título**     | Cadastro com campos obrigatórios apenas |
| **Tipo**       | Funcional — sucesso                     |
| **Prioridade** | Alta                                    |
| **Status**     | ✅ Passou                               |

**Dados de entrada**

```json
{
  "name": "Test User",
  "email": "minimal@test.com",
  "password": "123456"
}
```

**Passos**

1. Enviar `POST /signup` apenas com `name`, `email` e `password`

**Resultado esperado**

- Status `201 Created`
- Body contém `_id` e `token`

**Resultado atual**

- ✅ Conforme esperado

---

### TC-AUTH-003 — Cadastro com typeUser padrão

| Campo          | Detalhe                      |
| -------------- | ---------------------------- |
| **ID**         | TC-AUTH-003                  |
| **Título**     | Cadastro com typeUser padrão |
| **Tipo**       | Funcional — regra de negócio |
| **Prioridade** | Média                        |
| **Status**     | ✅ Passou                    |

**Dados de entrada**

```json
{
  "name": "Test User",
  "email": "customer@test.com",
  "password": "123456",
  "phone": "86988888888"
}
```

**Passos**

1. Enviar `POST /signup` sem o campo `typeUser`

**Resultado esperado**

- Status `201 Created`
- `typeUser` retornado como `"Customer"`

**Resultado atual**

- ✅ Conforme esperado

---

### TC-AUTH-004 — Token retornado no cadastro

| Campo          | Detalhe                      |
| -------------- | ---------------------------- |
| **ID**         | TC-AUTH-004                  |
| **Título**     | Token retornado no cadastro  |
| **Tipo**       | Funcional — regra de negócio |
| **Prioridade** | Alta                         |
| **Status**     | ✅ Passou                    |

**Dados de entrada**

```json
{
  "name": "Test User",
  "email": "tokencheck@test.com",
  "password": "123456",
  "phone": "86977777770"
}
```

**Passos**

1. Enviar `POST /signup` com dados válidos

**Resultado esperado**

- Status `201 Created`
- Body contém `token` do tipo string não vazio

**Resultado atual**

- ✅ Conforme esperado

---

### TC-AUTH-005 — Cadastro com email já cadastrado

| Campo          | Detalhe                          |
| -------------- | -------------------------------- |
| **ID**         | TC-AUTH-005                      |
| **Título**     | Cadastro com email já cadastrado |
| **Tipo**       | Negativo — duplicidade           |
| **Prioridade** | Alta                             |
| **Status**     | ✅ Passou                        |

**Pré-condições**

- Usuário com `email: "dup@test.com"` já cadastrado

**Dados de entrada**

```json
{
  "name": "Test User",
  "email": "dup@test.com",
  "password": "123456",
  "phone": "86999999997"
}
```

**Passos**

1. Cadastrar um usuário com o email `dup@test.com`
2. Enviar `POST /signup` com o mesmo email

**Resultado esperado**

- Status `409 Conflict`

**Resultado atual**

- ✅ Conforme esperado

---

### TC-AUTH-006 — Cadastro com telefone já cadastrado

| Campo          | Detalhe                             |
| -------------- | ----------------------------------- |
| **ID**         | TC-AUTH-006                         |
| **Título**     | Cadastro com telefone já cadastrado |
| **Tipo**       | Negativo — duplicidade              |
| **Prioridade** | Alta                                |
| **Status**     | ✅ Passou                           |

**Pré-condições**

- Usuário com `phone: "86911111111"` já cadastrado

**Dados de entrada**

```json
{
  "name": "Test User",
  "email": "unique@test.com",
  "password": "123456",
  "phone": "86911111111"
}
```

**Passos**

1. Cadastrar um usuário com o telefone `86911111111`
2. Enviar `POST /signup` com o mesmo telefone

**Resultado esperado**

- Status `409 Conflict`

**Resultado atual**

- ✅ Conforme esperado

---

### TC-AUTH-007 — Cadastro sem name

| Campo          | Detalhe                                                          |
| -------------- | ---------------------------------------------------------------- |
| **ID**         | TC-AUTH-007                                                      |
| **Título**     | Cadastro sem name                                                |
| **Tipo**       | Negativo — campo obrigatório                                     |
| **Prioridade** | Alta                                                             |
| **Status**     | ❌ Falhou — ver [BUG-005](../bugs/BUG-005-missing-fields-500.md) |

**Dados de entrada**

```json
{
  "email": "noname@test.com",
  "password": "123456",
  "phone": "86922222222"
}
```

**Passos**

1. Enviar `POST /signup` sem o campo `name`

**Resultado esperado**

- Status `400 Bad Request`

**Resultado atual**

- ❌ Status `500 Internal Server Error` — erro não tratado pelo middleware

---

### TC-AUTH-008 — Cadastro sem email

| Campo          | Detalhe                                                          |
| -------------- | ---------------------------------------------------------------- |
| **ID**         | TC-AUTH-008                                                      |
| **Título**     | Cadastro sem email                                               |
| **Tipo**       | Negativo — campo obrigatório                                     |
| **Prioridade** | Alta                                                             |
| **Status**     | ❌ Falhou — ver [BUG-005](../bugs/BUG-005-missing-fields-500.md) |

**Dados de entrada**

```json
{
  "name": "Test User",
  "password": "123456",
  "phone": "86933333333"
}
```

**Passos**

1. Enviar `POST /signup` sem o campo `email`

**Resultado esperado**

- Status `400 Bad Request`

**Resultado atual**

- ❌ Status `500 Internal Server Error` — erro não tratado pelo middleware

---

### TC-AUTH-009 — Cadastro sem password

| Campo          | Detalhe                                                          |
| -------------- | ---------------------------------------------------------------- |
| **ID**         | TC-AUTH-009                                                      |
| **Título**     | Cadastro sem password                                            |
| **Tipo**       | Negativo — campo obrigatório                                     |
| **Prioridade** | Alta                                                             |
| **Status**     | ❌ Falhou — ver [BUG-005](../bugs/BUG-005-missing-fields-500.md) |

**Dados de entrada**

```json
{
  "name": "Test User",
  "email": "nopassword@test.com",
  "phone": "86944444444"
}
```

**Passos**

1. Enviar `POST /signup` sem o campo `password`

**Resultado esperado**

- Status `400 Bad Request`

**Resultado atual**

- ❌ Status `500 Internal Server Error` — erro não tratado pelo middleware

---

### TC-AUTH-010 — Cadastro com body vazio

| Campo          | Detalhe                                                          |
| -------------- | ---------------------------------------------------------------- |
| **ID**         | TC-AUTH-010                                                      |
| **Título**     | Cadastro com body vazio                                          |
| **Tipo**       | Negativo — campo obrigatório                                     |
| **Prioridade** | Média                                                            |
| **Status**     | ❌ Falhou — ver [BUG-005](../bugs/BUG-005-missing-fields-500.md) |

**Dados de entrada**

```json
{}
```

**Passos**

1. Enviar `POST /signup` com body vazio

**Resultado esperado**

- Status `400 Bad Request`

**Resultado atual**

- ❌ Status `500 Internal Server Error` — erro não tratado pelo middleware

---

### TC-AUTH-011 — Cadastro com email em formato inválido

| Campo          | Detalhe                                                        |
| -------------- | -------------------------------------------------------------- |
| **ID**         | TC-AUTH-011                                                    |
| **Título**     | Cadastro com email em formato inválido                         |
| **Tipo**       | Negativo — validação de formato                                |
| **Prioridade** | Alta                                                           |
| **Status**     | ❌ Falhou — ver [BUG-001](../bugs/BUG-001-email-validation.md) |

**Dados de entrada**

```json
{
  "name": "Test User",
  "email": "invalid-email",
  "password": "123456",
  "phone": "86955555555"
}
```

**Passos**

1. Enviar `POST /signup` com email sem formato válido

**Resultado esperado**

- Status `400 Bad Request`

**Resultado atual**

- ❌ Status `201 Created` — email inválido aceito sem validação de formato

---

### TC-AUTH-012 — Cadastro com senha abaixo do mínimo

| Campo          | Detalhe                                                           |
| -------------- | ----------------------------------------------------------------- |
| **ID**         | TC-AUTH-012                                                       |
| **Título**     | Cadastro com senha abaixo do mínimo                               |
| **Tipo**       | Negativo — validação de formato                                   |
| **Prioridade** | Alta                                                              |
| **Status**     | ❌ Falhou — ver [BUG-002](../bugs/BUG-002-password-min-length.md) |

**Dados de entrada**

```json
{
  "name": "Test User",
  "email": "shortpass@test.com",
  "password": "123",
  "phone": "86966666666"
}
```

**Passos**

1. Enviar `POST /signup` com senha de 3 caracteres

**Resultado esperado**

- Status `400 Bad Request`

**Resultado atual**

- ❌ Status `201 Created` — senha curta aceita sem validação

---

### TC-AUTH-013 — Cadastro com typeUser inválido

| Campo          | Detalhe                                                          |
| -------------- | ---------------------------------------------------------------- |
| **ID**         | TC-AUTH-013                                                      |
| **Título**     | Cadastro com typeUser inválido                                   |
| **Tipo**       | Negativo — validação de enum                                     |
| **Prioridade** | Média                                                            |
| **Status**     | ❌ Falhou — ver [BUG-005](../bugs/BUG-005-missing-fields-500.md) |

**Dados de entrada**

```json
{
  "name": "Test User",
  "email": "invalidtype@test.com",
  "password": "123456",
  "phone": "86977777777",
  "typeUser": "Admin"
}
```

**Passos**

1. Enviar `POST /signup` com `typeUser` fora dos valores permitidos (`Customer`, `Establishment`)

**Resultado esperado**

- Status `400 Bad Request`

**Resultado atual**

- ❌ Status `500 Internal Server Error` — erro de validação de enum não tratado

---

### TC-AUTH-014 — Cadastro com name muito longo

| Campo          | Detalhe                                                       |
| -------------- | ------------------------------------------------------------- |
| **ID**         | TC-AUTH-014                                                   |
| **Título**     | Cadastro com name muito longo                                 |
| **Tipo**       | Edge case                                                     |
| **Prioridade** | Baixa                                                         |
| **Status**     | ❌ Falhou — ver [BUG-003](../bugs/BUG-003-name-max-length.md) |

**Dados de entrada**

```json
{
  "name": "AAAAAA... (300 caracteres)",
  "email": "longname@test.com",
  "password": "123456",
  "phone": "86900000001"
}
```

**Passos**

1. Enviar `POST /signup` com `name` de 300 caracteres

**Resultado esperado**

- Status `400 Bad Request`

**Resultado atual**

- ❌ Status `201 Created` — sem limite de tamanho no campo name

---

### TC-AUTH-015 — Cadastro com name contendo apenas espaços

| Campo          | Detalhe                                                  |
| -------------- | -------------------------------------------------------- |
| **ID**         | TC-AUTH-015                                              |
| **Título**     | Cadastro com name contendo apenas espaços                |
| **Tipo**       | Edge case                                                |
| **Prioridade** | Baixa                                                    |
| **Status**     | ❌ Falhou — ver [BUG-004](../bugs/BUG-004-name-blank.md) |

**Dados de entrada**

```json
{
  "name": "     ",
  "email": "spaces@test.com",
  "password": "123456",
  "phone": "86900000002"
}
```

**Passos**

1. Enviar `POST /signup` com `name` composto apenas de espaços

**Resultado esperado**

- Status `400 Bad Request`

**Resultado atual**

- ❌ Status `201 Created` — nome em branco aceito sem validação

---

## Login — `POST /login`

> **Nota de design:** a API diferencia explicitamente senha incorreta (`422`) de usuário inexistente (`404`). Isso facilita o diagnóstico mas pode expor se um email está cadastrado ou não — considerar unificar em `401` para maior segurança em versões futuras.

---

### TC-AUTH-016 — Login com credenciais válidas

| Campo          | Detalhe                       |
| -------------- | ----------------------------- |
| **ID**         | TC-AUTH-016                   |
| **Título**     | Login com credenciais válidas |
| **Tipo**       | Funcional — sucesso           |
| **Prioridade** | Alta                          |
| **Status**     | ✅ Passou                     |

**Pré-condições**

- Usuário cadastrado no banco

**Dados de entrada**

```json
{
  "email": "user@test.com",
  "password": "123456"
}
```

**Passos**

1. Cadastrar um usuário via factory
2. Enviar `POST /login` com as credenciais do usuário criado

**Resultado esperado**

- Status `200 OK`
- Body contém `token` do tipo string

**Resultado atual**

- ✅ Conforme esperado

---

### TC-AUTH-017 — Login com senha incorreta

| Campo          | Detalhe                        |
| -------------- | ------------------------------ |
| **ID**         | TC-AUTH-017                    |
| **Título**     | Login com senha incorreta      |
| **Tipo**       | Negativo — credencial inválida |
| **Prioridade** | Alta                           |
| **Status**     | ✅ Passou                      |

**Pré-condições**

- Usuário cadastrado no banco

**Dados de entrada**

```json
{
  "email": "user@test.com",
  "password": "wrong-password"
}
```

**Passos**

1. Cadastrar um usuário via factory
2. Enviar `POST /login` com senha incorreta

**Resultado esperado**

- Status `422 Unprocessable Entity`
- Body: `{ "message": "Incorrect password." }`

**Resultado atual**

- ✅ Conforme esperado

---

### TC-AUTH-018 — Login com email não cadastrado

| Campo          | Detalhe                        |
| -------------- | ------------------------------ |
| **ID**         | TC-AUTH-018                    |
| **Título**     | Login com email não cadastrado |
| **Tipo**       | Negativo — credencial inválida |
| **Prioridade** | Alta                           |
| **Status**     | ✅ Passou                      |

**Dados de entrada**

```json
{
  "email": "ghost@notfound.com",
  "password": "123456"
}
```

**Passos**

1. Enviar `POST /login` com email inexistente no banco

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "User not found." }`

**Resultado atual**

- ✅ Conforme esperado

---

### TC-AUTH-019 — Login sem email

| Campo          | Detalhe                      |
| -------------- | ---------------------------- |
| **ID**         | TC-AUTH-019                  |
| **Título**     | Login sem email              |
| **Tipo**       | Negativo — campo obrigatório |
| **Prioridade** | Alta                         |
| **Status**     | ✅ Passou                    |

**Dados de entrada**

```json
{
  "password": "123456"
}
```

**Passos**

1. Enviar `POST /login` sem o campo `email`

**Resultado esperado**

- Status `400 Bad Request`

**Resultado atual**

- ✅ Conforme esperado

---

### TC-AUTH-020 — Login sem password

| Campo          | Detalhe                      |
| -------------- | ---------------------------- |
| **ID**         | TC-AUTH-020                  |
| **Título**     | Login sem password           |
| **Tipo**       | Negativo — campo obrigatório |
| **Prioridade** | Alta                         |
| **Status**     | ✅ Passou                    |

**Dados de entrada**

```json
{
  "email": "user@test.com"
}
```

**Passos**

1. Cadastrar um usuário via factory
2. Enviar `POST /login` sem o campo `password`

**Resultado esperado**

- Status `400 Bad Request`

**Resultado atual**

- ✅ Conforme esperado

---

### TC-AUTH-021 — Login com body vazio

| Campo          | Detalhe                      |
| -------------- | ---------------------------- |
| **ID**         | TC-AUTH-021                  |
| **Título**     | Login com body vazio         |
| **Tipo**       | Negativo — campo obrigatório |
| **Prioridade** | Média                        |
| **Status**     | ✅ Passou                    |

**Dados de entrada**

```json
{}
```

**Passos**

1. Enviar `POST /login` com body vazio

**Resultado esperado**

- Status `400 Bad Request`

**Resultado atual**

- ✅ Conforme esperado

---

### TC-AUTH-022 — Login com email em formato inválido

| Campo          | Detalhe                             |
| -------------- | ----------------------------------- |
| **ID**         | TC-AUTH-022                         |
| **Título**     | Login com email em formato inválido |
| **Tipo**       | Negativo — validação de formato     |
| **Prioridade** | Média                               |
| **Status**     | ✅ Passou                           |

**Dados de entrada**

```json
{
  "email": "not-an-email",
  "password": "123456"
}
```

**Passos**

1. Enviar `POST /login` com email sem formato válido

**Resultado esperado**

- Status `404 Not Found`
- Body: `{ "message": "User not found." }` (API trata email inválido como usuário inexistente)

**Resultado atual**

- ✅ Conforme esperado

---

## Resumo

| ID          | Título                           | Tipo                 | Status     |
| ----------- | -------------------------------- | -------------------- | ---------- |
| TC-AUTH-001 | Cadastro com todos os campos     | Sucesso              | ✅ Passou  |
| TC-AUTH-002 | Cadastro com campos obrigatórios | Sucesso              | ✅ Passou  |
| TC-AUTH-003 | Cadastro com typeUser padrão     | Regra de negócio     | ✅ Passou  |
| TC-AUTH-004 | Token retornado no cadastro      | Regra de negócio     | ✅ Passou  |
| TC-AUTH-005 | Email já cadastrado              | Duplicidade          | ✅ Passou  |
| TC-AUTH-006 | Telefone já cadastrado           | Duplicidade          | ✅ Passou  |
| TC-AUTH-007 | Cadastro sem name                | Campo obrigatório    | ❌ BUG-005 |
| TC-AUTH-008 | Cadastro sem email               | Campo obrigatório    | ❌ BUG-005 |
| TC-AUTH-009 | Cadastro sem password            | Campo obrigatório    | ❌ BUG-005 |
| TC-AUTH-010 | Cadastro com body vazio          | Campo obrigatório    | ❌ BUG-005 |
| TC-AUTH-011 | Email em formato inválido        | Validação de formato | ❌ BUG-001 |
| TC-AUTH-012 | Senha abaixo do mínimo           | Validação de formato | ❌ BUG-002 |
| TC-AUTH-013 | typeUser inválido                | Validação de enum    | ❌ BUG-005 |
| TC-AUTH-014 | Name muito longo                 | Edge case            | ❌ BUG-003 |
| TC-AUTH-015 | Name apenas com espaços          | Edge case            | ❌ BUG-004 |
| TC-AUTH-016 | Login com credenciais válidas    | Sucesso              | ✅ Passou  |
| TC-AUTH-017 | Login com senha incorreta        | Credencial inválida  | ✅ Passou  |
| TC-AUTH-018 | Login com email não cadastrado   | Credencial inválida  | ✅ Passou  |
| TC-AUTH-019 | Login sem email                  | Campo obrigatório    | ✅ Passou  |
| TC-AUTH-020 | Login sem password               | Campo obrigatório    | ✅ Passou  |
| TC-AUTH-021 | Login com body vazio             | Campo obrigatório    | ✅ Passou  |
| TC-AUTH-022 | Login com email inválido         | Validação de formato | ✅ Passou  |

**Total: 22 casos · 13 passaram · 9 falharam (5 bugs documentados)**
