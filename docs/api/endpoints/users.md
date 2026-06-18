# Endpoints — Users

|                    |                                                     |
| ------------------ | --------------------------------------------------- |
| **Base path**      | `/user`                                             |
| **Autenticação**   | Requerida na maioria das rotas (Bearer Token)       |
| **Modelo**         | [User](../models.md#user)                           |
| **Casos de teste** | [test-cases/users.md](../../qa/test-cases/users.md) |

---

## Índice

- [GET /user/:id](#get-userid)
- [PUT /user/:id](#put-userid)
- [DELETE /user/:id](#delete-userid)

> Cadastro e login estão em [auth.md](auth.md).
> Endereços do usuário estão em [addresses.md](addresses.md).
> Pedidos do usuário estão em [orders.md](orders.md).

---

## GET /user/:id

Retorna os dados públicos de um usuário pelo ID.

### Request

**Headers**

```
Authorization: Bearer <token>
```

**Path params**

| Parâmetro | Tipo     | Descrição     |
| --------- | -------- | ------------- |
| `id`      | ObjectId | ID do usuário |

### Responses

**200 OK — sucesso**

```json
{
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "avatar": "http://localhost:3000/uploads/users/1234567890-avatar.jpg",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "86999999999"
  }
}
```

> `password`, `address` e `typeUser` não são retornados neste endpoint.

**401 Unauthorized — token ausente**

```json
{
  "message": "Access denied. No token provided."
}
```

**404 Not Found — usuário não encontrado**

```json
{
  "message": "User not found."
}
```

**400 Bad Request — ID com formato inválido**

```json
{
  "message": "Bad Request: incorrect input data",
  "status": 400
}
```

### Comportamento e regras de negócio

- `password` nunca é retornado
- `avatar` é retornado como URL completa: `{protocol}://{host}/uploads/users/{filename}`
- Se `avatar` não foi enviado no cadastro, a URL retornada será `uploads/users/undefined`

---

## PUT /user/:id

Atualiza os dados de um usuário. Suporta upload de novo avatar.

### Request

**Headers**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

> Para atualizar apenas dados textuais sem trocar o avatar, `Content-Type: application/json` também é aceito.

**Path params**

| Parâmetro | Tipo     | Descrição     |
| --------- | -------- | ------------- |
| `id`      | ObjectId | ID do usuário |

**Body**

| Campo    | Tipo   | Obrigatório | Notas                             |
| -------- | ------ | ----------- | --------------------------------- |
| `name`   | String | ❌          |                                   |
| `email`  | String | ❌          |                                   |
| `phone`  | String | ❌          |                                   |
| `avatar` | File   | ❌          | Enviar como `multipart/form-data` |

> `password` e `typeUser` não podem ser alterados por este endpoint.

**Exemplo**

```json
{
  "name": "João Atualizado",
  "email": "novo@email.com"
}
```

### Responses

**200 OK — sucesso**

```json
{
  "message": "User updated already.",
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "avatar": "1234567890-novo-avatar.jpg",
    "name": "João Atualizado",
    "email": "novo@email.com",
    "phone": "86999999999"
  }
}
```

**401 Unauthorized — token ausente**

```json
{
  "message": "Access denied. No token provided."
}
```

**404 Not Found — usuário não encontrado**

```json
{
  "message": "User not found."
}
```

**400 Bad Request — ID com formato inválido**

```json
{
  "message": "Bad Request: incorrect input data",
  "status": 400
}
```

### Comportamento e regras de negócio

- Apenas os campos `name`, `email`, `phone` e `avatar` são atualizáveis
- Se um novo `avatar` for enviado, o arquivo anterior é deletado do disco antes de salvar o novo
- Se o arquivo anterior não existir no disco, a atualização prossegue normalmente
- `avatar` não é retornado como URL completa neste endpoint — retorna apenas o nome do arquivo

> ⚠️ A mensagem de erro quando usuário não é encontrado internamente diz `"Product Id not found."` — erro de texto no código.

---

## DELETE /user/:id

Remove um usuário permanentemente.

### Request

**Headers**

```
Authorization: Bearer <token>
```

**Path params**

| Parâmetro | Tipo     | Descrição     |
| --------- | -------- | ------------- |
| `id`      | ObjectId | ID do usuário |

### Responses

**200 OK — sucesso**

```json
{
  "message": "User deleted successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "86999999999",
    "typeUser": "Customer"
  }
}
```

**401 Unauthorized — token ausente**

```json
{
  "message": "Access denied. No token provided."
}
```

**404 Not Found — usuário não encontrado**

```json
{
  "message": "User not found"
}
```

**400 Bad Request — ID com formato inválido**

```json
{
  "message": "Bad Request: incorrect input data",
  "status": 400
}
```

### Comportamento e regras de negócio

- O arquivo de `avatar` **não é deletado do disco** ao remover o usuário — diferente de `PUT /user/:id` e dos endpoints de establishment e product que deletam a imagem associada
- Pedidos e endereços vinculados ao usuário **não são removidos** em cascata
- A resposta inclui os dados do usuário deletado, exceto `password`

---

## Resumo das rotas

| Método   | Rota        | Autenticação | Descrição                                   |
| -------- | ----------- | ------------ | ------------------------------------------- |
| `POST`   | `/signup`   | ❌           | Criar usuário — ver [auth.md](auth.md)      |
| `POST`   | `/login`    | ❌           | Autenticar usuário — ver [auth.md](auth.md) |
| `GET`    | `/user/:id` | ✅           | Buscar usuário por ID                       |
| `PUT`    | `/user/:id` | ✅           | Atualizar usuário                           |
| `DELETE` | `/user/:id` | ✅           | Remover usuário                             |
