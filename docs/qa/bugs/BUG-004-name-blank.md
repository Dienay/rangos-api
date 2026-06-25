# BUG-004 — Name com apenas espaços aceito

| Campo              | Detalhe                               |
| ------------------ | ------------------------------------- |
| **ID**             | BUG-004                               |
| **Módulo**         | Auth — `POST /signup`                 |
| **Severidade**     | Média                                 |
| **Prioridade**     | Média                                 |
| **Status**         | 🟢 Corrigido                          |
| **Encontrado em**  | TC-AUTH-015                           |
| **Encontrado por** | Teste automatizado — `signup.test.ts` |

---

## Descrição

O endpoint `POST /signup` aceita o campo `name` preenchido apenas com espaços em branco (ex: `"     "`), criando o usuário normalmente. O validador `required: true` do Mongoose não considera uma string composta apenas de espaços como vazia.

---

## Passos para reproduzir

1. Enviar `POST /signup` com o body abaixo:

```json
{
  "name": "     ",
  "email": "spaces@test.com",
  "password": "123456",
  "phone": "86900000002"
}
```

---

## Resultado esperado

```status-code
Status: 400 Bad Request
```

```json
{
  "message": "name is required"
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
  "name": "     ",
  ...
}
```

---

## Evidência

Teste automatizado `should fail with name containing only spaces` em `tests/integration/auth/signup.test.ts`:

```status-code
Expected: 400
Received: 201
```

---

## Causa raiz

O Mongoose aplica `trim` apenas se explicitamente configurado. Sem `trim: true` no campo `name`, a string `"     "` é tratada como valor presente, passando no validador `required`.

```typescript
// atual — sem trim
name: { type: String, required: [true, 'name is required'] }
```

---

## Correção sugerida

Adicionar `trim: true` e um validador customizado para strings vazias após o trim:

```typescript
name: {
  type: String,
  required: [true, 'name is required'],
  trim: true,
  minlength: [1, 'name is required']
}
```

---

## Impacto

- Usuários cadastrados com nome vazio ou invisível
- Problemas de exibição em interfaces que mostram o nome do usuário
- Dados inválidos persistidos no banco sem possibilidade de identificação do usuário
