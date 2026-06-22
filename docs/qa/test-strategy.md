# Test Strategy — Rangos API

---

## 1. Objetivo

Garantir a qualidade da API Rangos validando:

- Funcionalidade dos endpoints
- Regras de negócio
- Tratamento de erros e respostas HTTP
- Integridade de dados
- Fluxos críticos de autenticação e pedidos
- Comportamento com entradas inválidas

---

## 2. Escopo

### Incluído

| Módulo                       | Status          |
| ---------------------------- | --------------- |
| Autenticação (signup, login) | ✅ Implementado |
| Usuários                     | ✅ Implementado |
| Estabelecimentos             | ✅ Implementado |
| Endereços                    | ✅ Implementado |
| Produtos                     | ✅ Implementado |
| Pedidos                      | ✅ Implementado |

### Fora do escopo (por enquanto)

- Testes unitários isolados (services, utils)
- Testes E2E completos
- Testes de carga e performance
- Segurança avançada (pentest)

---

## 3. Tipos de Teste

### Testes de Integração (foco atual)

Validam o fluxo HTTP completo: request → controller → model → response, usando banco isolado em memória. É o tipo principal aplicado no projeto.

### Testes Negativos

Validam comportamento com entradas inválidas. Exemplos:

- Email com formato inválido
- Senha incorreta
- Campos obrigatórios ausentes
- Tipos de dado errados

### Edge Cases

Validam cenários extremos. Exemplos:

- Strings muito longas
- Caracteres especiais
- Campos duplicados
- Requisições sem body

### Regressão

Garantem que funcionalidades existentes continuam funcionando após mudanças no código.

---

## 4. Ferramentas

| Ferramenta            | Finalidade                                |
| --------------------- | ----------------------------------------- |
| Jest                  | Framework de execução de testes           |
| Supertest             | Requisições HTTP nos testes de integração |
| mongodb-memory-server | Banco MongoDB isolado em memória          |
| Postman               | Validação manual de endpoints             |
| TypeScript            | Tipagem e segurança nos testes            |

---

## 5. Ambiente de Teste

- Banco de dados MongoDB em memória (sem dependência de instância externa)
- Dados resetados entre cada teste via `afterEach` / `afterAll`
- Aplicação inicializada uma vez por arquivo de teste via `helpers/app.ts`
- Configurações globais centralizadas em `tests/setup.ts`
- Dados de teste gerados via factories (`tests/factories/`)

---

## 6. Estratégia de Execução

### Fluxo padrão por teste

1. **Arrange** — preparar dados com factory
2. **Act** — executar requisição HTTP com Supertest
3. **Assert** — validar status HTTP, body e efeitos colaterais

### Comandos

```bash
# Rodar todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Com relatório de cobertura
npm run test:cov
```

---

## 7. Estrutura de Arquivos

```dir
tests/
├── factories/
│   ├── UserFactory.ts              # Geração de dados de usuário
│   ├── AddressFactory.ts           # 🔜 Geração de dados de endereço
│   ├── EstablishmentFactory.ts     # 🔜 Geração de dados de estabelecimento
│   ├── ProductFactory.ts           # 🔜 Geração de dados de produto
│   └── OrderFactory.ts             # 🔜 Geração de dados de pedido
│
├── helpers/
│   └── app.ts                      # Inicialização da aplicação para testes
│
├── integration/
│   ├── auth/
│   │   ├── login.test.ts           # ✅ 6 casos
│   │   └── signup.test.ts          # ✅ 13 casos
│   ├── users/
│   │   └── users.test.ts           # 🔜 15 casos
│   ├── addresses/
│   │   └── addresses.test.ts       # 🔜 17 casos
│   ├── establishments/
│   │   └── establishments.test.ts  # 🔜 20 casos
│   ├── products/
│   │   └── products.test.ts        # 🔜 21 casos
│   └── orders/
│       └── orders.test.ts          # 🔜 27 casos
│
└── setup.ts                        # Configuração global (conexão, teardown)
```

---

Com base em tudo que documentamos, aqui está a Seção 8 completa:

---

## 8. Cobertura Atual e Planejada

### Auth — ✅ Implementado

