# Rangos API

O Rangos é uma plataforma de delivery online que conecta clientes a estabelecimentos locais, oferecendo uma experiência de compra fácil e conveniente. Com o Rangos, os clientes podem navegar pelos menus de seus restaurantes favoritos, fazer pedidos personalizados e rastrear o progresso de entrega em tempo real. Os estabelecimentos, por sua vez, podem gerenciar seus pedidos, atualizar seus menus e monitorar o desempenho de entrega através de um painel de controle intuitivo.

Nossa plataforma é projetada para atender às necessidades de clientes e estabelecimentos de todos os tamanhos e segmentos, desde pequenos food trucks até grandes redes de restaurantes. Com o Rangos, os clientes podem economizar tempo e esforço ao fazer pedidos online, enquanto os estabelecimentos podem ampliar seu alcance e aumentar suas vendas.

Além disso, nossa plataforma é construída com as melhores práticas de segurança e privacidade, garantindo que os dados dos nossos usuários estejam sempre protegidos. Com o Rangos, você pode ter certeza de que sua experiência de delivery será rápida, confiável e segura.

## Sumário

- [Descrição](#descrição)
- [Instalação](#instalação)
- [Uso](#uso)
- [Endpoints da API](#endpoints-da-api)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Descrição

O Rangos é uma plataforma de delivery back-end desenvolvida com Node.js e Express.js, que fornece uma API RESTful para gerenciamento de estabelecimentos, usuários e pedidos. Com ela, é possível criar e gerenciar estabelecimentos, com suas características próprias, bem como permitir que os usuários criem contas e gerenciem suas informações pessoais.

A aplicação permite que os estabelecimentos adicionem, editem, visualizem e excluam produtos, além de permitir que os usuários criem pedidos a partir desses produtos. Os pedidos têm características diferentes para cada tipo de usuário, com o cliente podendo criar e editar pedidos, desde que ainda não tenham sido enviados para o estabelecimento, e visualizar seu histórico de pedidos. Já o estabelecimento pode visualizar o pedido após o cliente enviá-lo, e mudar o estado do pedido conforme o ciclo de preparação e encaminhamento do pedido.

O projeto utiliza o MongoDB como banco de dados, com o Mongoose como ODM (Object Document Mapping) para facilitar o acesso e manipulação dos dados. Além disso, a aplicação conta com autenticação e autorização por meio de JSON Web Token (JWT), garantindo a segurança e integridade dos dados.

A API foi desenvolvida seguindo os princípios REST, com recursos bem definidos e uma estrutura de URLs clara e intuitiva. Ela suporta os verbos HTTP GET, POST, PUT e DELETE, permitindo a interação completa com os recursos da aplicação.

Para garantir a qualidade e a consistência do código, o projeto utiliza o ESLint e o Prettier para padronização e formatação do código.

O objetivo da API Rangos é fornecer uma solução back-end robusta e escalável para plataformas de delivery, permitindo a integração com outros sistemas e aplicativos por meio de uma API RESTful bem definida e segura. Com ele, é possível gerenciar estabelecimentos, usuários e pedidos de forma eficiente e organizada, melhorando a produtividade e a experiência do usuário.

## Instalação

### Pré-requisitos

Liste as ferramentas e versões necessárias para executar o projeto.

- [Node.js](https://nodejs.org/en/) v16+
- [npm](https://www.npmjs.com/) v8+
- [Mongodb](https://www.mongodb.com/docs/manual/) Podendo usar o [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) ou uma instância local.

### Passos para instalação

1. Clone o repositório:

   ```sh
   git clone https://github.com/Dienay/rangos-backend.git
   cd rangos-backend
   ```

2. Instale as dependências:

   ```sh
   npm install
   ```

3. Configure as variáveis de ambiente:

   - Crie um arquivo `.env` na raiz do projeto e defina as variáveis de ambiente necessárias.

4. Inicie o servidor:
   ```sh
   npm start
   ```

## Uso

### Executando localmente

```sh
npm run populate  # Insere dados de exemplo no banco de dados
```

```sh
npm run start:dev  # Inicia o servidor em modo de desenvolvimento
```

### Rotas e funcionalidades principais

## Endpoints da API

- #### [Usuários](./Users.md)
- #### [Estabelecimentos](./Establishments.md)
- #### [Produtos](./Products.md)
- #### [Pedidos](./Orders.md)

## Contribuição

### Como Contribuir

1. Faça um fork do projeto.
2. Crie um branch para sua feature/bugfix (`git checkout -b feature/nova-feature`).
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`).
4. Faça push para o branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

### Padrões de Código

- Siga as convenções de codificação do projeto (Airbnb style guide, ESLint, Prettier, etc).
- Certifique-se de que todas as alterações passam nos testes existentes e adicione novos testes para cobrir suas alterações.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

Você pode ajustar esse esboço de acordo com as necessidades específicas do seu projeto.
