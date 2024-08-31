# Test - Encurtador de Url

Minha solução para o test de encurtador de Url usando o framework Nestjs com as ultimas tecnologias e as melhores praticas de desenvolvimendo

Tecnologias Usadas: Nestjs, Typescript, MySQL, Redis, JWT, Jest, Bcrypt, TypeOrm, Swagger, Docker-Compose

## Tabela de conteúdos

- [Funcionalidades](#funcionalidades)
- [Desenvolvimentos adicionais](#desenvolvimento)
- [Conceitos usados](#conceitos-usados)
- [Requirements](#requirements)
- [Performance da aplicação](#performance-da-aplicação)
- [Rotas](#rotas)
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

- Criação de forks do processo usando Cluster ao iniciar a aplicação para usar todos os cores da CPU e lidar com requisições em paralelo
- Cache de Url encurtada para redirecionamento
- Encriptação de Senha
- Docker compose com o banco de dados e imagem da aplicação
- Testes Unitarios
- Adicionando timeout nas rotas de login do usuario para impedir DDOS e Brute-Force Attack
- Helmet para melhorar a segurança ao tratar requests HTTP
- Autenticação com JWT
- Validação de dados de entrada e saída
- Tratamento de erros
- Documentação no Swagger

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

- Usuario pode criar um conta
- Usuario pode se autenticar
- Usuario pode encurtar uma url, e ela terá apenas 6 digitos
- Não usuario pode encurtar uma url, ela terá apenas 6 digitos
- Usuario pode usar a url encurtada para se redirecionar para a url destino
- Não usuario pode usar a url encurtada para se redirecionar para a url destino
- Usuario pode listar suas urls encurtadas
- Usuario pode editar suas urls encurtadas, alterando seu destino
- Usuario pode apagar uma url encurtada

## Performance da aplicação

Possíveis dados do projeto:

- 10.000 usuarios
- 1 Usuário encurta em media 5 urls por dia
- 1 url encurtada é acessada em media 100 vezes
- Então temos 50 mil requisições para encurtar url por dia: 0,5 req/s
- Em horário de pico em um intervalo de 4 horas temos: 2,3 req/s
- Temos 5M de requisições para redirecionar url por dia: 57 req/s
- Em horário de pico em um intervalo de 4 horas temos: 347 req/s

Rota de criação de url encurtada:

- Demorará em media 300ms ou 35ms se já estiver no banco
- Faz leitura no banco de dados
- Adicionará um registro no banco
  - Dado que cada registro terá 127 bytes: 2,3 GB por Ano
- Banco precisará aguentar fazer essas 2 operações 2 vezes por segundo

Rota de criação de redirecionamento:

- Demorará em media 100ms ou 20ms se estiver em cache
- Pega do cache se existe
  - Com o cache durando 1 dia teremos 50mil urls cacheadas, ocupando 6,3MB de ram
- Faz leitura no banco se não pegou do cache
- Atualizará um registro no banco
- Banco precisará aguentar 1 operações 374 vezes por segundo + 10% das requisições não cacheadas que são 37 requisições por segundo: 400 operações por segundo, quase 4 operações simultâneas

Solução realizadas para escalar verticalmente:

- Usando o cluster mode do Nodejs para criar 4 processos ou processos baseado no número de cores da CPU rodando a aplicação e usando o algoritimos Round-Robin para distribuir as requests entre os processos, para lidar com request simultaneas baseada no numero de cores da CPU.
- Adicionado cache com Redis para aliviar o banco de dados na rota de Redirect

## Rotas

### Encurtar a url

- Client: HTTP - POST
- Autenticação condicional apenas se o token for passado
- API: createShortUrl(url: string; token?: string): shortenedUrl
  - Se for Usuario
    - Verifica se já tem a memsa url encurtada no banco e a retorna
    - Se não cria um novo registro com ele
  - Se não for usuario
    - Verifica se já existe uma url encurtada no banco
    - Se não cria um novo registro e retorna
- Banco: Mysql

Problemas:
1: As urls encurtadas podem acabar se repetindo

Soluções:
1: Usando a blibioteca short-unique-id que com 6 caracteres tem uma probabilidade de 0.0000052 de colisão.

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

Problemas: Rota que mais terá requisições e que faz algumas operações pesadas no banco de dados, um SELECT com full colection e um UPDATE

Solução: Adicionar cache para as urls visitadas que dura 1 dia e fazer o update async do clickNumber

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
  - Verifica se a nova url de destino já foi registrada para esse usuario
  - Atualiza com a nova url
  - Deleta a url shortened antiga do cache
- Banco: Mysql

### Deletar Url

- Client: HTTP - DELETE
- Rota autenticada
- Api: deleteUrl(userId, urlShortenedID)
  - Faz soft delete na url
  - Deleta a url shortened do cache
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

- Clonar o repositório em sua maquina
- Criar .env baseado no .env.example
- Rodar: `docker-compose up -d --build`

## Documentação

Documentação feita no Swagger, pode ser acessada depois de rodar a aplicação nessa rota: `http://localhost:3000/api#/`

## Futuros problemas e soluções

Maiores problemas:

- Excesso de Registros no banco de dados
- Excesso de Requisições na rota redirect

Soluções com escalonamento horizontal:

- Banco de Dados: Precisaremos escalar horizontalmente criando novo shards no banco de dados, seria bom trocar o banco de dados para um NOSQL como o MongoDB que facilitaria essa transição. Um dos problemas seria a lógica para determinar qual shard seria usado, mas isso poderia ser baseado no número do shortened url gerado: os que foram gerados começando com a-d, vão para o database 1, os de d-h para o database 2, e etc.

- Cache: O ideal seria todo o Get da nossa aplicação ficar salvo no Cache com alguma estrategia, pois qualquer Select no banco será muito custoso, já que ele terá muitos registros. Então precisaremos escalar o Redis também usando mais nodes.

- Resposta da Api na rota redirect: Precisaremos ter mais instancias da nossa aplicação rodando e ter um load balancer como um NGNIX com um algoritimo baseado em tempo de resposta, para jogar as novas requests para instancias que estão redirecionando mais rapidamente. Isso precisa escalar junto com o banco de dados que é nosso maior ponto de gargalo, precisamos garantir uma relação de 1:2 de instancias entre nossa aplicação com o banco de dados para não lhe causar overhead.

- Fila para atualizar o ClickNumber: Não é necessario ter uma atualização rapida do clickNumber toda vez que tem um redirect, podemos jogar os updates em um redis-channel, e outro serviço consome essa fila e vai rodando os updates aos poucos no banco.
