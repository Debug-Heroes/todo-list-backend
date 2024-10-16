
# To Do List

To Do List (lista de tarefas) é uma ferramenta que ajuda os seus usuários a organizar e gerenciar suas tarefas diárias.


## Documentação da API

#### Cadastro de Usuários

```http
  POST /signup
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string` | **Obrigatório**. Nome de Usuário |
| `email` | `string` | **Obrigatório**. Email do Usuário |
| `password` | `string` | **Obrigatório**. Senha |
| `confirmPassword` | `string` | **Obrigatório**. Confirmação de Senha |

#### Autenticação de Usuários

```http
  POST /login
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `email`      | `string` | **Obrigatório**. Email do Usuário |
| `password`      | `string` | **Obrigatório**. Senha do Usuário |



## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`SERVER_PORT`

`PG_DATABASE`

`PG_HOST`

`PG_PASSWORD`

`PG_PORT`

`PG_USER`
## Instalação

Antes de tudo, confirme que estão instalados na sua máquina:
```bash
  npm
  node
  docker
```

Criação do banco de dados
```bash
docker network create --driver bridge todolist-network
docker run --name my-postgres --restart=always --network=todolist-network -p 5433:5432 -e POSTGRES_PASSWORD=postgres -d postgres
docker run --name my-pgadmin --restart=always --network=todolist-network -p 15432:80 -e PGADMIN_DEFAULT_EMAIL=any_mail@mail.com -e PGADMIN_DEFAULT_PASSWORD=postgres -d dpage/pgadmin4

```

Instale as dependências com npm e inicialize a aplicação

```bash
  cd todo-list-backend
  npm install
  npm run up
```

A aplicação estará disponível na rota 3000.