| Cenário                       | Tipo                 | Status     |
| ----------------------------- | -------------------- | ---------- |
| Signup com dados válidos      | Funcional            | ✅         |
| Signup sem campos opcionais   | Funcional            | ✅         |
| Signup com typeUser padrão    | Regra de negócio     | ✅         |
| Token retornado no cadastro   | Regra de negócio     | ✅         |
| Signup com email duplicado    | Duplicidade          | ✅         |
| Signup com telefone duplicado | Duplicidade          | ✅         |
| Signup sem name               | Campo obrigatório    | ❌ BUG-005 |
| Signup sem email              | Campo obrigatório    | ❌ BUG-005 |
| Signup sem password           | Campo obrigatório    | ❌ BUG-005 |
| Signup com body vazio         | Campo obrigatório    | ❌ BUG-005 |
| Signup com email inválido     | Validação de formato | ❌ BUG-001 |
| Signup com senha curta        | Validação de formato | ❌ BUG-002 |
| Signup com typeUser inválido  | Validação de enum    | ❌ BUG-005 |
| Signup com name muito longo   | Edge case            | ❌ BUG-003 |
| Signup com name em branco     | Edge case            | ❌ BUG-004 |
| Login com credenciais válidas | Funcional            | ✅         |
| Login com senha incorreta     | Credencial inválida  | ✅         |
| Login com email inexistente   | Credencial inválida  | ✅         |
| Login sem email               | Campo obrigatório    | ✅         |
| Login sem password            | Campo obrigatório    | ✅         |
| Login com body vazio          | Campo obrigatório    | ✅         |
| Login com email inválido      | Validação de formato | ✅         |

**22 casos · 13 passaram · 9 falharam (5 bugs documentados)**

---

### Users — 🔜 Planejado

| Cenário                          | Tipo                | Status |
| -------------------------------- | ------------------- | ------ |
| Buscar usuário existente         | Funcional           | 🔜     |
| Buscar sem autenticação          | Autenticação        | 🔜     |
| Buscar ID inexistente            | Não encontrado      | 🔜     |
| Buscar ID formato inválido       | Formato inválido    | 🔜     |
| Password não retornado no GET    | Segurança           | 🔜     |
| Atualizar dados do usuário       | Funcional           | 🔜     |
| Atualizar apenas um campo        | Atualização parcial | 🔜     |
| Atualizar sem autenticação       | Autenticação        | 🔜     |
| Atualizar ID inexistente         | Não encontrado      | 🔜     |
| Password não atualizável via PUT | Segurança           | 🔜     |
| typeUser não atualizável via PUT | Segurança           | 🔜     |
| Deletar usuário existente        | Funcional           | 🔜     |
| Deletar sem autenticação         | Autenticação        | 🔜     |
| Deletar ID inexistente           | Não encontrado      | 🔜     |
| Usuário deletado não faz login   | Integridade         | 🔜     |

**15 casos · 0 executados · 15 pendentes**

---

### Addresses — 🔜 Planejado

| Cenário                              | Tipo                | Status     |
| ------------------------------------ | ------------------- | ---------- |
| Listar endereços de usuário          | Funcional           | 🔜         |
| Listar sem endereços cadastrados     | Lista vazia         | 🔜         |
| Listar sem autenticação              | Autenticação        | 🔜         |
| Listar entityId inexistente          | Não encontrado      | 🔜         |
| Adicionar endereço a usuário         | Funcional           | 🔜         |
| Adicionar endereço a estabelecimento | Funcional           | 🔜         |
| Adicionar endereço duplicado         | Duplicidade         | 🔜         |
| Adicionar sem campos obrigatórios    | Campos obrigatórios | 🔜         |
| Adicionar múltiplos endereços        | Acumulação          | 🔜         |
| Adicionar sem autenticação           | Autenticação        | 🔜         |
| Atualizar endereço existente         | Funcional           | 🔜         |
| Atualizar sem autenticação           | Autenticação        | 🔜         |
| Atualizar addressId inexistente      | Não encontrado      | 🔜         |
| Deletar endereço existente           | Funcional           | 🔜         |
| Deletar sem autenticação             | Segurança           | ❌ BUG-007 |
| Deletar addressId inexistente        | Não encontrado      | 🔜         |
| Integridade pós-deleção              | Integridade         | 🔜         |

**17 casos · 1 com resultado conhecido (❌ BUG-007) · 16 pendentes**

---

### Establishments — 🔜 Planejado

