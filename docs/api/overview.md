# API Overview

## Sobre a API

A Rangos API é uma plataforma de delivery RESTful que gerencia usuários, estabelecimentos, produtos e pedidos. Desenvolvida com Node.js/TypeScript e MongoDB, expõe endpoints JSON para consumo por clientes web e mobile.

---

## Stack

| Camada             | Tecnologia              |
| ------------------ | ----------------------- |
| Runtime            | Node.js 18+             |
| Linguagem          | TypeScript 5.x          |
| Framework          | Express 4.x             |
| Banco de dados     | MongoDB 7.x (Mongoose)  |
| Cache              | Redis                   |
| Autenticação       | JWT (jsonwebtoken)      |
| Upload de arquivos | Multer                  |
| Logs               | Bunyan                  |
| Containerização    | Docker + Docker Compose |

---

## Arquitetura

O projeto segue o padrão **MVC** com cinco domínios principais:

```flow
Request
   │
   ▼
Router → Middleware (checkToken, parseJsonFields, multer)
   │
   ▼
Controller → Model (Mongoose) → MongoDB
   │
   ▼
Response
```

### Domínios

| Domínio       | Descrição                                           |
| ------------- | --------------------------------------------------- |
| User          | Cadastro, autenticação e gestão de usuários         |
| Address       | Endereços vinculados a usuários ou estabelecimentos |
| Establishment | Restaurantes e lojas cadastrados na plataforma      |
| Product       | Produtos vinculados a um estabelecimento            |
| Order         | Pedidos realizados por usuários                     |

### Entrypoints

O projeto tem dois entrypoints com propósitos distintos:

| Arquivo            | Uso                                                           |
| ------------------ | ------------------------------------------------------------- |
| `src/server.ts`    | Execução local — sobe servidor HTTP na porta configurada      |
| `src/api/index.ts` | Deploy serverless (Vercel) — exporta o `app` sem `app.listen` |

---

## Base URL

```http
Local:      http://localhost:3000
Produção:   https://<seu-dominio>.vercel.app
```

---

## Autenticação

A API usa **JWT (Bearer Token)**. Rotas protegidas exigem o header:

```auth
Authorization: Bearer <token>
```

O token é retornado nos endpoints `POST /signup` e `POST /login`.

> Tokens não têm expiração definida na versão atual — ver [BUG-006](../qa/bugs/BUG-006-jwt-no-expiration.md).

Para detalhes completos, consulte a [documentação de auth](endpoints/auth.md).

---

## Uploads de arquivos

Arquivos de imagem são aceitos nos endpoints de criação e atualização de usuários, produtos e estabelecimentos.

| Entidade      | Campo          | Destino                   |
| ------------- | -------------- | ------------------------- |
| User          | `avatar`       | `uploads/users/`          |
| Product       | `productImage` | `uploads/products/`       |
| Establishment | `logo`         | `uploads/establishments/` |

**Tipos aceitos:** `image/png`, `image/jpeg`, `image/jpg`, `image/gif`, `image/svg+xml`
**Tamanho máximo:** 8MB
**Nome gerado:** `{timestamp}-{nome-original}`

Arquivos são servidos como estáticos em `/uploads/<entidade>/<arquivo>`.

---

## Formato das respostas

Todas as respostas usam `Content-Type: application/json`.

### Sucesso

```json
{
  "message": "Descrição da operação.",
  "data": {}
}
```

### Erro

```json
{
  "message": "Descrição do erro.",
  "status": 400
}
```

---

## Códigos de status HTTP

| Código                      | Situação                                        |
| --------------------------- | ----------------------------------------------- |
| `200 OK`                    | Requisição bem-sucedida                         |
| `201 Created`               | Recurso criado com sucesso                      |
| `400 Bad Request`           | Dados inválidos ou ID com formato incorreto     |
| `401 Unauthorized`          | Token ausente                                   |
| `403 Forbidden`             | Ação não permitida para o tipo de entidade      |
| `404 Not Found`             | Recurso não encontrado                          |
| `409 Conflict`              | Recurso já existe (email ou telefone duplicado) |
| `422 Unprocessable Entity`  | Credencial incorreta (senha inválida)           |
| `500 Internal Server Error` | Erro não tratado — indica bug                   |

> Erros de validação de campos obrigatórios retornam `500` na versão atual por um bug no middleware. O esperado seria `400`. Ver [BUG-005](../qa/bugs/BUG-005-missing-fields-500.md).

---

## Classes de erro

O projeto usa uma hierarquia de erros customizada:

```dir
Error (nativo)
└── BaseError          → status configurável, método sendResponse()
    ├── BadRequest     → 400
    ├── NotFound       → 404
    └── ValidateError  → 500 (deveria ser 422 — ver BUG-005)
```

Erros não tratados nos controllers chegam ao middleware `handlesErrors`, que os classifica e responde adequadamente.

---

## Cache

O Redis é usado como cache para o endpoint `GET /products/top`.

| Chave          | TTL    | Fonte de fallback      |
| -------------- | ------ | ---------------------- |
| `top-products` | 1 hora | Aggregation no MongoDB |

O Redis é **opcional** — se não estiver disponível, a API continua funcionando usando MongoDB diretamente. O cache é limpo automaticamente ao encerrar a aplicação (`SIGINT`, `SIGTERM`).

---

## Logs

O projeto usa **Bunyan** com nível `info`. Logs são emitidos para:

- Conexão com MongoDB e Redis
- Erros de inicialização
- Operações de cache (hit/miss)
- Erros de arquivo (upload/delete)

---

## Limitações conhecidas

| Limitação                          | Impacto                                 | Referência |
| ---------------------------------- | --------------------------------------- | ---------- |
| JWT sem expiração                  | Token válido indefinidamente            | BUG-006    |
| Validação de campos retorna 500    | UX ruim, expõe erro interno             | BUG-005    |
| Rotas de Order sem autenticação    | Qualquer um pode criar/alterar pedidos  | —          |
| Rotas de Product sem autenticação  | Qualquer um pode criar/deletar produtos | —          |
| `DELETE /address` sem autenticação | Qualquer um pode deletar endereços      | —          |
| `uploadRoutes` não registrado      | Endpoints de upload standalone inativos | —          |
