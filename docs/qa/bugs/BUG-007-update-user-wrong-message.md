# BUG-006 — Mensagem incorreta ao atualizar usuário inexistente

| Campo              | Detalhe                                 |
| ------------------ | --------------------------------------- |
| **ID**             | BUG-007                                 |
| **Módulo**         | User — `PUT /user/:id`                  |
| **Severidade**     | Baixa                                   |
| **Prioridade**     | Baixa                                   |
| **Status**         | 🔴 Aberto                               |
| **Encontrado em**  | TC-USER-009                             |
| **Encontrado por** | Análise de código — `userController.ts` |

---

## Descrição

Ao tentar atualizar um usuário com ID inexistente, a API retorna a mensagem `"Product Id not found."` em vez de `"User not found."`. Trata-se de um erro de copiar e colar introduzido no método `updateUser` do controller.

---

## Passos para reproduzir

1. Enviar `PUT /user/000000000000000000000000` com qualquer body válido:

```json
{
  "name": "Updated Name"
}
```

---

## Resultado esperado

```status-code
Status: 404 Not Found
```

```json
{
  "message": "User not found."
}
```

---

## Resultado atual

```status-code
Status: 404 Not Found
```

```json
{
  "message": "Product Id not found."
}
```

---

## Causa raiz

Mensagem incorreta hard-coded em `userController.ts` no método `updateUser`:

```typescript
// atual — mensagem errada
if (!updatedUser) {
  return next(new NotFound('Product Id not found.'));
}
```

---

## Correção sugerida

```typescript
// correto
if (!updatedUser) {
  return next(new NotFound('User not found.'));
}
```

---

## Impacto

- Mensagem confusa e inconsistente para o cliente da API
- Dificulta o diagnóstico de erros por parte de quem consome a API
- Indica falta de revisão de código após reutilização entre módulos
