# BUG-009 — DELETE /address sem autenticação

|                    |                                                    |
| ------------------ | -------------------------------------------------- |
| **ID**             | BUG-009                                            |
| **Módulo**         | Addresses — `DELETE /:entityId/address/:addressId` |
| **Severidade**     | Alta                                               |
| **Prioridade**     | Alta                                               |
| **Status**         | 🔴 Aberto                                          |
| **Encontrado em**  | TC-ADDR-015                                        |
| **Encontrado por** | Análise de código — `addressRouter.ts`             |

---

## Descrição

O endpoint `DELETE /:entityId/address/:addressId` não exige autenticação, ao contrário dos outros três endpoints do mesmo módulo (`GET`, `POST` e `PUT`) que protegem com `checkToken`. Qualquer pessoa com os IDs corretos pode deletar o endereço de qualquer usuário ou estabelecimento sem fornecer token.

---

## Passos para reproduzir

1. Criar um usuário e adicionar um endereço via `POST /:entityId/address`
2. Enviar `DELETE` sem header de autenticação:

```status-code
DELETE /user/:entityId/address/:addressId
(sem header Authorization)
```

---

## Resultado esperado

- Status `401 Unauthorized`
- Body: `{ "message": "Access denied. No token provided." }`

## Resultado atual

- Status `200 OK`
- Endereço deletado sem autenticação

---

## Causa raiz

O `checkToken` foi omitido na definição da rota de deleção:

```typescript
// src/routes/addressRouter.ts
addressRouter.get('/:entityId/address', checkToken, getAddress); // ✅
addressRouter.post('/:entityId/address', checkToken, addAddress); // ✅
addressRouter.put('/:entityId/address/:addressId', checkToken, editAddress); // ✅
addressRouter.delete('/:entityId/address/:addressId', deleteAddress); // ❌ sem checkToken
```

---

## Impacto

- Qualquer pessoa com conhecimento dos IDs pode deletar endereços de outros usuários
- Endereços vinculados a pedidos ativos podem ser removidos indevidamente

---

## Sugestão de correção

Adicionar `checkToken` na rota de deleção:

```typescript
addressRouter.delete('/:entityId/address/:addressId', checkToken, deleteAddress);
```
