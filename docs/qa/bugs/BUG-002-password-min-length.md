# BUG-002 — Senha sem mínimo de caracteres

| Campo              | Detalhe                               |
| ------------------ | ------------------------------------- |
| **ID**             | BUG-002                               |
| **Módulo**         | Auth — `POST /signup`                 |
| **Severidade**     | Alta                                  |
| **Prioridade**     | Alta                                  |
| **Status**         | 🔴 Aberto                             |
| **Encontrado em**  | TC-AUTH-012                           |
| **Encontrado por** | Teste automatizado — `signup.test.ts` |

---

## Descrição

O endpoint `POST /signup` aceita senhas com qualquer número de caracteres, sem aplicar tamanho mínimo. Senhas muito curtas representam risco de segurança, tornando contas vulneráveis a ataques de força bruta.

---

## Passos para reproduzir

1. Enviar `POST /signup` com o body abaixo:

```json
{
  "name": "Test User",
  "email": "shortpass@test.com",
  "password": "123",
  "phone": "86966666666"
}
```

---

## Resultado esperado

```status-code
Status: 400 Bad Request
```

```json
{
  "message": "Password must be at least 6 characters."
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
  ...
}
```

---

## Evidência

Teste automatizado `should fail with password shorter than 6 characters` em `tests/integration/auth/signup.test.ts`:

```status-code
Expected: 400
Received: 201
```

---

## Causa raiz

Campo `password` no schema `User.ts` definido sem validação de comprimento:

```typescript
// atual — sem validação de tamanho mínimo
password: { type: String, required: [true, 'password is required'] }
```

---

## Correção sugerida

Adicionar validador de tamanho mínimo no schema:

```typescript
password: {
  type: String,
  required: [true, 'password is required'],
  minlength: [6, 'Password must be at least 6 characters.']
}
```

---

## Impacto

- Senhas de 1 caractere são aceitas, comprometendo a segurança das contas
- Usuários podem criar contas com senhas extremamente fracas
- Aumenta a superfície de ataque por força bruta
