# 🚀 Rangos API

## Sobre o projeto

A Rangos API simula um ambiente de produção com autenticação JWT,
múltiplas entidades relacionadas, upload de arquivos, cache Redis e
logs estruturados. Esse contexto permitiu exercitar QA em cenários
próximos do real — incluindo 11 bugs encontrados durante a análise
do código, 3 deles críticos de segurança por ausência de autenticação
em módulos inteiros.

---

## 🛠️ Tecnologias & Ferramentas

### Backend

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-cache-DC382D?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-container-2496ED?logo=docker&logoColor=white)

### QA & Testes

![Jest](https://img.shields.io/badge/Jest-testing-C21325?logo=jest&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-integration-6BA3BE)
![Postman](https://img.shields.io/badge/Postman-collection-FF6C37?logo=postman&logoColor=white)

---

## 🧠 Visão Geral

O sistema simula uma plataforma de delivery completa, permitindo testar e validar:

- 🔐 Autenticação e autorização (JWT)
- 👤 Gestão de usuários
- 🏪 Cadastro de estabelecimentos e produtos
- 📦 Fluxo completo de pedidos
- 📁 Upload e tratamento de arquivos (Multer)
- 📍 Endereços múltiplos por usuário
- ⚠️ Validações, erros e cenários de borda

---

## 🎯 Foco em Qualidade de Software

Este projeto foi estruturado para demonstrar práticas reais de QA em uma API REST:

| Prática                                     | Status                   |
| ------------------------------------------- | ------------------------ |
| Testes de integração (Jest + Supertest)     | ✅ Auth completo         |
| Banco isolado por teste (MongoMemoryServer) | ✅                       |
| Factories de dados de teste                 | ✅                       |
| Estratégia de testes documentada            | ✅                       |
| Casos de teste documentados                 | ✅ 122 casos · 6 módulos |
| Bug reports documentados                    | ✅ 11 bugs · 3 críticos  |
| Collection Postman                          | ✅                       |
| Testes dos demais módulos                   | 🔜 Em andamento          |
| CI/CD (GitHub Actions)                      | 🔜 Planejado             |

---

## 🧪 Testes

### Estrutura

```dir
tests/
├── factories/
│   └── UserFactory.ts        # Geração de dados de teste
├── helpers/
│   └── app.ts                # Configuração compartilhada
├── integration/
│   └── auth/
│       ├── login.test.ts
│       └── signup.test.ts
└── setup.ts
```

### Como rodar

```bash
# Rodar todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Com relatório de cobertura
npm run test:cov
```

### Collection Postman

O projeto inclui uma collection completa para validação manual dos endpoints.

```dir
postman/rangos_collection.json
```

---

## 📋 Documentação QA

A documentação de qualidade está organizada em `docs/qa/`:

| Documento                                                               | Descrição                          |
| ----------------------------------------------------------------------- | ---------------------------------- |
| [Estratégia de Testes](docs/qa/test-strategy.md)                        | Abordagem, ferramentas e critérios |
| [Casos de Teste — Auth](docs/qa/test-cases/auth.md)                     | 22 cenários · 9 bugs encontrados   |
| [Casos de Teste — Users](docs/qa/test-cases/users.md)                   | 15 cenários                        |
| [Casos de Teste — Addresses](docs/qa/test-cases/addresses.md)           | 17 cenários                        |
| [Casos de Teste — Establishments](docs/qa/test-cases/establishments.md) | 20 cenários                        |
| [Casos de Teste — Products](docs/qa/test-cases/products.md)             | 21 cenários                        |
| [Casos de Teste — Orders](docs/qa/test-cases/orders.md)                 | 27 cenários                        |
| [Bug Backlog](docs/qa/bug-backlog.md)                                   | Índice de todos os bugs            |

---

## 📚 Documentação da API

| Documento                                              | Descrição                                  |
| ------------------------------------------------------ | ------------------------------------------ |
| [Visão Geral](docs/api/overview.md)                    | Stack, arquitetura e limitações conhecidas |
| [Modelos de Dados](docs/api/models.md)                 | Schemas de todas as entidades              |
| [Auth](docs/api/endpoints/auth.md)                     | Signup, login e uso do token               |
| [Users](docs/api/endpoints/users.md)                   | CRUD de usuários                           |
| [Addresses](docs/api/endpoints/addresses.md)           | Endereços de usuários e estabelecimentos   |
| [Establishments](docs/api/endpoints/establishments.md) | CRUD + busca + produtos                    |
| [Products](docs/api/endpoints/products.md)             | CRUD + top produtos com cache Redis        |
| [Orders](docs/api/endpoints/orders.md)                 | Fluxo completo com máquina de estados      |

---

## 🗺️ Roadmap QA

- [x] Testes de integração — Auth
- [x] Estratégia de testes
- [x] Collection do Postman
- [x] Backlog de bugs
- [x] Casos de teste — todos os módulos (122 casos)
- [x] Bug reports documentados (11 bugs)
- [ ] Testes de integração dos demais módulos
- [ ] Testes automatizados — demais módulos
- [ ] Relatórios de cobertura
- [ ] Pipeline de CI/CD
- [ ] Testes de performance (k6)
- [ ] Testes de contrato (OpenAPI)

---

## 🏗️ Estrutura do Projeto

```dir
src/
├── api/             # Ponto de entrada da API
├── config/          # Configurações globais (database, env, logger)
├── controllers/     # Processamento de requisições e respostas
├── errors/          # Classes de erro customizadas
├── middlewares/     # Autenticação, validações e tratamento de erros
├── models/          # Schemas Mongoose
├── routes/          # Definição de rotas e endpoints
└── app.ts           # Inicialização da aplicação
```

---

## ⚙️ Pré-requisitos

### Execução local

- Node.js 18+
- npm 8+
- MongoDB
- Redis
- Git

### Execução com Docker

- Docker
- Docker Compose

> Ao utilizar Docker, não é necessário instalar Node.js, MongoDB ou Redis localmente.

---

## 🚀 Instalação

```bash
git clone https://github.com/Dienay/rangos-api.git
cd rangos-api
npm install
cp .env.example .env
```

### Variáveis de ambiente

```env
NODE_ENV=development
PORT=3000
MONGO_URL=mongodb://rangos-mongo:27017/rangos
REDIS_URL=redis://rangos-redis-server:6379
JWT_SECRET=seu_segredo_aqui
```

---

## 🐳 Docker

O projeto pode ser executado com Docker usando o script `run.sh`.

```bash
# Permissão de execução (apenas na primeira vez)
chmod +x run.sh

# Comandos disponíveis
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

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
