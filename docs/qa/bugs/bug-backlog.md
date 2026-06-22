# Bug Backlog — Rangos API

> Registro centralizado de todos os bugs encontrados durante a análise e testes.
> Bug reports detalhados em `docs/qa/bugs/`.

---

## Resumo

| ID                  | Módulo         | Descrição                                | Severidade | Prioridade | Status    |
| ------------------- | -------------- | ---------------------------------------- | ---------- | ---------- | --------- |
| [BUG-001](#bug-001) | Auth           | Email inválido aceito no cadastro        | Alta       | Alta       | 🔴 Aberto |
| [BUG-002](#bug-002) | Auth           | Senha sem mínimo de caracteres           | Alta       | Alta       | 🔴 Aberto |
| [BUG-003](#bug-003) | Auth           | Name sem limite de tamanho               | Baixa      | Baixa      | 🔴 Aberto |
| [BUG-004](#bug-004) | Auth           | Name com apenas espaços aceito           | Média      | Média      | 🔴 Aberto |
| [BUG-005](#bug-005) | Global         | Campos obrigatórios retornam 500         | Crítica    | Alta       | 🔴 Aberto |
| [BUG-006](#bug-006) | Auth           | JWT sem expiração                        | Alta       | Alta       | 🔴 Aberto |
| [BUG-007](#bug-007) | Users          | Mensagem incorreta no updateUser         | Baixa      | Baixa      | 🔴 Aberto |
| [BUG-008](#bug-008) | Users          | Sem verificação de duplicidade no update | Alta       | Alta       | 🔴 Aberto |
| [BUG-009](#bug-009) | Addresses      | DELETE /address sem autenticação         | Alta       | Alta       | 🔴 Aberto |
| [BUG-010](#bug-010) | Establishments | Rotas de escrita sem autenticação        | Crítica    | Alta       | 🔴 Aberto |
| [BUG-011](#bug-011) | Middleware     | parseJsonFields não interrompe execução  | Média      | Média      | 🔴 Aberto |
| [BUG-012](#bug-012) | Products       | Rotas de escrita sem autenticação        | Crítica    | Alta       | 🔴 Aberto |
| [BUG-013](#bug-013) | Orders         | Todas as rotas sem autenticação          | Crítica    | Alta       | 🔴 Aberto |

- **Total: 13 bugs · 4 críticos · 0 corrigidos · 13 abertos**

---

## Legenda

### Severidade

| Nível   | Descrição                                                    |
| ------- | ------------------------------------------------------------ |
| Crítica | Falha que expõe dados, quebra a aplicação ou afeta segurança |
| Alta    | Funcionalidade principal não funciona conforme esperado      |
| Média   | Comportamento incorreto mas com workaround possível          |
| Baixa   | Impacto mínimo, cosmético ou de mensagem                     |

### Status

| Símbolo         | Significado                                                 |
| --------------- | ----------------------------------------------------------- |
| 🔴 Aberto       | Bug identificado, aguardando correção                       |
| 🟡 Em progresso | Correção em desenvolvimento                                 |
| 🟢 Corrigido    | Correção implementada e validada                            |
| ⚪ Descartado   | Não será corrigido (comportamento intencional ou won't fix) |

---

## Auth

---

### BUG-001

- **Email inválido aceito no cadastro**

| Campo             | Detalhe                                                         |
| ----------------- | --------------------------------------------------------------- |
| **Módulo**        | Auth — `POST /signup`                                           |
| **Severidade**    | Alta                                                            |
| **Status**        | 🔴 Aberto                                                       |
| **Encontrado em** | TC-AUTH-011                                                     |
| **Report**        | [BUG-001-email-validation.md](bugs/BUG-001-email-validation.md) |

O endpoint `/signup` aceita emails em formato inválido (ex: `invalid-email`) e cria o usuário normalmente. O schema Mongoose não possui validação de formato de email.

**Resultado esperado** → `400 Bad Request`
**Resultado atual** → `201 Created`

---

### BUG-002

- **Senha sem mínimo de caracteres**

| Campo             | Detalhe                                                               |
| ----------------- | --------------------------------------------------------------------- |
| **Módulo**        | Auth — `POST /signup`                                                 |
| **Severidade**    | Alta                                                                  |
| **Status**        | 🔴 Aberto                                                             |
| **Encontrado em** | TC-AUTH-012                                                           |
| **Report**        | [BUG-002-password-min-length.md](bugs/BUG-002-password-min-length.md) |

O endpoint `/signup` aceita senhas com qualquer quantidade de caracteres, sem aplicar nenhuma regra de tamanho mínimo.

**Resultado esperado** → `400 Bad Request`
**Resultado atual** → `201 Created`

---

### BUG-003

- **Name sem limite de tamanho**

| Campo             | Detalhe                                                       |
| ----------------- | ------------------------------------------------------------- |
| **Módulo**        | Auth — `POST /signup`                                         |
| **Severidade**    | Baixa                                                         |
| **Status**        | 🔴 Aberto                                                     |
| **Encontrado em** | TC-AUTH-014                                                   |
| **Report**        | [BUG-003-name-max-length.md](bugs/BUG-003-name-max-length.md) |

O endpoint `/signup` aceita strings arbitrariamente longas no campo `name` sem aplicar nenhum limite de tamanho.

**Resultado esperado** → `400 Bad Request`
**Resultado atual** → `201 Created`

---

### BUG-004

- **Name com apenas espaços aceito**

| Campo             | Detalhe                                             |
| ----------------- | --------------------------------------------------- |
| **Módulo**        | Auth — `POST /signup`                               |
| **Severidade**    | Média                                               |
| **Status**        | 🔴 Aberto                                           |
| **Encontrado em** | TC-AUTH-015                                         |
| **Report**        | [BUG-004-name-blank.md](bugs/BUG-004-name-blank.md) |

O endpoint `/signup` aceita o campo `name` preenchido apenas com espaços em branco. O `required: true` do Mongoose não rejeita strings compostas apenas de espaços.

**Resultado esperado** → `400 Bad Request`
**Resultado atual** → `201 Created`

---

### BUG-005

- **Campos obrigatórios ausentes retornam 500**

| Campo             | Detalhe                                                             |
| ----------------- | ------------------------------------------------------------------- |
| **Módulo**        | Global — todos os endpoints de criação e atualização                |
| **Severidade**    | Crítica                                                             |
| **Status**        | 🔴 Aberto                                                           |
| **Encontrado em** | TC-AUTH-007 · TC-AUTH-008 · TC-AUTH-009 · TC-AUTH-010 · TC-AUTH-013 |
| **Report**        | [BUG-005-missing-fields-500.md](bugs/BUG-005-missing-fields-500.md) |

Campos obrigatórios ausentes ou valores inválidos em enums retornam `500` em vez de `400`. A classe `ValidateError` não define status code, herdando `500` de `BaseError`.

**Resultado esperado** → `400 Bad Request`
**Resultado atual** → `500 Internal Server Error`

---

### BUG-006

- **JWT sem expiração**

| Campo             | Detalhe                                                           |
| ----------------- | ----------------------------------------------------------------- |
| **Módulo**        | Auth — `POST /signup` · `POST /login`                             |
| **Severidade**    | Alta                                                              |
| **Status**        | 🔴 Aberto                                                         |
| **Encontrado em** | Análise de código                                                 |
| **Report**        | [BUG-006-jwt-no-expiration.md](bugs/BUG-006-jwt-no-expiration.md) |

Tokens JWT gerados sem `expiresIn` — válidos indefinidamente mesmo após comprometimento da conta.

**Resultado esperado** → Token com campo `exp`
**Resultado atual** → Token sem expiração

---

## Users

---

### BUG-007

- **Mensagem incorreta ao atualizar usuário inexistente**

| Campo             | Detalhe                                                                           |
| ----------------- | --------------------------------------------------------------------------------- |
| **Módulo**        | Users — `PUT /user/:id`                                                           |
| **Severidade**    | Baixa                                                                             |
| **Status**        | 🔴 Aberto                                                                         |
| **Encontrado em** | TC-USER-009                                                                       |
| **Report**        | [BUG-007-update-user-wrong-message.md](bugs/BUG-007-update-user-wrong-message.md) |

Ao atualizar um usuário inexistente, a API retorna `"Product Id not found."` em vez de `"User not found."` — erro de copiar e colar no controller.

**Resultado esperado** → `{ "message": "User not found." }`
**Resultado atual** → `{ "message": "Product Id not found." }`

---

### BUG-008

- **Sem verificação de duplicidade ao atualizar email ou telefone**

| Campo             | Detalhe                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------- |
| **Módulo**        | Users — `PUT /user/:id`                                                                     |
| **Severidade**    | Alta                                                                                        |
| **Status**        | 🔴 Aberto                                                                                   |
| **Encontrado em** | TC-USER-009                                                                                 |
| **Report**        | [BUG-008-update-user-no-duplicate-check.md](bugs/BUG-008-update-user-no-duplicate-check.md) |

`PUT /user/:id` permite atualizar email ou telefone para um valor já cadastrado por outro usuário, sem verificar duplicidade — inconsistente com o `POST /signup`.

**Resultado esperado** → `409 Conflict`
**Resultado atual** → `200 OK`

---

## Addresses

---

### BUG-009

- **DELETE /address sem autenticação**

| Campo             | Detalhe                                                                     |
| ----------------- | --------------------------------------------------------------------------- |
| **Módulo**        | Addresses — `DELETE /:entityId/address/:addressId`                          |
| **Severidade**    | Alta                                                                        |
| **Status**        | 🔴 Aberto                                                                   |
| **Encontrado em** | TC-ADDR-015                                                                 |
| **Report**        | [BUG-009-delete-address-no-auth.md](bugs/BUG-009-delete-address-no-auth.md) |

O único endpoint do módulo sem `checkToken`. Qualquer pessoa com os IDs corretos pode deletar endereços sem autenticação.

**Resultado esperado** → `401 Unauthorized`
**Resultado atual** → `200 OK`

---

## Establishments

---

### BUG-010

- **Rotas de escrita sem autenticação**

| Campo             | Detalhe                                                                     |
| ----------------- | --------------------------------------------------------------------------- |
| **Módulo**        | Establishments — `POST`, `PUT`, `DELETE`                                    |
| **Severidade**    | Crítica                                                                     |
| **Status**        | 🔴 Aberto                                                                   |
| **Encontrado em** | TC-EST-011 · TC-EST-018                                                     |
| **Report**        | [BUG-010-establishments-no-auth.md](bugs/BUG-010-establishments-no-auth.md) |

Nenhuma rota de escrita do módulo exige autenticação. Qualquer pessoa pode criar, atualizar e deletar estabelecimentos.

**Resultado esperado** → `401 Unauthorized`
**Resultado atual** → `201 Created / 200 OK`

---

## Middleware

---

### BUG-011

- **parseJsonFields não interrompe execução em JSON inválido**

| Campo             | Detalhe                                                           |
| ----------------- | ----------------------------------------------------------------- |
| **Módulo**        | Middleware — `parseJsonFields`                                    |
| **Severidade**    | Média                                                             |
| **Status**        | 🔴 Aberto                                                         |
| **Encontrado em** | TC-EST-014                                                        |
| **Report**        | [BUG-011-parse-json-fields.md](bugs/BUG-011-parse-json-fields.md) |

O `return` dentro do `forEach` não encerra a função — `next()` é chamado mesmo após o erro, fazendo a requisição prosseguir com dados inválidos.

**Resultado esperado** → `400 Bad Request` e requisição interrompida
**Resultado atual** → Comportamento imprevisível — pode causar `Cannot set headers after they are sent`

---

## Products

---

### BUG-012

- **Rotas de escrita sem autenticação**

| Campo             | Detalhe                                                         |
| ----------------- | --------------------------------------------------------------- |
| **Módulo**        | Products — `POST`, `PUT`, `DELETE`                              |
| **Severidade**    | Crítica                                                         |
| **Status**        | 🔴 Aberto                                                       |
| **Encontrado em** | TC-PROD-012 · TC-PROD-019                                       |
| **Report**        | [BUG-012-products-no-auth.md](bugs/BUG-012-products-no-auth.md) |

Nenhuma rota de escrita do módulo exige autenticação. Qualquer pessoa pode criar, atualizar e deletar produtos.

**Resultado esperado** → `401 Unauthorized`
**Resultado atual** → `201 Created / 200 OK`

---

## Orders

---

### BUG-013

- **Todas as rotas sem autenticação**

| Campo             | Detalhe                                                     |
| ----------------- | ----------------------------------------------------------- |
| **Módulo**        | Orders — todas as rotas                                     |
| **Severidade**    | Crítica                                                     |
| **Status**        | 🔴 Aberto                                                   |
| **Encontrado em** | TC-ORD-009                                                  |
| **Report**        | [BUG-013-orders-no-auth.md](bugs/BUG-013-orders-no-auth.md) |

Nenhuma rota do módulo exige autenticação. Qualquer pessoa pode criar, consultar, atualizar e deletar pedidos. O endpoint `GET /:entityId/orders/:orderId` também não verifica se o pedido pertence ao `entityId` informado.

**Resultado esperado** → `401 Unauthorized`
**Resultado atual** → `201 Created / 200 OK / 200 OK (acesso cruzado)`
