# 📚 API Reference - Rangos

Documentação completa dos endpoints da API de delivery, incluindo exemplos de requisição, resposta e cenários de teste.

## 🔐 Autenticação

### 📌 Cadastro de Usuário

#### Requisição

```http
POST /signup
```

#### Headers

- Content-Type: application/json

#### Body

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "phone": "11999999999",
  "typeUser": "Customer",
  "avatar": "file.jpg"
}
```

#### Estrutura do Usuário (Resposta)

```json
{
  "_id": "667038c8d23b11fd040e86f5",
  "avatar": "file.jpg",
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "address": []
}
```

#### 📋 Regras de Negócio

- Email deve ser único
- Telefone deve ser único
- Senha deve ser armazenada com hash
- Avatar é opcional
- Endereço NÃO é obrigatório no cadastro

---

#### ⚙️ Comportamento Esperado

- Usuário pode ser criado sem endereço
- Sistema deve permitir adicionar endereço posteriormente

#### Quando o usuário não possui endereço

- Deve ser solicitado no fluxo de pedido
- Usuário pode optar por:
- Salvar o endereço
- Utilizar apenas no pedido atual

---

#### 📤 Respostas Esperadas

- `201 Created` — Usuário criado com sucesso
- `409 Conflict` — Email ou telefone já cadastrado
- `400 Bad Request` — Dados inválidos

---

#### 🔍 Validações Importantes

- Campos obrigatórios devem estar preenchidos
- Email deve ser válido
- Senha deve atender aos critérios mínimos
- Upload deve ser válido (quando enviado)

---

#### 🧪 Cenários de Teste (QA)

##### ✅ Positivos

- Cadastro válido sem endereço
- Cadastro válido com avatar

##### ❌ Negativos

- Email duplicado
- Telefone duplicado
- Campos obrigatórios ausentes

##### ⚠️ Edge Cases

- Strings muito grandes
- Caracteres especiais inesperados
- Upload inválido

### 🔐 Login

#### Requisição

```http
POST /login
```

#### Headers

- Content-Type: application/json

#### Body

```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### ✅ Resposta (200)

```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "123",
    "name": "João Silva"
  }
}
```

#### 📋 Regras de Negócio

- Email deve estar cadastrado
- Senha deve corresponder ao hash armazenado
- Deve retornar token JWT válido
- Token deve conter identificação do usuário

#### 🔍 Validações Importantes

- Campos obrigatórios devem estar preenchidos
- Email deve ter formato válido
- Senha não pode ser vazia

#### ❌ Possíveis Erros

- `401 Unauthorized` – Senha inválida
- `404 Not Found` – Usuário não encontrado
- `400 Bad Request` – Dados inválidos

---

#### 🧪 Cenários de Teste (QA)

##### ✅ Positivos

- Login válido com credenciais corretas

##### ❌ Negativos

- Senha incorreta
- Usuário inexistente
- Campos vazios

##### ⚠️ Edge Cases

- Email com espaços extras
- Email com letras maiúsculas/minúsculas (case sensitivity)
- Tentativas múltiplas de login (possível brute force)

## 👤 Usuários

### 📄 Obter Perfil

```http
GET /user/:id
Headers: Authorization: Bearer <token>
```

### ✏️ Atualizar Usuário

```http
PUT /user/:id
Headers: Authorization: Bearer <token>
Body (multipart/form-data): {
  "name": "Novo Nome",
  "phone": "11999999999",
  "avatar": "arquivo.jpg"
}
```

### 🗑️ Excluir Usuário

```http
DELETE /user/:id
Headers: Authorization: Bearer <token>
```

## 📍 Endereços

```http
GET    /user/:id/address
POST   /user/:id/address
PUT    /user/:id/address/:addressId
DELETE /user/:id/address/:addressId
```

**Exemplo de Endereço:**

```json
{
  "street": "Rua das Flores",
  "number": "123",
  "city": "São Paulo",
  "state": "SP"
}
```

---

## **Estabelecimentos**

### **Listar Estabelecimentos**

