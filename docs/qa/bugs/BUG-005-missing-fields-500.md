# BUG-005 — Campos obrigatórios ausentes retornam 500

| Campo              | Detalhe                                                         |
| ------------------ | --------------------------------------------------------------- |
| **ID**             | BUG-005                                                         |
| **Módulo**         | Auth — `POST /signup`                                           |
| **Severidade**     | Crítica                                                         |
| **Prioridade**     | Alta                                                            |
| **Status**         | 🟢 Corrigido                                                    |
| **Encontrado em**  | TC-AUTH-007, TC-AUTH-008, TC-AUTH-009, TC-AUTH-010, TC-AUTH-013 |
| **Encontrado por** | Teste automatizado — `signup.test.ts`                           |

---

## Descrição

Quando campos obrigatórios estão ausentes no body do `POST /signup`, ou quando um valor inválido é enviado para `typeUser`, a API retorna `500 Internal Server Error` em vez de `400 Bad Request`. O middleware de tratamento de erros não está interceptando e convertendo os erros de validação do Mongoose em respostas HTTP apropriadas.

---

## Passos para reproduzir

**Cenário 1 — Signup sem `name`:**

```json
{
  "email": "noname@test.com",
  "password": "123456",
  "phone": "86922222222"
}
```

**Cenário 2 — Signup sem `email`:**

```json
{
  "name": "Test User",
  "password": "123456",
  "phone": "86933333333"
}
```

**Cenário 3 — Signup sem `password`:**

```json
{
  "name": "Test User",
  "email": "nopassword@test.com",
  "phone": "86944444444"
}
```

**Cenário 4 — Body vazio:**

```json
{}
```

**Cenário 5 — `typeUser` inválido:**

```json
{
  "name": "Test User",
  "email": "invalidtype@test.com",
  "password": "123456",
  "phone": "86977777777",
  "typeUser": "Admin"
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
Status: 500 Internal Server Error
```

---

## Evidência

Testes automatizados em `tests/integration/auth/signup.test.ts`:

```status-code
● Signup › ❌ Missing required fields › should fail without name
  Expected: 400
  Received: 500

● Signup › ❌ Missing required fields › should fail without email
  Expected: 400
  Received: 500

● Signup › ❌ Missing required fields › should fail without password
  Expected: 400
  Received: 500

● Signup › ❌ Missing required fields › should fail with empty body
  Expected: 400
  Received: 500

● Signup › ❌ Invalid format › should fail with invalid typeUser value
  Expected: 400
  Received: 500
```

---

## Causa raiz

O middleware de tratamento de erros não identifica e converte `ValidationError` do Mongoose em `400 Bad Request`. O erro chega ao handler genérico e é retornado como `500`, potencialmente expondo stack trace em ambiente de produção.

O signup faz `validateSync()` antes de salvar, mas o erro gerado não é tratado corretamente pelo middleware:

```typescript
const validationError = new User(req.body).validateSync();

if (validationError) {
  return next(validationError); // passa o ValidationError para o middleware
}
```

O middleware de erro precisa verificar o tipo do erro e retornar `400` quando for `ValidationError`.

---

## Correção sugerida

Adicionar tratamento de `ValidationError` no middleware de erros:

```typescript
if (error.name === 'ValidationError') {
  return res.status(400).json({
    message: Object.values(error.errors)
      .map((e) => e.message)
      .join(', ')
  });
}
```

---

## Impacto

- `500` em produção pode expor stack trace com detalhes internos da aplicação
- Risco de segurança — informações sobre a estrutura do código podem ser expostas
- Experiência de usuário prejudicada — cliente não recebe mensagem de erro útil
- Mais crítico entre os bugs encontrados no módulo de autenticação
- Testes que esperam 400 falham sistematicamente
