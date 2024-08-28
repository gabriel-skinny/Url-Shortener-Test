
# Test - Encurtador de Url

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



## Encurtar a url
- Client: HTTP - POST
- API: shortUrl(url: string; userId?: string): shortenedUrl
    - Se for Usuario
        - Verifica se já tem a memsa url encurtada no banco e a retorna
        - Se não cria um novo registro com ele
    - Se não for usuario
        - Verifica se já existe uma url encurtada no banco
        - Se não cria um novo registro e retorna
     
- Banco: Mysql

## Redirecionar
- Cliente: HTTP - POST redirect/value
- Api: redirect(redirectValue)
    - Encontra no banco da url de destino
    - Redireciona o usuario
- Banco: Mysql

## Listar Urls por Usuario
- Client: HTTP - GET
- Rota autenticada
- Api: getUrls(userId): Urls
- Banco: MongoDb

## Editar Url de destino 
- Client: HTTP - PATCH
- Rota autenticada
- Api: getUrls(userId, urlShortenedID, newDesintyUrl)
- Banco: MongoDb

## Deletar Url  
- Client: HTTP - DELETE
- Rota autenticada
- Api: getUrls(userId, urlShortenedID)
- Banco: MongoDb

## Tabelas

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
- shortened_url (VarChar)
- destiny_url (VarChar)
- clicked_times (Int)
- user_id (uuid)
- created_at (Datetime)
- deleted_at (Datetime)
- updated_at (Datetime)

URL_USER:
- id (uuid)
- url_id: (uuid)
- user_id (uuid)