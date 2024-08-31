# Test - Encurtador de Url

Minha solução para o test de encurtador de Url usando o framework Nestjs com as ultimas tecnologias e as melhores praticas de desenvolvimendo

Tecnologias Usadas: Nesjs, MySQL, Redis, JWT, Jest, Bcrypt, TypeOrm, Swagger, Docker-Compose

## Tabela de conteúdos

- [Funcionalidades](#funcionalidades)
- [Desenvolvimentos adicionais](#desenvolvimento)
- [Conceitos usados](#conceitos-usados)
- [Requirements](#requirements)
- [Features](#features)
- [Banco de dados](#tabelas-do-banco)
- [Como rodar](#como-rodar)
- [Documentação](#documentação)
- [Futuros Problemas e Soluções](#futuros-problemas-e-soluções)

## Funcionalidades

- Cadastro de Usuario
- Login de Usuario
- Criação de link encurtado para não usuarios
- Criação de link encurtado para usuarios autenticados
- Listagem de links escurtados para usuario autenticado
- Edicação de link encurtado para usuario autenticado
- Deleção de link encurtado para usuario autenticado
- Redirecionamento para link origem atráves de link encurtado e contabilização de redirecionamento por link

## Desenvolvimentos adicionais:

- Cache de Url encurtada para redirecionamento
- Encriptação de Senha
- Autenticação com JWT
- Testes Unitarios
- Documentação no Swagger
- Validação de dados de entrada e saída
- Tratamento de erros
- Docker compose com o banco de dados e imagem da aplicação
- Helmet para melhorar a segurançao ao tratar requests HTTP
- Deploy do código na heroku

## Conceitos usados

- DDD(Domain Drive Design)
- TDD (Test Driven Development)
- Principios do SOLID
- Automatic Dependencie Injection
- Decoretors
- InMemory Database
- Mappers
- View/Model
- Adapter
- DTO Validation
- Chaching
- Asychrnous Programming

## Requirements

User:

- Criar um usuario
- Logar com usuario

Url Shortneer:

- Criar uma url encurtada com 6 digitos, atrela-lo ao usuario se for autenticado
- Redirecionar para a url destinataria e salvar os cliques
- Listar Urls por Usuario
- Editar Url de destino cadastrada
- Apagar Url cadastrada

## Features

### Encurtar a url

- Client: HTTP - POST
- Validação condicional apenas se passar o userId
- API: shortUrl(url: string; userId?: string): shortenedUrl
  - Se for Usuario
    - Verifica se já tem a memsa url encurtada no banco e a retorna
    - Se não cria um novo registro com ele
  - Se não for usuario
    - Verifica se já existe uma url encurtada no banco
    - Se não cria um novo registro e retorna
- Banco: Mysql

Problemas:
1: As urls encurtadas podem acabar se repetindo
2: Pode gastar muito espaço as urls encurtadas, se 1 usuario criar 10 urls por dia, com 100.000 usuario em 1 ano teremos 3650M registros no banco, em 3 anos chegarem a 1B.

Soluções:
1: Usar algoritimo MD5 que hasheia a url destino passada e pega os primeiros 6 caracters. Tem possibilidade de duplicação.
2: Expirar as urls e deleta-las no banco depois de 1 ano.

### Redirecionar

- Cliente: HTTP - POST redirect/value
- Api: redirect(redirectValue)
  - Verificar se a url destino esta em cache
  - Se sim: redireciona usuario
  - Se não:
    - Encontra no banco a url destino pela url encurtada
    - Retorna um erro se não encontrar
    - Redireciona o usuario
  - Adiciona um click na url encurtada
- Banco: Mysql
- Cache: Redis

Problemas:
1: Rota que mais terá requisições e que faz algumas operações pesadas no banco de dados, um SELECT e um UPDATE
2: Se teremos em media 10m usuarios criando 10 urls por dia, temos 100m urls criadas, que provavelmente serão acessadas por mais 20 pessoas em media, o que dá 2M de requisições por dia e 23 requisições por segundo, podendo chegar a 138 req/s se considerarmos que as requisições se concentrarão em um periodo de 4 horas.

Soluções:
1: Adicionar index por redirectUrl(Downside: Vai demorar mais tempo para registrar)
2: Adicionar cache para as urls mais visitadas durante 6 horas e fazer o update async do clickNumber

### Listar Urls por Usuario

- Client: HTTP - GET
- Rota autenticada
- Api: getUrls(userId): Urls
  - Pega todos as urls daquele usuario
- Banco: Mysql

### Editar Url de destino

- Client: HTTP - PATCH
- Rota autenticada
- Api: updateUrl(userId, urlShortenedID, newDesintyUrl)
  - Verifica se a url existe
  - Atualiza com a nova url
- Banco: Mysql

### Deletar Url

- Client: HTTP - DELETE
- Rota autenticada
- Api: deleteUrl(userId, urlShortenedID)
  - Faz soft delete na url
- Banco: Mysql

## Tabelas do banco

Usuario:

- id (uuid)
- name (VarChar)
- email (VarChar)
- password_hash (VarChar)
- created_at (Datetime)
- deleted_at (Datetime)
- updated_at (Datetime)

Url:

- id (uuid)
- shortened_url (VarChar) (Unique)
- destiny_url (VarChar)
- clicked_times (Int)
- user_id (uuid)
- created_at (Datetime)
- deleted_at (Datetime)
- updated_at (Datetime)

## Como rodar

### Localmente

Rodar: ``docker-compose up -d --build```

## Documentação

Documentação feita no Swagger, pode ser acessada depois de rodar a aplicação nessa rota: `http://localhost:3000/api#/`

## Futuros problemas e soluções

- Banco de Dados: Precisaremos escalar horizontalmente criando novo shards no banco de dados, seria bom trocar o banco de dados para um NOSQL como o MongoDB que facilitaria essa transição. Um dos problemas seria a lógica para organizar o sharding.

- Resposta de Api na rota redirect: Precisaremos ter um load balancer com um algoritimo baseado em tempo de resposta, para jogar para as instancias que estão redirecionando mais rapidamente.
