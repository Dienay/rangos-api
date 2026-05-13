# 🚀 Rangos API

> API de plataforma de delivery desenvolvida com foco em **qualidade de software (QA)**, cobrindo testes de integração, documentação de bugs e validação de fluxos críticos.

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

## 💡 Por que este projeto é relevante para QA?

Esta API simula um ambiente de produção com **múltiplas entidades, autenticação JWT, uploads, cache, logs e banco de dados real**. Isso permite:

- Criar cenários de teste complexos e completos
- Validar fluxos críticos ponta a ponta
- Documentar bugs reais encontrados durante o desenvolvimento
- Aplicar testes automatizados de integração
- Demonstrar pensamento analítico e visão de qualidade

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

| Prática                                     | Status          |
| ------------------------------------------- | --------------- |
| Testes de integração (Jest + Supertest)     | ✅ Implementado |
| Banco isolado por teste (MongoMemoryServer) | ✅ Implementado |
| Factories de dados de teste                 | ✅ Implementado |
| Bug reports documentados                    | ✅ Implementado |
| Casos de teste em markdown                  | ✅ Implementado |
| Estratégia de testes definida               | ✅ Implementado |
| Collection Postman                          | ✅ Implementado |
| CI/CD (GitHub Actions)                      | 🔜 Em breve     |

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

| Documento                                                                | Descrição                             |
| ------------------------------------------------------------------------ | ------------------------------------- |
| [Estratégia de Testes](docs/qa/test-strategy.md)                         | Abordagem, tipos de teste e critérios |
| [Casos de Teste — Auth](docs/qa/test-cases/auth.md)                      | Cenários de autenticação              |
| [Bug Backlog](docs/qa/bug-backlog.md)                                    | Lista de bugs encontrados             |
| [BUG-001 — Validação de Email](docs/qa/bugs/BUG-001-email-validation.md) | Bug report detalhado                  |

---

## 📚 Documentação da API

| Documento                              | Descrição                         |
| -------------------------------------- | --------------------------------- |
| [API Reference](docs/api/reference.md) | Referência completa dos endpoints |
| [Auth Guide](docs/api/auth.md)         | Guia de autenticação JWT          |
| [Models](docs/api/models.md)           | Schemas e modelos de dados        |
| [Errors](docs/api/errors.md)           | Códigos de erro e descrições      |

---

## ⚠️ Tratamento de Erros

| Código | Descrição            |
| ------ | -------------------- |
| 400    | Requisição inválida  |
| 401    | Não autorizado       |
| 404    | Não encontrado       |
| 413    | Payload muito grande |
| 500    | Erro interno         |

---

## 🗺️ Roadmap QA

- [x] Testes de autenticação (login e cadastro)
- [x] Estratégia de testes
- [x] Collection do Postman
- [x] Backlog de bugs
- [ ] Testes de integração dos demais módulos
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
