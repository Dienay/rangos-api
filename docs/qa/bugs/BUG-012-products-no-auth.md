# BUG-012 — Endpoints de Products sem autenticação

|                    |                                        |
| ------------------ | -------------------------------------- |
| **ID**             | BUG-012                                |
| **Módulo**         | Products — `POST`, `PUT`, `DELETE`     |
| **Severidade**     | Crítica                                |
| **Prioridade**     | Alta                                   |
| **Status**         | 🔴 Aberto                              |
| **Encontrado em**  | TC-PROD-012 · TC-PROD-019              |
| **Encontrado por** | Análise de código — `productRouter.ts` |

---

## Descrição

As rotas de escrita do módulo de produtos (`POST`, `PUT`, `DELETE`) não exigem autenticação. Qualquer pessoa pode criar, atualizar e deletar produtos sem fornecer token — incluindo upload e substituição de imagens no servidor.

---

## Passos para reproduzir

1- Enviar `POST /products` sem header de autenticação:

```json
{
  "name": "Produto Não Autorizado",
  "price": 0.01,
  "establishmentId": "64f1a2b3c4d5e6f7a8b9c0d2"
}
```

2- Enviar `DELETE /products/:id` sem header de autenticação com ID de produto existente

---

## Resultado esperado

- Status `401 Unauthorized` em rotas de escrita (`POST`, `PUT`, `DELETE`)

## Resultado atual

- Status `201 Created` / `200 OK` — operação executada sem autenticação

---

## Causa raiz

O middleware `checkToken` não foi aplicado a nenhuma rota de escrita do `productsRouter`:

```typescript
// src/routes/productRouter.ts
productsRouter.post('/products', productsUpload.single('productImage'), createProduct);
// ...
productsRouter.put('/products/:id', productsUpload.single('productImage'), updateProduct);
productsRouter.delete('/products/:id', deleteProduct);
// ❌ nenhuma rota de escrita usa checkToken
```

---

## Impacto

- Criação de produtos falsos vinculados a qualquer estabelecimento
- Deleção de produtos por terceiros — impacta cardápios ativos e histórico de pedidos
- Upload de arquivos arbitrários no servidor sem controle de acesso

---

## Sugestão de correção

Aplicar `checkToken` nas rotas de escrita:

```typescript
productsRouter.post('/products', checkToken, productsUpload.single('productImage'), createProduct);
productsRouter.put('/products/:id', checkToken, productsUpload.single('productImage'), updateProduct);
productsRouter.delete('/products/:id', checkToken, deleteProduct);
```

Considerar também validar que apenas o dono do estabelecimento vinculado pode criar ou editar produtos.
