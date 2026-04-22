# 🚀 Rangos API

---

## 🛠️ Tecnologias & Ferramentas

### Backend

![NodeJs](<img src="https://img.shields.io/badge/Node.js-18.x-green?logo=node.js" />) ![TypeScript](<img src="https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript" />) ![MOngoDB](<img src="https://img.shields.io/badge/MongoDB-7.x-brightgreen?logo=mongodb" />)

### QA & Testes

![Jest](<img src="https://img.shields.io/badge/Jest-Testing-red?logo=jest" />) ![Supertest](<img src="https://img.shields.io/badge/Supertest-API-blue" />) ![Postman](<img src="https://img.shields.io/badge/Postman-API-orange?logo=postman" />)

---

API de plataforma de delivery desenvolvida com foco em **qualidade de software (QA)**, cobrindo testes de API, validação de fluxos críticos e estrutura para automação de testes.

---

## 🧠 Visão Geral

Sistema back-end responsável por:

- Gestão de usuários e autenticação
- Estabelecimentos e produtos
- Fluxo completo de pedidos
- Upload de arquivos
- Endereços múltiplos

## 🎯 Foco do Projeto

Este projeto foi estruturado para aplicar práticas de QA:

- ✔ Validação de fluxos críticos
- ✔ Criação de cenários de teste
- ✔ Testes de integração
- ✔ Preparação para automação
- ✔ Testes manuais com Postman

---

## 🧪 QA & Testes

### Tipos de Teste

- Funcionais
- Integração
- Regressão

### Ferramentas

- **Postman**
- **Jest**
- **Supertest**
- **MongoDB**
- **Multer**
- **Bunyan**
- **Redis**

## 📦 Collection de Testes

O projeto inclui uma collection do Postman para validação dos endpoints.

📁 `/postman/rangos_collection.json`

### 📁 Estrutura de Testes (planejada)

```text
tests/
├── integration/
│   ├── auth.test.ts
│   ├── user.test.ts
│   ├── order.test.ts
│   └── product.test.ts
```

---

## ⚙️ Pré-requisitos

### 🔧 Execução local

- Node.js 18+
- npm 8+
- MongoDB
- Git

---

### 🐳 Execução com Docker

- Docker
- Docker Compose

> 💡 Ao utilizar Docker, não é necessário instalar Node.js ou MongoDB localmente.

---

## 🚀 Instalação

```bash
git clone https://github.com/Dienay/rangos-api.git
cd rangos-api
npm i
cp .env.example .env
```

---

## 🐳 Ambiente com Docker

O projeto pode ser executado utilizando Docker com o script `run.sh`.

### ▶️ Permissão de execução

```bash
chmod +x run.sh
```

### 🚀 Comandos disponíveis

```bash
./run.sh up              # Inicia os containers
./run.sh build           # Build dos containers
./run.sh rebuild         # Build + start
./run.sh rebuild:force   # Rebuild forçado
./run.sh down            # Remove containers
./run.sh stop            # Para containers
./run.sh restart         # Reinicia containers
./run.sh logs            # Logs em tempo real
./run.sh ps              # Lista containers
```

---

## Configuração

### Variáveis de Ambiente

```env
NODE_ENV=development
PORT=3000
REDIS_URL=redis://rangos-redis-server:6379
MONGO_URL=mongodb://rangos-mongo:27017/rangos
JWT_SECRET=segredo_super_secreto
```

## 🏗️ Estrutura do Projeto

A aplicação segue uma arquitetura modular, separando responsabilidades para facilitar manutenção, escalabilidade e testes.

```dir
src/
├── config/          # Configurações globais (database, variáveis de ambiente)
├── controllers/     # Camada responsável por processar requisições e respostas
├── errors/          # Tratamento centralizado de erros e exceções
├── middlewares/     # Interceptadores (auth, validações, etc.)
├── models/          # Schemas e interação com o banco de dados
├── routes/          # Definição das rotas e endpoints da API
├── uploads/         # Armazenamento de arquivos enviados
└── app.ts           # Inicialização da aplicação
```

---

### 📚 Documentação

A documentação está organizada nos seguintes arquivos:

**[API Reference](API_REFERENCE.md)**
**[Models](MODELS.md)**
**[Auth Guide](AUTH_GUIDE.md)**
**[Errors](ERRORS.md)**

---

## ⚠️ Qualidade & Confiabilidade

### Tratamento de Erros

| Código | Descrição            |
| ------ | -------------------- |
| 400    | Requisição inválida  |
| 401    | Não autorizado       |
| 404    | Não encontrado       |
| 413    | Payload muito grande |
| 500    | Erro interno         |

### Possíveis Pontos de Falha

- Upload de arquivos
- Integrações externas
- Concorrência de dados

---

### 🚀 Deploy

- MongoDB Atlas
- PM2
- HTTPS
- Configuração de CORS

---

## Contribuição

1. Seguir padrão de código
2. Utilizar Conventional Commits
3. Manter testes atualizados
4. Documentar alterações

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
