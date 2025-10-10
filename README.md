# 🚀 Rangos API - Documentação Completa

<img src="https://img.shields.io/badge/Node.js-18.x-green?logo=node.js" alt="Node.js">
<img src="https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript" alt="TypeScript">
<img src="https://img.shields.io/badge/MongoDB-7.x-brightgreen?logo=mongodb" alt="MongoDB">

Plataforma de delivery online que conecta clientes a estabelecimentos locais, oferecendo gestão completa de pedidos, cardápios e entregas.

## Sumário

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação da API](#documentação-da-api)
- [Modelos de Dados](#modelos-de-dados)
- [Autenticação](#autenticação)
- [Uploads de Arquivos](#uploads-de-arquivos)
- [Tratamento de Erros](#tratamento-de-erros)
- [Testes](#testes)
- [Deploy](#deploy)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Visão Geral
Sistema back-end para plataforma de delivery com:
- Gestão de estabelecimentos e produtos
- Fluxo completo de pedidos
- Autenticação JWT
- Upload de imagens
- Endereços múltiplos

**Funcionalidades Principais:**
- 🛍️ Criação de pedidos com múltiplos produtos
- 📦 Rastreamento de status de pedidos
- 📷 Upload de imagens para produtos e estabelecimentos
- 🔐 Autenticação segura com JWT

---

## Pré-requisitos
- [Node.js 18.x+](https://nodejs.org/en/)
- [npm v8+](https://www.npmjs.com/)
- [Mongodb 6.x+](https://www.mongodb.com/docs/manual/) (local ou [Atlas](https://www.mongodb.com/cloud/atlas))
- [Git](https://git-scm.com/downloads)

---

## Instalação
```bash
# Clone o repositório
git clone https://github.com/Dienay/rangos-backend.git
cd rangos-backend

# Instale as dependências
npm i

# Configure o ambiente (baseado no .env.example)
cp .env.example .env
```

---

## Configuração
### Variáveis de Ambiente (`.env`)
```ini
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://usuario:senha@localhost:27017/rangos
JWT_SECRET=segredo_super_secreto
UPLOAD_DIR=./uploads
```

### Comandos Úteis
```json
{
  "scripts": {
    "dev": "ts-node-dev --watch --respawn --transpile-only --ignore-watch node_modules -r tsconfig-paths/register ./src/app.ts",
    "dev:docker": "docker-compose up --build --force-recreate",
    "start": "node -r module-alias/register dist/app.js",
    "build": "tsc",
    "lint": "eslint .",
    "lint-fix": "eslint . --fix",
    "populate": "ts-node ./src/config/dbPopulate.ts",
    "prettier-format": "prettier --config .prettierrc 'src/**/*.ts' --write"
  }
}
```

---

## Estrutura do Projeto
```
src/
├── config/          # Configurações globais
├── controllers/     # Lógica das rotas
├── errors/          # Erros personalizados
├── middlewares/     # Autenticação e validações
├── models/          # Schemas do MongoDB
├── routes/          # Definição de rotas
├── uploads/         # Arquivos enviados
└── app.ts           # Ponto de entrada
```

---

## Documentação da API
### Rotas Principais
| Método | Endpoint                  | Descrição               |
|--------|---------------------------|-------------------------|
| POST   | /signup                   | Criação de usuário      |
| POST   | /login                    | Autenticação            |
| GET    | /establishments           | Lista estabelecimentos |
| POST   | /products                 | Cria produto            |
| GET    | /user/:id/orders          | Pedidos do usuário      |

**[Documentação Completa da API](API_REFERENCE.md)**

---

## Modelos de Dados
### Diagrama de Entidades
```mermaid
erDiagram
  USUARIO ||--o{ PEDIDO : faz
  ESTABELECIMENTO ||--o{ PRODUTO : oferece
  PEDIDO ||--o{ ITEM-PEDIDO : contem
```

### Principais Entidades
- **Usuário**: `nome, email, senha, tipo`
- **Produto**: `nome, preço, estabelecimento`
- **Pedido**: `status, produtos, valor total`
- **Endereço**: `rua, cidade, estado`

**[Documentação Detalhada dos Models](MODELS.md)**

---

## Autenticação
```http
POST /login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "nome": "João Silva"
  }
}
```

**[Guia de Autenticação](AUTH_GUIDE.md)**

---

## Uploads de Arquivos
### Endpoints
```http
POST /uploads/usuarios           # Avatar do usuário
POST /uploads/produtos           # Imagem do produto
POST /uploads/estabelecimentos   # Foto do estabelecimento
```

**Especificações:**
- Formatos permitidos: `image/jpeg, image/png`
- Tamanho máximo: `8MB`
- Nome do campo: `file`

---

## Tratamento de Erros
### Códigos Comuns
| Código | Tipo                | Exemplo                      |
|--------|---------------------|------------------------------|
| 400    | Requisição Inválida | Dados faltando ou formato incorreto |
| 401    | Não Autorizado      | Token inválido ou ausente    |
| 404    | Não Encontrado      | Recurso inexistente          |
| 413    | Arquivo Grande      | Imagem maior que 8MB         |

**[Lista Completa de Erros](ERRORS.md)**

---

## Deploy
### Recomendações para Produção
1. Usar MongoDB Atlas para banco de dados
2. Configurar variáveis de ambiente adequadas
3. Utilizar PM2 para gerenciamento de processos
4. Habilitar HTTPS
5. Configurar CORS para domínios específicos

---

## Contribuição
### Diretrizes
1. Siga o [Guia de Estilo](CONTRIBUTING.md)
2. Use Conventional Commits
3. Mantenha testes atualizados
4. Documente novas funcionalidades

**Fluxo de Desenvolvimento:**
```bash
git checkout -b feat/nova-funcionalidade
git commit -m "feat: adiciona endpoint de pedidos"
git push origin feat/nova-funcionalidade
```

---

## Licença
Este projeto está licenciado sob a [Licença MIT](LICENSE).

---

# Arquivos Complementares

1. [Referência da API](API_REFERENCE.md) - Documentação detalhada de todos os endpoints
2. [Modelos de Dados](MODELS.md) - Esquemas e relações do MongoDB
3. [Guia de Autenticação](AUTH_GUIDE.md) - Fluxo completo de JWT e permissões
4. [Tratamento de Erros](ERRORS.md) - Lista completa de códigos e mensagens
5. [Contribuição](CONTRIBUTING.md) - Padrões de código e diretrizes para contribuidores

---

**Repositório Oficial:** [github.com/Dienay/rangos-backend](https://github.com/Dienay/rangos-backend)
**Suporte:** suporte@rangos.com
