# BUG-003 — Name sem limite de tamanho

| Campo              | Detalhe                               |
| ------------------ | ------------------------------------- |
| **ID**             | BUG-003                               |
| **Módulo**         | Auth — `POST /signup`                 |
| **Severidade**     | Baixa                                 |
| **Prioridade**     | Baixa                                 |
| **Status**         | 🟢 Corrigido                          |
| **Encontrado em**  | TC-AUTH-014                           |
| **Encontrado por** | Teste automatizado — `signup.test.ts` |

---

## Descrição

O endpoint `POST /signup` aceita valores arbitrariamente longos no campo `name`, sem aplicar nenhum limite de tamanho. Testado com 300 caracteres, o cadastro é realizado normalmente.

---

## Passos para reproduzir

1. Enviar `POST /signup` com o body abaixo:

```json
{
  "name": "AAAAAAAAA... (300 caracteres)",
  "email": "longname@test.com",
  "password": "123456",
  "phone": "86900000001"
}
```

---

## Resultado esperado

```status-code
Status: 400 Bad Request
```

```json
{
  "message": "Name must be at most 100 characters."
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
  "name": "AAAAAAAAA...",
  ...
}
```

---

## Evidência

Teste automatizado `should fail with very long name` em `tests/integration/auth/signup.test.ts`:

```status-code
Expected: 400
Received: 201
```

---

## Causa raiz

Campo `name` no schema `User.ts` definido sem validação de tamanho máximo:

```typescript
// atual — sem limite de tamanho
name: { type: String, required: [true, 'name is required'] }
```

---

## Correção sugerida

Adicionar validador de tamanho máximo no schema:

```typescript
name: {
  type: String,
  required: [true, 'name is required'],
  maxlength: [100, 'Name must be at most 100 characters.']
}
```

---

## Impacto

- Possível abuso de armazenamento com strings excessivamente longas
- Potencial problema de renderização em interfaces que exibem o nome do usuário
