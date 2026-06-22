# BUG-006 — JWT sem expiração

|                    |                                         |
| ------------------ | --------------------------------------- |
| **ID**             | BUG-006                                 |
| **Módulo**         | Auth — `POST /signup` · `POST /login`   |
| **Severidade**     | Alta                                    |
| **Prioridade**     | Alta                                    |
| **Status**         | 🔴 Aberto                               |
| **Encontrado em**  | —                                       |
| **Encontrado por** | Análise de código — `userController.ts` |

---

## Descrição

Os tokens JWT gerados nos endpoints `POST /signup` e `POST /login` não possuem tempo de expiração definido. Uma vez emitido, o token é válido indefinidamente — mesmo que o usuário troque a senha ou a conta seja comprometida, o token continua funcionando.

---

## Passos para reproduzir

1. Fazer login via `POST /login` e capturar o token
2. Decodificar o payload do JWT em [jwt.io](https://jwt.io)
3. Verificar que o campo `exp` está ausente no payload

---

## Resultado esperado

- Token contém campo `exp` com timestamp de expiração
- Requisições com token expirado retornam `401 Unauthorized`

## Resultado atual

- Token não contém campo `exp`
- Token válido indefinidamente

---

## Causa raiz

O `jwt.sign` é chamado sem a opção `expiresIn`:

```typescript
// src/controllers/userController.ts
const token = jwt.sign(
  { id: newUser._id },
  secret
  // ❌ sem expiresIn
);
```

---

## Impacto

- Tokens comprometidos (vazados, roubados) permanecem válidos para sempre
- Impossibilidade de invalidar sessões sem revogar o secret inteiro
- Não conformidade com práticas básicas de segurança de autenticação

---

## Sugestão de correção

Adicionar `expiresIn` na chamada de `jwt.sign`:

```typescript
const token = jwt.sign(
  { id: newUser._id },
  secret,
  { expiresIn: '7d' } // ✅ expira em 7 dias
);
```

Considerar também implementar refresh tokens para sessões de longa duração.
