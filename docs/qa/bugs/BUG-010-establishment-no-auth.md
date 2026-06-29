# BUG-010 — Endpoints de Establishments sem autenticação

|                    |                                              |
| ------------------ | -------------------------------------------- |
| **ID**             | BUG-010                                      |
| **Módulo**         | Establishments — `POST`, `PUT`, `DELETE`     |
| **Severidade**     | Crítica                                      |
| **Prioridade**     | Alta                                         |
| **Status**         | 🔴 Aberto                                    |
| **Encontrado em**  | TC-EST-011 · TC-EST-018                      |
| **Encontrado por** | Análise de código — `establishmentRouter.ts` |

---

## Descrição

Nenhuma rota do módulo de estabelecimentos exige autenticação. Qualquer pessoa pode criar, atualizar e deletar estabelecimentos sem fornecer token — incluindo upload e substituição de imagens no servidor.

---

## Passos para reproduzir

1- Enviar `POST /establishments` sem header de autenticação:

```json
{
  "name": "Estabelecimento Não Autorizado",
  "openingHours": "[{\"day\":\"Monday\",\"periods\":[{\"open\":\"08:00\",\"close\":\"18:00\"}]}]"
}
```

2- Enviar `DELETE /establishments/:id` sem header de autenticação com ID de estabelecimento existente

---

## Resultado esperado

- Status `401 Unauthorized` em rotas de escrita (`POST`, `PUT`, `DELETE`)

## Resultado atual

- Status `201 Created` / `200 OK` — operação executada sem autenticação

---

## Causa raiz

O middleware `checkToken` não foi aplicado a nenhuma rota do `establishmentRouter`:

```typescript
// src/routes/establishmentRouter.ts
establishmentRouter.post('/establishments', establishmentsUpload.single('logo'), createEstablishment);
establishmentRouter.get('/establishments', getEstablishments);
// ...
establishmentRouter.put('/establishments/:id', establishmentsUpload.single('logo'), updateEstablishment);
establishmentRouter.delete('/establishments/:id', deleteEstablishment);
// ❌ nenhuma rota usa checkToken
```

---

## Impacto

- Criação de estabelecimentos fraudulentos por qualquer usuário não autenticado
- Deleção de estabelecimentos por terceiros — perda de dados irreversível
- Upload de arquivos arbitrários no servidor sem controle de acesso

---

## Sugestão de correção

Aplicar `checkToken` nas rotas de escrita:

```typescript
establishmentRouter.post('/establishments', checkToken, establishmentsUpload.single('logo'), createEstablishment);
establishmentRouter.put('/establishments/:id', checkToken, establishmentsUpload.single('logo'), updateEstablishment);
establishmentRouter.delete('/establishments/:id', checkToken, deleteEstablishment);
```

Considerar também criar um tipo de usuário `Admin` ou validar que apenas usuários do tipo `Establishment` gerenciam seus próprios registros.
