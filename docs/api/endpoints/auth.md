# Endpoints — Auth

|                    |                                                   |
| ------------------ | ------------------------------------------------- |
| **Base path**      | `/`                                               |
| **Autenticação**   | Não requerida                                     |
| **Casos de teste** | [test-cases/auth.md](../../qa/test-cases/auth.md) |

---

## Índice

- [POST /signup](#post-signup)
- [POST /login](#post-login)

---

## POST /signup

Cria um novo usuário e retorna um token JWT.

### Request

**Headers**

```
Content-Type: application/json
```

**Body**

| Campo      | Tipo   | Obrigatório | Notas                                               |
| ---------- | ------ | ----------- | --------------------------------------------------- |
| `name`     | String | ✅          |                                                     |
| `email`    | String | ✅          | Deve ser único                                      |
| `password` | String | ✅          | Armazenada com bcrypt (salt 12)                     |
| `phone`    | String | ❌          | Deve ser único quando informado                     |
| `avatar`   | String | ❌          | Enviar via `multipart/form-data`                    |
| `typeUser` | String | ❌          | `Customer` \| `Establishment` (default: `Customer`) |

> Para enviar `avatar`, usar `Content-Type: multipart/form-data` com o campo `avatar` como arquivo.

**Exemplo**

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "phone": "86999999999",
  "typeUser": "Customer"
}
```

### Responses

**201 Created — sucesso**

```json
{
  "message": "User created successfully.",
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "86999999999",
  "typeUser": "Customer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> O campo `password` nunca é retornado nas respostas.

**409 Conflict — email já cadastrado**

```json
{
  "message": "Email already exists."
}
```

**409 Conflict — telefone já cadastrado**

```json
{
  "message": "Phone already exists."
}
```

**500 Internal Server Error — campos obrigatórios ausentes**

```json
{
  "message": "Found errors: Path 'name' is required; Path 'email' is required",
  "status": 500
}
```

> ⚠️ Campos obrigatórios ausentes retornam `500` em vez de `400`. Ver [BUG-005](../../qa/bugs/BUG-005-missing-fields-500.md).

### Comportamento e regras de negócio

- Token JWT retornado imediatamente no cadastro — não é necessário fazer login separado
- Token não possui expiração definida — ver [BUG-006](../../qa/bugs/BUG-006-jwt-no-expiration.md)
- `email` sem validação de formato — qualquer string é aceita — ver [BUG-001](../../qa/bugs/BUG-001-email-validation.md)
- `password` sem comprimento mínimo — qualquer string é aceita — ver [BUG-002](../../qa/bugs/BUG-002-password-min-length.md)
- `name` sem comprimento máximo — ver [BUG-003](../../qa/bugs/BUG-003-name-max-length.md)
- `name` composto apenas de espaços é aceito — ver [BUG-004](../../qa/bugs/BUG-004-name-blank.md)

---

## POST /login

Autentica um usuário existente e retorna um token JWT.

### Request

**Headers**

```
Content-Type: application/json
```

**Body**

| Campo      | Tipo   | Obrigatório |
| ---------- | ------ | ----------- |
| `email`    | String | ✅          |
| `password` | String | ✅          |

**Exemplo**

```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

### Responses

**200 OK — sucesso**

```json
{
  "message": "User logged in successfully.",
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**400 Bad Request — campos ausentes**

```json
{
  "message": "Email and password are required."
}
```

**404 Not Found — usuário não encontrado**

```json
{
  "message": "User not found."
}
```

**422 Unprocessable Entity — senha incorreta**

```json
{
  "message": "Incorrect password."
}
```

### Comportamento e regras de negócio

- Email com formato inválido retorna `404` — a API tenta buscar o usuário e não encontra, sem validar o formato antes
- A API diferencia explicitamente `404` (usuário inexistente) de `422` (senha errada) — facilita diagnóstico mas expõe se um email está cadastrado; considerar unificar em `401` em versões futuras
- Token não possui expiração definida — ver [BUG-006](../../qa/bugs/BUG-006-jwt-no-expiration.md)

---

## Usando o token

O token retornado por `/signup` ou `/login` deve ser enviado no header de todas as rotas protegidas:

```
Authorization: Bearer <token>
```

**Comportamento do middleware `checkToken`:**

| Situação                                  | Status | Mensagem                              |
| ----------------------------------------- | ------ | ------------------------------------- |
| Header `Authorization` ausente            | `401`  | `"Access denied. No token provided."` |
| Token inválido ou mal formado             | `400`  | `"Invalid token"`                     |
| Entidade do token não encontrada no banco | `404`  | `"Entity token error."`               |
| Token válido                              | —      | Segue para o controller               |

> O middleware não diferencia token expirado de token inválido — ambos retornam `400`.
> A cada requisição autenticada, o middleware faz uma query no banco para verificar se a entidade ainda existe.