| Cenário                           | Tipo                    | Status |
| --------------------------------- | ----------------------- | ------ |
| Listar todos os estabelecimentos  | Funcional               | 🔜     |
| Listar com banco vazio            | Lista vazia             | 🔜     |
| Buscar por nome exato             | Funcional               | 🔜     |
| Buscar por nome parcial           | Busca parcial           | 🔜     |
| Buscar nome inexistente           | Sem resultado           | 🔜     |
| Buscar por ID                     | Funcional               | 🔜     |
| Buscar ID inexistente             | Não encontrado          | 🔜     |
| Buscar ID formato inválido        | Formato inválido        | 🔜     |
| Buscar com produtos               | Funcional               | 🔜     |
| Buscar sem produtos               | Lista vazia             | 🔜     |
| Criar com campos obrigatórios     | Funcional               | 🔜     |
| Criar com nome duplicado          | Duplicidade             | 🔜     |
| Criar com categoria inválida      | Validação enum          | 🔜     |
| Criar com openingHours inválido   | Formato inválido        | 🔜     |
| Criar com horário fora do formato | Formato inválido        | 🔜     |
| Atualizar estabelecimento         | Funcional               | 🔜     |
| Atualizar ID inexistente          | Não encontrado          | 🔜     |
| Deletar estabelecimento           | Funcional               | 🔜     |
| Deletar ID inexistente            | Não encontrado          | 🔜     |
| Produtos não removidos em cascata | Integridade referencial | 🔜     |

**20 casos · 0 executados · 20 pendentes**

---

### Products — 🔜 Planejado

| Cenário                            | Tipo                    | Status           |
| ---------------------------------- | ----------------------- | ---------------- |
| Listar todos os produtos           | Funcional               | 🔜               |
| Listar com banco vazio             | Lista vazia             | 🔜               |
| Top produtos com pedidos           | Funcional               | 🔜               |
| Top produtos sem pedidos           | Lista vazia             | 🔜               |
| Top produtos — limite de 10        | Regra de negócio        | 🔜               |
| Buscar por nome exato              | Funcional               | 🔜               |
| Buscar por nome parcial            | Busca parcial           | 🔜               |
| Buscar nome inexistente            | Sem resultado           | 🔜               |
| Buscar por ID                      | Funcional               | 🔜               |
| Buscar ID inexistente              | Não encontrado          | 🔜               |
| Buscar ID formato inválido         | Formato inválido        | 🔜               |
| Criar com campos obrigatórios      | Funcional               | 🔜               |
| Criar com todos os campos          | Funcional               | 🔜               |
| Criar sem campos obrigatórios      | Campos obrigatórios     | ❌ BUG-005       |
| Criar com establishmentId inválido | Referência inválida     | ❌ Sem validação |
| Atualizar produto                  | Funcional               | 🔜               |
| PUT retorna dados do body          | Comportamento resposta  | 🔜               |
| Atualizar ID inexistente           | Não encontrado          | 🔜               |
| Deletar produto                    | Funcional               | 🔜               |
| Deletar ID inexistente             | Não encontrado          | 🔜               |
| Snapshot preservado após deleção   | Integridade referencial | 🔜               |

**21 casos · 2 com resultado conhecido (❌) · 19 pendentes**

---

### Orders — 🔜 Planejado

| Cenário                                    | Tipo                | Status     |
| ------------------------------------------ | ------------------- | ---------- |
| Listar todos os pedidos                    | Funcional           | 🔜         |
| Listar com banco vazio                     | Lista vazia         | 🔜         |
| Listar pedidos de usuário                  | Funcional           | 🔜         |
| Listar pedidos de estabelecimento          | Funcional           | 🔜         |
| Listar entidade sem pedidos                | Lista vazia         | 🔜         |
| Listar entityId inexistente                | Não encontrado      | 🔜         |
| Buscar pedido por ID                       | Funcional           | 🔜         |
| Buscar orderId inexistente                 | Não encontrado      | 🔜         |
| Acesso cruzado entre entidades             | Segurança           | ❌ BUG-011 |
| Criar pedido como usuário                  | Funcional           | 🔜         |
| Verificar cálculo de subtotal e totalPrice | Regra de negócio    | 🔜         |
| Criar pedido como estabelecimento          | Regra de negócio    | 🔜         |
| Criar com orderNumber duplicado            | Duplicidade         | 🔜         |
| Criar sem campos obrigatórios              | Campos obrigatórios | 🔜         |
| Ordered → Paid                             | Máquina de estados  | 🔜         |
| Paid → Preparing                           | Máquina de estados  | 🔜         |
| Preparing → Sent                           | Máquina de estados  | 🔜         |
| Sent → Delivered                           | Máquina de estados  | 🔜         |
| Cancelar em Ordered                        | Máquina de estados  | 🔜         |
| Ordered → Delivered (inválida)             | Máquina de estados  | 🔜         |
| Delivered → qualquer (terminal)            | Status terminal     | 🔜         |
| Canceled → qualquer (terminal)             | Status terminal     | 🔜         |
| Deletar pedido Ordered                     | Funcional           | 🔜         |
| Deletar pedido Paid                        | Funcional           | 🔜         |
| Não deletar pedido Preparing               | Regra de negócio    | 🔜         |
| Estabelecimento não deleta pedido          | Regra de negócio    | 🔜         |
| Deletar orderId inexistente                | Não encontrado      | 🔜         |

