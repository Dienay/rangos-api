# 🔐 Guia de Autenticação - Rangos

## **Visão Geral do Fluxo**
```mermaid
sequenceDiagram
  Cliente->>API: POST /login (email, senha)
  API->>DB: Verifica credenciais
  DB-->>API: Dados do usuário
  API->>Cliente: Retorna JWT
  Cliente->>API: Requests com JWT
  API->>Cliente: Dados protegidos
```

---

## **1. Como Obter um Token**

### **Cadastro (Primeiro Acesso)**
```http
POST /signup
Content-Type: multipart/form-data

{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "Senha@123",
  "phone": "11988887777",
  "typeUser": "Customer"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "6603b1d9f7b9a92a3c4d5e6f",
    "name": "Maria Silva"
  }
}
```

### **Login**
```http
POST /login
Content-Type: application/json

{
  "email": "maria@email.com",
  "password": "Senha@123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "6603b1d9f7b9a92a3c4d5e6f"
  }
}
```

---

## **2. Usando o Token**
Inclua o token no header de todas requisições protegidas:
```http
GET /user/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## **3. Validade do Token
| Parâmetro         | Valor               |
|-------------------|---------------------|
| Algoritmo         | HS256               |
| Chave Secreta     | JWT_SECRET (`.env`) |
| Expiração         | 24h padrão          |

**Estrutura do Token:**
```json
{
  "id": "6603b1d9f7b9a92a3c4d5e6f",
  "iat": 1712345678,
  "exp": 1712432078
}
```

---

## **4. Middleware de Autenticação**
O `checkToken` realiza 3 verificações:
1. Presença do token no header
2. Validade do JWT
3. Existência do usuário/estabelecimento no banco

**Fluxo do Middleware:**
```mermaid
graph TD
  A[Request] --> B{Token válido?}
  B -->|Sim| C{Usuário existe?}
  C -->|Sim| D[Acesso permitido]
  B -->|Não| E[401 Unauthorized]
  C -->|Não| F[404 Not Found]
```

---

## **5. Boas Práticas de Segurança**

### **No Client-Side**
```javascript
// Armazenamento seguro (Ex: React)
localStorage.setItem('token', response.token);

// Envio em requisições
axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});
```

### **No Server-Side**
- Use sempre HTTPS em produção
- Renove tokens periodicamente
- Implemente rate limiting
- Armazene senhas com bcrypt (salt 12)

---

## **6. Gerenciamento de Senhas**

### **Requisitos de Complexidade**
- Mínimo 8 caracteres
- Pelo menos:
  - 1 letra maiúscula
  - 1 número
  - 1 caractere especial

### **Reset de Senha**
```http
POST /password-reset
Content-Type: application/json

{
  "email": "maria@email.com"
}
```

---

## **7. Tratamento de Erros**
| Código | Cenário                | Resposta                          |
|--------|------------------------|-----------------------------------|
| 401    | Token ausente          | "Access denied. No token..."      |
| 401    | Token inválido         | "Invalid token"                   |
| 403    | Acesso de estabelecimento em rota de usuário | "Access denied" |
| 404    | Usuário não encontrado | "Entity token error"              |

---

## **8. Exemplo de Uso**

### **Login via cURL**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@email.com","password":"Senha@123"}'
```

### **Acesso a Recurso Protegido**
```bash
curl -X GET http://localhost:3000/user/me \
  -H "Authorization: Bearer eyJhbGci..."
```

---

## **9. Testando a Autenticação**

### **Teste de Token Inválido**
```javascript
// Teste com Jest
test('Deve bloquear acesso sem token', async () => {
  const response = await request(app)
    .get('/user/me')
    .expect(401);

  expect(response.body).toHaveProperty('message', 'Access denied...');
});
```

---

## **10. Melhorias Futuras**
1. Refresh Tokens
2. OAuth2 com redes sociais
3. Two-Factor Authentication (2FA)
4. Logs de acesso suspeitos
5. Revogação de tokens

---

**Notas de Atualização:**
Sempre que modificar o sistema de autenticação:
1. Atualize este guia
2. Notifique os clientes da API
3. Revise as permissões de escopo

**[Referência Completa da API →](API_REFERENCE.md)**

```markdown
[//]: # (Manter sincronizado com o middleware checkToken e controllers)
```

Este arquivo deve ser salvo como `AUTH_GUIDE.md`. Para implementações futuras, expanda cada seção com detalhes específicos.
