# Oracle DB Healthcare API

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/powered-by-water.svg)](https://forthebadge.com)

> A RESTful API built with Node.js and Express to provide secure access to healthcare data stored in Oracle Database.

[🇧🇷 Versão em Português](#versão-em-português) | [📚 Full Documentation](#documentation)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This application serves as a data access layer between client applications and an Oracle Database containing healthcare management information. It provides RESTful endpoints to retrieve user (healthcare staff) and patient data in a structured and secure manner.

### Key Capabilities

- **User Management**: Retrieve healthcare staff information with filtering options
- **Patient Management**: Access interned patient data with bed assignment information
- **Database Abstraction**: Clean API layer over complex Oracle database queries
- **CORS Enabled**: Ready for frontend integration
- **Environment-based Configuration**: Easy deployment across different environments

---

## Features

### User Management
- ✅ Get all active users with complete data
- ✅ Get specific user fields dynamically
- ✅ Filter users by CPF (Brazilian Tax ID)

### Patient Management
- ✅ Retrieve all interned patients
- ✅ Query patients by bed number
- ✅ Input validation for bed queries
- ✅ Join patient, attendance, and bed information

### Technical Features
- 🔒 Parameterized SQL queries (SQL injection prevention)
- 🌐 CORS support for cross-origin requests
- 📦 Proper connection pooling and management
- ⚡ Fast response times with Oracle Instant Client
- 🔄 Auto-restart in development mode
- 🚀 Production-ready with PM2 process management

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest | Runtime environment |
| **Express.js** | 4.21.1 | Web application framework |
| **Oracle Database** | N/A | Primary database |
| **oracledb** | 6.7.0 | Oracle Database driver |
| **dotenv** | 16.4.6 | Environment variable management |
| **cors** | 2.8.5 | Cross-Origin Resource Sharing |
| **nodemon** | 3.1.7 | Development auto-reload |
| **pm2** | 5.4.3 | Production process manager |

---

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Oracle Instant Client 23.6 or higher
- Access to an Oracle Database instance
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd oracledb

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Run in development mode
npm run dev

# Or run in production mode
npm start
```

For detailed installation instructions, see [INSTALLATION.md](./INSTALLATION.md).

---

## API Endpoints

### User Endpoints

#### Get All Users
```http
GET /api/users
```
Returns complete data for all active users.

**Response Example:**
```json
[
  {
    "CD_USUARIO": "NOME.USUARIO",
    "NM_USUARIO": "NOME COMPLETO DO USUÁRIO",
    "CPF": "00000000000",
    "SN_SENHA_PLOGIN": "N",
    "SN_ATIVO": "S"
  }
]
```

#### Get User Field
```http
GET /api/users/:parameter
```
Returns specific field for all users (e.g., `/api/users/CPF` returns only CPF numbers).

**Response Example:**
```json
["00000000000", "11111111111", "22222222222"]
```

#### Get User by CPF
```http
GET /api/users/cpf/:cpf
```
Returns complete user data filtered by CPF.

**Example:** `/api/users/cpf/12300012399`

### Patient Endpoints

#### Get All Interned Patients
```http
GET /api/pacientes/internados
```
Returns all currently hospitalized patients with bed information.

**Response Example:**
```json
[
  {
    "CD_PACIENTE": 12345,
    "NM_PACIENTE": "João Silva",
    "DT_NASCIMENTO": "1980-05-15T00:00:00.000Z",
    "NR_CPF": "12345678900",
    "IE_SEXO": "M",
    "CD_ATENDIMENTO": 67890,
    "DT_ATENDIMENTO": "2024-01-15T08:30:00.000Z",
    "DS_LEITO": "Leito 101 - Ala A",
    "CD_LEITO": 101
  }
]
```

#### Get Patients by Bed
```http
GET /api/pacientes/internados/:leito
```
Returns patient data for a specific bed number.

**Example:** `/api/pacientes/internados/101`

**Validation Rules:**
- Bed number must be numeric
- Must be greater than 0
- Must be less than 9999

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

---

## Documentation

| Document | Description |
|----------|-------------|
| [API Documentation](./API_DOCUMENTATION.md) | Complete API reference with examples |
| [Architecture](./ARCHITECTURE.md) | System design and architecture overview |
| [Installation Guide](./INSTALLATION.md) | Detailed setup and configuration |
| [Security Guidelines](./SECURITY.md) | Security best practices and considerations |
| [Contributing Guide](./CONTRIBUTING.md) | Development workflow and guidelines |

---

## Project Structure

```
oracledb/
├── server.js                    # Server entry point
├── app.js                       # Express app configuration
├── controllers/                 # Business logic layer
│   ├── controllerGetData.js    # User data handlers
│   └── controllerGetPatientsData.js  # Patient data handlers
├── routes/                      # API routing
│   └── index.js                # Route definitions
├── service/                     # Data access layer
│   ├── app-oracleget.js        # Oracle DB connection service
│   └── query/                  # SQL queries
│       ├── query_users.js      # User queries
│       └── query_patients.js   # Patient queries
├── .env.example                # Environment template
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

For detailed architecture information, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when files change.

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Local Server Configuration
SERVER_ADDRESS=localhost
SERVER_PORT=8073

# Oracle Database Configuration
ORACLE_USER=your_username
ORACLE_PASSWD=your_password
ORACLE_CSTRING=your_connection_string
```

### Adding New Endpoints

1. Create SQL query in `service/query/`
2. Add service function in `service/app-oracleget.js`
3. Create controller in `controllers/`
4. Add route in `routes/index.js`

For detailed development guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Production Deployment

### Using PM2

```bash
# Start the application
pm2 start server.js --name oracledb-api

# Monitor the application
pm2 monit

# View logs
pm2 logs oracledb-api

# Restart the application
pm2 restart oracledb-api

# Stop the application
pm2 stop oracledb-api
```

### Production Checklist

- [ ] Configure proper CORS origins (remove `origin: '*'`)
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Configure database connection pooling
- [ ] Set up backup strategies
- [ ] Implement rate limiting
- [ ] Add authentication/authorization
- [ ] Review and harden security settings

See [SECURITY.md](./SECURITY.md) for detailed security guidelines.

---

## Security Considerations

⚠️ **Important Security Notes:**

1. **CORS Configuration**: Currently set to allow all origins (`origin: '*'`). This should be restricted in production.
2. **Authentication**: No authentication layer is implemented. Add authentication middleware for production.
3. **Sensitive Data**: Patient and user data is health-related and requires proper access controls.
4. **Environment Variables**: Never commit `.env` file to version control.
5. **SQL Injection**: The application uses parameterized queries, but always validate and sanitize inputs.

For comprehensive security guidelines, see [SECURITY.md](./SECURITY.md).

---

## Contributing

Contributions are welcome! Please read the [Contributing Guidelines](./CONTRIBUTING.md) before submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

ISC License

---

## Versão em Português

# API Oracle DB para Gestão Hospitalar

## Visão Geral

Esta aplicação é uma API RESTful construída com Node.js e Express que fornece acesso seguro a dados de gestão hospitalar armazenados em um banco de dados Oracle.

## Funcionalidades Principais

### Gestão de Usuários
- ✅ Retornar todos os usuários ativos com dados completos
- ✅ Obter campos específicos de usuários dinamicamente
- ✅ Filtrar usuários por CPF

### Gestão de Pacientes
- ✅ Recuperar todos os pacientes internados
- ✅ Consultar pacientes por número de leito
- ✅ Validação de entrada para consultas de leito
- ✅ Junção de informações de paciente, atendimento e leito

## Início Rápido

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Executar em modo de desenvolvimento
npm run dev

# Ou executar em modo de produção
npm start
```

## Endpoints da API

### Retorna todos os usuários com dados completos
```
GET /api/users
```

### Retorna apenas o CPF de todos os usuários
```
GET /api/users/CPF
```

### Retorna os dados de um CPF específico
```
GET /api/users/cpf/12300012399
```

### Retorna todos os pacientes internados
```
GET /api/pacientes/internados
```

### Retorna pacientes por número de leito
```
GET /api/pacientes/internados/101
```

## Documentação Completa

- [Documentação da API](./API_DOCUMENTATION.md) - Referência completa da API com exemplos
- [Arquitetura](./ARCHITECTURE.md) - Visão geral do design do sistema
- [Guia de Instalação](./INSTALLATION.md) - Configuração detalhada
- [Diretrizes de Segurança](./SECURITY.md) - Melhores práticas de segurança
- [Guia de Contribuição](./CONTRIBUTING.md) - Fluxo de trabalho de desenvolvimento

## Estrutura do Projeto

```
oracledb/
├── server.js                    # Ponto de entrada do servidor
├── app.js                       # Configuração do Express
├── controllers/                 # Camada de lógica de negócios
├── routes/                      # Roteamento da API
├── service/                     # Camada de acesso a dados
│   ├── app-oracleget.js        # Serviço de conexão Oracle DB
│   └── query/                  # Consultas SQL
└── .env.example                # Template de variáveis de ambiente
```

## Considerações de Segurança

⚠️ **Importante:**

1. **CORS**: Atualmente configurado para permitir todas as origens. Restringir em produção.
2. **Autenticação**: Nenhuma camada de autenticação implementada. Adicionar middleware de autenticação para produção.
3. **Dados Sensíveis**: Dados de pacientes e usuários são relacionados à saúde e requerem controles de acesso apropriados.

## Contribuindo

Contribuições são bem-vindas! Por favor, leia as [Diretrizes de Contribuição](./CONTRIBUTING.md) antes de enviar pull requests.

## Autor

**Mike**

## Licença

ISC