**27 casos · 1 com resultado conhecido (❌ BUG-011) · 26 pendentes**

---

### Totais

| Módulo         | Total   | ✅ Passou | ❌ Falhou | 🔜 Pendente |
| -------------- | ------- | --------- | --------- | ----------- |
| Auth           | 22      | 13        | 9         | 0           |
| Users          | 15      | 0         | 0         | 15          |
| Addresses      | 17      | 0         | 1         | 16          |
| Establishments | 20      | 0         | 0         | 20          |
| Products       | 21      | 0         | 2         | 19          |
| Orders         | 27      | 0         | 1         | 26          |
| **Total**      | **122** | **13**    | **13**    | **96**      |

---

## 9. Gestão de Bugs

Bugs encontrados durante os testes são documentados em `docs/qa/bugs/` seguindo o padrão:

- Identificador único (ex: BUG-001)
- Descrição e passos para reproduzir
- Resultado esperado vs resultado atual
- Severidade e prioridade
- Status (aberto, corrigido, etc.)

Backlog centralizado em `docs/qa/bug-backlog.md`.

---

## 10. Riscos Identificados

| Risco                                      | Impacto | Mitigação                                                                                                        |
| ------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------- |
| Falta de validação de entrada              | Alto    | Documentar e cobrir com testes negativos                                                                         |
| Dependência do Redis em testes             | Médio   | Redis é opcional — fallback para MongoDB já implementado                                                         |
| Upload de arquivos sem validação de acesso | Médio   | Cobrir com testes de tipo, tamanho e autenticação                                                                |
| Dados inconsistentes entre testes          | Alto    | Reset de banco entre cada teste via `afterEach`                                                                  |
| JWT sem expiração                          | Alto    | Documentado em BUG-006 — adicionar `expiresIn` no `jwt.sign`                                                     |
| Ausência de autenticação em 3 módulos      | Crítico | Documentado em BUG-008, BUG-010, BUG-011 — adicionar `checkToken` nas rotas de escrita                           |
| DELETE /address sem autenticação           | Alto    | Documentado em BUG-007 — adicionar `checkToken` na rota                                                          |
| `parseJsonFields` não interrompe execução  | Médio   | Documentado em BUG-009 — substituir `forEach` por `for...of`                                                     |
| Campos obrigatórios retornam 500           | Alto    | Documentado em BUG-005 — definir status 422 em `ValidateError`                                                   |
| `orderNumber` gerado pelo cliente          | Médio   | Sem validação de formato — cliente pode enviar qualquer string única                                             |
| Produto criado com `establishmentId` órfão | Médio   | Controller não valida existência do estabelecimento referenciado                                                 |
| Ausência de factories para 4 módulos       | Médio   | Criar `AddressFactory`, `EstablishmentFactory`, `ProductFactory` e `OrderFactory` antes de implementar os testes |

---

## 11. Critérios de Qualidade

Uma funcionalidade é considerada válida quando:

- Retorna o status HTTP correto para cada cenário
- Respeita as regras de negócio definidas
- Rejeita entradas inválidas com mensagem de erro clara
- Possui cobertura dos cenários funcionais e negativos principais

---

## 12. Evolução Futura

- Testes unitários de services e validadores
- Pipeline CI/CD com execução automática em cada push
- Relatório de cobertura com badge no README
- Testes E2E (Cypress ou Playwright)
- Testes de carga (k6)
