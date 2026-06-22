# BUG-001 — Email inválido aceito no cadastro

| Campo              | Detalhe                               |
| ------------------ | ------------------------------------- |
| **ID**             | BUG-001                               |
| **Módulo**         | Auth — `POST /signup`                 |
| **Severidade**     | Alta                                  |
| **Prioridade**     | Alta                                  |
| **Status**         | 🔴 Aberto                             |
| **Encontrado em**  | TC-AUTH-011                           |
| **Encontrado por** | Teste automatizado — `signup.test.ts` |

---

## Descrição

O endpoint `POST /signup` aceita emails em formato inválido e cria o usuário com sucesso, retornando `201 Created`. Não há nenhuma validação de formato no schema Mongoose nem no controller.

---

## Passos para reproduzir

1. Enviar `POST /signup` com o body abaixo:

```json
{
  "name": "Test User",
  "email": "invalid-email",
  "password": "123456",
  "phone": "86955555555"
}
```

---

## Resultado esperado

```status-code
Status: 400 Bad Request
```

```json
{
  "message": "Invalid email format."
}
```

---

## Resultado atual

```status-code
Status: 201 Created
```

```json
{
  "message": "User created successfully.",
  "_id": "...",
  "name": "Test User",
  "email": "invalid-email",
  ...
}
```

---

## Evidência

Teste automatizado `should fail with invalid email format` em `tests/integration/auth/signup.test.ts`:

```status-code
Expected: 400
Received: 201
```

---

## Causa raiz

Campo `email` no schema `User.ts` definido sem validação de formato:

```typescript
// atual — sem validação de formato
email: { type: String, required: [true, 'email is required'], unique: true }
```

---

## Correção sugerida

Adicionar validador de formato no schema:

```typescript
email: {
  type: String,
  required: [true, 'email is required'],
  unique: true,
  match: [/^\S+@\S+\.\S+$/, 'Invalid email format.']
}
```

---

## Impacto

- Dados inválidos persistidos no banco
- Usuário criado com email inutilizável para recuperação de senha ou comunicação
- Inconsistência de dados difícil de rastrear posteriormente
