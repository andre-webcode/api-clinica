# Sistema de Agendamento de Clínica — Backend

API REST desenvolvida para gerenciar agendamentos de uma clínica médica, permitindo o cadastro de pacientes e médicos, configuração de disponibilidades e gerenciamento de consultas.

O projeto utiliza Node.js, Express, TypeScript e PostgreSQL, com Prisma ORM para comunicação com o banco de dados.

## Tecnologias utilizadas

- **Node.js** — ambiente de execução.
- **Express** — construção da API REST.
- **TypeScript** — tipagem estática.
- **PostgreSQL** — banco de dados relacional.
- **Prisma ORM** — acesso e gerenciamento dos dados.
- **Zod** — validação dos dados recebidos pela API.
- **Vitest** — testes automatizados.
- **Supertest** — testes dos endpoints HTTP.
- **Helmet** — configuração de cabeçalhos HTTP de segurança.
- **CORS** — controle de acesso entre origens.

## Funcionalidades

### Pacientes
- Cadastro de pacientes.
- Listagem de pacientes.
- Validação dos dados recebidos.

### Médicos
- Cadastro de médicos.
- Listagem de médicos.
- Definição da especialidade.
- Configuração da duração padrão das consultas.

### Disponibilidade dos médicos
- Cadastro de horários de atendimento.
- Listagem das disponibilidades.
- Validação dos intervalos de horários.

### Agendamentos
- Criação de agendamentos.
- Listagem de agendamentos.
- Verificação da disponibilidade do médico.
- Cálculo automático do horário de término da consulta.
- Prevenção de conflitos de horários.
- Cancelamento de agendamentos.

## Regras de negócio

- Um agendamento deve estar associado a um paciente e a um médico existentes.
- O horário solicitado deve respeitar a disponibilidade cadastrada para o médico.
- A duração da consulta é definida pela configuração do médico.
- Não são permitidos conflitos entre agendamentos ativos do mesmo médico.
- Agendamentos cancelados deixam de bloquear aquele horário.

## Estrutura do projeto

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── generated/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── prisma/
├── tests/
│   ├── controllers/
│   └── services/
├── .env
├── .gitignore
├── package.json
├── prisma7.config.ts
└── tsconfig.json
```

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/ping` | Verifica se a API está funcionando |
| GET | `/patients` | Lista pacientes |
| POST | `/patients` | Cadastra paciente |
| GET | `/doctors` | Lista médicos |
| POST | `/doctors` | Cadastra médico |
| GET | `/doctors/:doctorId/availabilities` | Lista disponibilidades |
| POST | `/doctors/:doctorId/availabilities` | Cadastra disponibilidade |
| GET | `/appointments` | Lista agendamentos |
| POST | `/appointments` | Cria agendamento |
| PATCH | `/appointments/:id/cancel` | Cancela agendamento |

## Configuração e execução

### Pré-requisitos

- Node.js 20.9 ou superior.
- npm.
- PostgreSQL.

### Instalação

Clone o repositório e entre na pasta do backend:

```bash
cd backend
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do backend:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/api-clinica"
```

Substitua os valores pelas credenciais do seu PostgreSQL.

### Banco de dados

Gere o Prisma Client:

```bash
npx prisma generate
```

Execute as migrações:

```bash
npx prisma migrate dev
```

### Executar em desenvolvimento

```bash
npm run dev
```

### Gerar build

```bash
npm run build
```

### Executar testes

```bash
npm test
```

## Testes automatizados

O projeto possui testes para validar diferentes partes da aplicação:

- Regras de negócio dos services.
- Validação dos dados com schemas.
- Comportamento dos controllers.
- Respostas HTTP e tratamento de erros.

Os testes utilizam Vitest e Supertest, com mocks para isolar os controllers dos services.

## Integração com o frontend

Este backend foi desenvolvido para ser consumido por uma aplicação frontend construída com Next.js, React e TypeScript.

A API será responsável pelo processamento das regras de negócio e pela comunicação com o banco de dados.

---

**Status:** Backend desenvolvido, com testes automatizados implementados. Integração com o frontend em desenvolvimento.