```http
GET /establishments
```

**Parâmetros Query:**

- `category`: Filtrar por categoria
- `name`: Busca por nome

### **Criar Estabelecimento**

```http
POST /establishments
Headers: Authorization: Bearer <token>
Body (multipart/form-data): {
  "name": "Pizzaria XYZ",
  "coverPhoto": "arquivo.jpg",
  ...
}
```

### **Detalhes do Estabelecimento**

```http
GET /establishments/:id
```

### **Produtos do Estabelecimento**

```http
GET /establishments/:id/products
```

---

## **Produtos**

### **Criar Produto**

```http
POST /products
Headers: Authorization: Bearer <token>
Body (multipart/form-data): {
  "name": "Pizza Calabresa",
  "price": 45.90,
  "coverPhoto": "arquivo.jpg"
}
```

### **Buscar Produtos**

```http
GET /products/search?name=calabresa
```

### **Atualizar Produto**

```http
PUT /products/:id
Headers: Authorization: Bearer <token>
```

---

## **Pedidos**

### **Fluxo de Pedidos**

```mermaid
stateDiagram-v2
  Carrinho --> Enviado: Cliente confirma
  Enviado --> Recebido: Estabelecimento
  Recebido --> Preparando: Estabelecimento
  Preparando --> Enviado: Estabelecimento
  Enviado --> Entregue: Cliente confirma
```

### **Criar Pedido**

```http
POST /user/:userId/orders
Headers: Authorization: Bearer <token>
Body: {
  "products": [
    {"productId": "456", "quantity": 2}
  ]
}
```

### **Gerenciar Itens do Pedido**

```http
PUT    /user/:userId/orders/:orderId/products
DELETE /user/:userId/orders/:orderId/products/:productId
```

### **Atualizar Status**

```http
PUT /establishments/:id/orders/:orderId
Body: {"status": "Preparando"}
```

---

## **Uploads**

### **Enviar Arquivo**

```http
POST /uploads/establishments
Content-Type: multipart/form-data
Body: { file: "imagem.jpg" }
```

**Tipos Permitidos:**

| Rota           | Formatos       | Tamanho Máx |
| -------------- | -------------- | ----------- |
| /uploads/users | PNG, JPEG, JPG | 2MB         |
| /uploads/\*    | PNG, JPEG, JPG | 8MB         |

---

## **Códigos de Erro Comuns**

| Código | Mensagem                      | Descrição                 |
| ------ | ----------------------------- | ------------------------- |
| 400    | Dados de entrada inválidos    | Validação falhou          |
| 401    | Token inválido ou ausente     | Não autenticado           |
| 403    | Acesso não autorizado         | Permissões insuficientes  |
| 404    | [Recurso] não encontrado      | ID inexistente            |
| 413    | Arquivo excede tamanho máximo | Limite de upload excedido |

**[Lista Completa de Erros →](ERRORS.md)**

---

## **Exemplo de Uso Completo**

### **1. Login**

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "password": "senha123"}'
```

### **2. Criar Pedido**

```bash
curl -X POST http://localhost:3000/user/123/orders \
  -H "Authorization: Bearer eyJhbGci..." \
  -H "Content-Type: application/json" \
  -d '{"products": [{"productId": "abc123", "quantity": 2}]}'
```

### **3. Acompanhar Pedido**

```bash
curl -X GET http://localhost:3000/user/123/orders \
  -H "Authorization: Bearer eyJhbGci..."
```

---

**Notas de Segurança:**

- Todas as rotas (exceto `/signup` e `/login`) requerem token JWT
- Tokens devem ser enviados no header: `Authorization: Bearer <token>`
- Senhas são armazenadas com hash bcrypt

**[Guia Completo de Autenticação →](AUTH_GUIDE.md)**

```markdown
[//]: # 'Mantenha esta documentação atualizada com as mudanças na API'
```

Este arquivo deve ser salvo como `API_REFERENCE.md` no seu repositório. Cada seção pode ser expandida com mais exemplos conforme necessário.
