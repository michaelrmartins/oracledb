# Architecture Documentation

This document provides a comprehensive overview of the system architecture, design patterns, and technical implementation of the Oracle DB Healthcare API.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Pattern](#architecture-pattern)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Component Architecture](#component-architecture)
- [Data Flow](#data-flow)
- [Database Schema](#database-schema)
- [Design Patterns](#design-patterns)
- [Configuration Management](#configuration-management)
- [Error Handling](#error-handling)
- [Performance Considerations](#performance-considerations)
- [Scalability](#scalability)
- [Security Architecture](#security-architecture)

---

## System Overview

The Oracle DB Healthcare API is a **RESTful web service** that acts as a data access layer between client applications and an Oracle Database. The system follows a **layered architecture** pattern, separating concerns into distinct layers for maintainability and scalability.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
│         (Web Apps, Mobile Apps, Third-party Services)        │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │ JSON
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Web Server                     │
│                        (app.js)                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  │ Middleware │  │    CORS    │  │   JSON Parser      │    │
│  └────────────┘  └────────────┘  └────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Routing Layer                           │
│                     (routes/index.js)                        │
│          Maps HTTP endpoints to controller functions         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Controller Layer                          │
│        (controllers/controllerGetData.js,                    │
│         controllers/controllerGetPatientsData.js)            │
│    Request validation, business logic, response formatting   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                            │
│               (service/app-oracleget.js)                     │
│       Database connection, query execution, data return      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Query Layer                             │
│              (service/query/query_*.js)                      │
│               SQL query definitions and templates            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Oracle Database                           │
│         (Tables: USUARIOS, PACIENTE, ATENDIME, LEITO)       │
└─────────────────────────────────────────────────────────────┘
```

---

## Architecture Pattern

### MVC (Model-View-Controller) Adaptation

While this is an API without traditional views, the architecture follows MVC principles:

| Layer | Component | Responsibility |
|-------|-----------|----------------|
| **View** | JSON Responses | Data representation for clients |
| **Controller** | `controllers/` | Request handling, validation, response formatting |
| **Model** | `service/` + `service/query/` | Data access and business logic |

### Layered Architecture

The application implements a **4-layer architecture**:

1. **Presentation Layer** (Routes)
   - HTTP endpoint definitions
   - Route-to-controller mapping

2. **Business Logic Layer** (Controllers)
   - Request validation
   - Business rules enforcement
   - Response formatting

3. **Data Access Layer** (Services)
   - Database connection management
   - Query execution
   - Result transformation

4. **Data Layer** (Queries)
   - SQL query definitions
   - Parameterized statements

---

## Technology Stack

### Core Technologies

```javascript
{
  "runtime": "Node.js",
  "framework": "Express.js 4.21.1",
  "database": "Oracle Database",
  "dbDriver": "oracledb 6.7.0",
  "instantClient": "Oracle Instant Client 23.6"
}
```

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | 4.21.1 | Web application framework |
| oracledb | 6.7.0 | Oracle Database driver for Node.js |
| dotenv | 16.4.6 | Environment variable management |
| cors | 2.8.5 | Cross-Origin Resource Sharing |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| nodemon | 3.1.7 | Auto-restart during development |
| pm2 | 5.4.3 | Production process manager |

---

## Directory Structure

```
oracledb/
│
├── server.js                          # Application entry point
│   ├── Loads environment variables
│   ├── Starts Express server
│   └── Defines server address/port
│
├── app.js                             # Express application setup
│   ├── Initializes Express
│   ├── Configures middleware (CORS, JSON)
│   └── Mounts routes
│
├── routes/
│   └── index.js                       # Route definitions
│       ├── Maps endpoints to controllers
│       └── Defines HTTP methods
│
├── controllers/                       # Business logic layer
│   ├── controllerGetData.js          # User management
│   │   ├── getAllUsers()
│   │   ├── getAllUsersByParameter()
│   │   └── getAllUsersByCpf()
│   │
│   └── controllerGetPatientsData.js  # Patient management
│       ├── getAllPatientsInterned()
│       └── getAllPatientsInternedByBed()
│
├── service/                           # Data access layer
│   ├── app-oracleget.js              # Oracle DB service
│   │   ├── Initializes Oracle Client
│   │   ├── Manages connections
│   │   ├── serviceOracleGetUsers()
│   │   ├── serviceOracleGetPatientsInterned()
│   │   └── serviceOracleGetPatientsInternedByBed()
│   │
│   └── query/                         # SQL queries
│       ├── query_users.js            # User queries
│       └── query_patients.js         # Patient queries
│
├── .env                               # Environment configuration (not in repo)
├── .env.example                       # Environment template
├── .gitignore                         # Git ignore rules
├── package.json                       # Dependencies and scripts
└── package-lock.json                  # Locked dependency versions
```

---

## Component Architecture

### 1. Entry Point (server.js)

**Responsibilities:**
- Load environment variables
- Import Express application
- Start HTTP server
- Define server address and port

**Code Flow:**
```javascript
1. Load dotenv → 2. Import app → 3. Read env vars → 4. Start server
```

**Key Code:**
```javascript
Dotenv.config()                  // Load environment variables
server = require('./app')        // Import Express app
server.listen(server_port, ...)  // Start HTTP server
```

---

### 2. Application Setup (app.js)

**Responsibilities:**
- Initialize Express application
- Configure middleware
- Mount routes
- Export app instance

**Middleware Stack:**
```javascript
1. express.json()     // Parse JSON request bodies
2. cors()            // Enable cross-origin requests
3. routes            // API routes
```

**Key Configuration:**
```javascript
app.use(express.json())           // Enable JSON parsing
app.use(cors({ origin: '*' }))    // Enable CORS (all origins)
app.use("/api", routes)           // Mount routes at /api
```

---

### 3. Routing Layer (routes/index.js)

**Responsibilities:**
- Define API endpoints
- Map URLs to controller functions
- Specify HTTP methods

**Route Structure:**
```
GET  /api/users                    → getAllUsers()
GET  /api/users/:parameter         → getAllUsersByParameter()
GET  /api/users/cpf/:cpf           → getAllUsersByCpf()
GET  /api/pacientes/internados     → getAllPatientsInterned()
GET  /api/pacientes/internados/:leito → getAllPatientsInternedByBed()
```

**Implementation Pattern:**
```javascript
// Import controllers
const { getAllUsers, ... } = require("../controllers/controllerGetData")

// Define routes
routers.get("/users", getAllUsers)
routers.get("/users/:parameter", getAllUsersByParameter)
```

---

### 4. Controller Layer

#### 4.1 User Controller (controllerGetData.js)

**File:** `controllers/controllerGetData.js`

**Functions:**

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `getAllUsers()` | req, resp | JSON Array | Returns all active users |
| `getAllUsersByParameter()` | req, resp | JSON Array | Returns specific user field |
| `getAllUsersByCpf()` | req, resp | JSON Array | Returns user by CPF |

**Request Flow:**
```
1. Receive HTTP request
2. Call service layer function
3. Process/filter data
4. Send response with status 200
```

**Example Implementation:**
```javascript
const getAllUsers = async (req, resp) => {
    returnUsersData = await serviceOracleGetUsers()  // Service call
    const returnUsersDataCpfs = returnUsersData.map(user => user)
    resp.status(200).send(returnUsersDataCpfs)       // Response
}
```

#### 4.2 Patient Controller (controllerGetPatientsData.js)

**File:** `controllers/controllerGetPatientsData.js`

**Functions:**

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `getAllPatientsInterned()` | req, res | JSON Array | Returns all interned patients |
| `getAllPatientsInternedByBed()` | req, res | JSON Array/Error | Returns patients by bed |

**Validation Logic (Bed Endpoint):**
```javascript
1. Check if parameter is numeric → 400 if not
2. Check if parameter > 0       → 400 if not
3. Check if parameter < 9999    → 400 if not
4. Check if parameter defined   → 400 if not
5. Call service layer           → Return results
```

**Error Response Pattern:**
```javascript
if (isNaN(leito)) {
    return res.status(400).send({
        message: "error: Bed parameter must be a number."
    })
}
```

---

### 5. Service Layer (app-oracleget.js)

**File:** `service/app-oracleget.js`

**Responsibilities:**
- Initialize Oracle Instant Client
- Manage database connections
- Execute SQL queries
- Return results as objects

**Configuration:**
```javascript
oracledb.initOracleClient({
    configdir: '/opt/oracle/instantclient_23_6'
})
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT  // Return as objects
```

**Service Functions:**

| Function | Parameters | Query | Returns |
|----------|-----------|-------|---------|
| `serviceOracleGetUsers()` | None | `querySelectUsers` | User array |
| `serviceOracleGetPatientsInterned()` | None | `querySelectPatientsInterned` | Patient array |
| `serviceOracleGetPatientsInternedByBed()` | leito | `querySelectPatientsInternedByBed` | Patient array |

**Connection Pattern:**
```javascript
1. Get connection (with credentials)
2. Execute query (with optional parameters)
3. Log results
4. Close connection
5. Return result rows
```

**Implementation Example:**
```javascript
async function serviceOracleGetUsers() {
    const connection = await oracledb.getConnection({
        user: oracleUser,
        password: oraclePasswd,
        connectString: oracleCstring
    });
    const result = await connection.execute(querySelectUsers);
    console.log(result.rows);
    await connection.close();
    return result.rows
}
```

---

### 6. Query Layer

**File Structure:**
- `service/query/query_users.js` - User queries
- `service/query/query_patients.js` - Patient queries

**Purpose:**
- Centralize SQL definitions
- Maintain query consistency
- Enable easy query modifications

**Query Examples:**

**Users Query:**
```sql
SELECT cd_usuario, nm_usuario, CPF, sn_senha_plogin, sn_ativo
FROM DBASGU.USUARIOS
WHERE SN_ATIVO = 'S'
  AND CPF IS NOT NULL
  AND CD_USUARIO NOT LIKE '[0-9]%'
ORDER BY CD_USUARIO ASC
```

**Patients Query (with parameter):**
```sql
SELECT paciente.cd_paciente, paciente.nm_paciente, ...
FROM atendime
INNER JOIN paciente ON paciente.cd_paciente = atendime.cd_paciente
INNER JOIN leito ON leito.cd_leito = atendime.cd_leito
WHERE atendime.tp_atendimento = 'I'
  AND atendime.dt_alta IS NULL
  AND leito.cd_leito = :leito_id
```

---

## Data Flow

### User Data Flow

```
Client Request
    │
    ├─→ GET /api/users
    │       │
    │       ▼
    │   [routes/index.js]
    │       │
    │       ▼
    │   getAllUsers() ← [controllers/controllerGetData.js]
    │       │
    │       ▼
    │   serviceOracleGetUsers() ← [service/app-oracleget.js]
    │       │
    │       ├─→ getConnection()
    │       ├─→ execute(querySelectUsers)
    │       └─→ close()
    │       │
    │       ▼
    │   querySelectUsers ← [service/query/query_users.js]
    │       │
    │       ▼
    │   Oracle Database (DBASGU.USUARIOS)
    │       │
    │       ▼
    │   result.rows (Array of user objects)
    │       │
    │       ▼
    │   Response to Client (JSON)
```

### Patient Data Flow (with Parameter)

```
Client Request
    │
    ├─→ GET /api/pacientes/internados/101
    │       │
    │       ▼
    │   [routes/index.js]
    │       │
    │       ▼
    │   getAllPatientsInternedByBed() ← [controllers/controllerGetPatientsData.js]
    │       │
    │       ├─→ Validate leito parameter
    │       │   ├─→ isNaN? → 400 Error
    │       │   ├─→ <= 0? → 400 Error
    │       │   ├─→ > 9999? → 400 Error
    │       │   └─→ undefined? → 400 Error
    │       │
    │       ▼
    │   serviceOracleGetPatientsInternedByBed(leito) ← [service/app-oracleget.js]
    │       │
    │       ├─→ getConnection()
    │       ├─→ execute(querySelectPatientsInternedByBed, [leito_id])
    │       └─→ close()
    │       │
    │       ▼
    │   querySelectPatientsInternedByBed ← [service/query/query_patients.js]
    │       │
    │       ▼
    │   Oracle Database (ATENDIME, PACIENTE, LEITO)
    │       │
    │       ▼
    │   result.rows (Array of patient objects)
    │       │
    │       ▼
    │   Response to Client (JSON)
```

---

## Database Schema

### Tables Used

#### 1. DBASGU.USUARIOS (Users)

**Columns:**
- `CD_USUARIO` (VARCHAR) - User code/username
- `NM_USUARIO` (VARCHAR) - Full name
- `CPF` (VARCHAR) - Brazilian Tax ID
- `SN_SENHA_PLOGIN` (CHAR) - First login flag
- `SN_ATIVO` (CHAR) - Active status

**Filters:**
- Active users only (`SN_ATIVO = 'S'`)
- CPF must exist (`CPF IS NOT NULL`)
- Username doesn't start with digit

#### 2. PACIENTE (Patients)

**Columns:**
- `CD_PACIENTE` (NUMBER) - Patient ID
- `NM_PACIENTE` (VARCHAR) - Patient name
- `DT_NASCIMENTO` (DATE) - Birth date
- `NR_CPF` (VARCHAR) - Patient CPF
- `TP_SEXO` (CHAR) - Gender

#### 3. ATENDIME (Attendances)

**Columns:**
- `CD_ATENDIMENTO` (NUMBER) - Attendance ID
- `CD_PACIENTE` (NUMBER) - Foreign key to PACIENTE
- `CD_LEITO` (NUMBER) - Foreign key to LEITO
- `DT_ATENDIMENTO` (DATE) - Admission date
- `TP_ATENDIMENTO` (CHAR) - Attendance type ('I' = Inpatient)
- `DT_ALTA` (DATE) - Discharge date

#### 4. LEITO (Beds)

**Columns:**
- `CD_LEITO` (NUMBER) - Bed ID
- `DS_LEITO` (VARCHAR) - Bed description

### Entity Relationships

```
PACIENTE ──┬──< ATENDIME >──┬── LEITO
           │                 │
      (1:N)                (N:1)
```

**Relationships:**
- One patient can have many attendances
- One attendance belongs to one patient
- One bed can be assigned to many attendances (over time)
- One attendance uses one bed

---

## Design Patterns

### 1. Layered Architecture Pattern

**Implementation:**
- Clear separation of concerns
- Each layer depends only on the layer below
- Promotes maintainability and testability

### 2. Repository Pattern

**Implementation:**
- Service layer acts as repository
- Abstracts data access logic
- Provides clean interface for controllers

### 3. Module Pattern

**Implementation:**
- Each file exports specific functions
- Clean dependencies via `require()`
- Encapsulation of functionality

### 4. Dependency Injection

**Implementation:**
- Controllers import service functions
- Services import query definitions
- Loose coupling between components

### 5. Environment-based Configuration

**Implementation:**
- `.env` file for configuration
- Separates code from configuration
- Easy deployment across environments

---

## Configuration Management

### Environment Variables

**File:** `.env` (not in version control)

**Variables:**
```env
SERVER_ADDRESS=localhost        # API server address
SERVER_PORT=8073               # API server port
ORACLE_USER=username           # Database username
ORACLE_PASSWD=password         # Database password
ORACLE_CSTRING=connection      # Oracle connection string
```

**Loading:**
```javascript
const Dotenv = require('dotenv')
Dotenv.config()                // Loads .env into process.env
```

**Usage:**
```javascript
const oracleUser = process.env.ORACLE_USER
const server_port = process.env.SERVER_PORT
```

---

## Error Handling

### Current Implementation

**Controller Level:**
- Input validation with explicit checks
- Returns 400 status for invalid inputs
- Returns 500 for unhandled errors (implicit)

**Service Level:**
- No explicit error handling
- Relies on async/await error propagation

**Recommendations for Production:**

1. **Add try-catch blocks:**
```javascript
try {
    const result = await serviceOracleGetUsers()
    res.status(200).send(result)
} catch (error) {
    console.error('Error:', error)
    res.status(500).send({ message: 'Internal server error' })
}
```

2. **Centralized error handler:**
```javascript
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({ message: 'Something went wrong!' })
})
```

3. **Custom error classes:**
```javascript
class DatabaseError extends Error {
    constructor(message) {
        super(message)
        this.name = 'DatabaseError'
    }
}
```

---

## Performance Considerations

### Current Performance Characteristics

**Strengths:**
- ✅ Direct database queries (no ORM overhead)
- ✅ JSON response format (lightweight)
- ✅ Simple query structure

**Limitations:**
- ⚠️ New connection per request (no pooling)
- ⚠️ No caching mechanism
- ⚠️ Synchronous query execution
- ⚠️ Full table scans for unindexed searches

### Optimization Recommendations

#### 1. Connection Pooling

**Current:**
```javascript
const connection = await oracledb.getConnection({...})
// ... use connection
await connection.close()
```

**Recommended:**
```javascript
// Create pool once at startup
const pool = await oracledb.createPool({
    user: oracleUser,
    password: oraclePasswd,
    connectString: oracleCstring,
    poolMin: 2,
    poolMax: 10
})

// Get connection from pool
const connection = await pool.getConnection()
```

#### 2. Caching

**Implement Redis caching for frequently accessed data:**
```javascript
// Check cache first
const cached = await redis.get(cacheKey)
if (cached) return JSON.parse(cached)

// Query database
const result = await serviceOracleGetUsers()

// Store in cache
await redis.setex(cacheKey, 3600, JSON.stringify(result))
```

#### 3. Database Indexing

**Recommended indexes:**
- `USUARIOS.CPF` - For user CPF lookups
- `USUARIOS.SN_ATIVO` - For active user filtering
- `ATENDIME.CD_LEITO` - For bed searches
- `ATENDIME.TP_ATENDIMENTO` - For attendance type filtering

---

## Scalability

### Current Architecture Limitations

1. **Single-instance deployment** - No load balancing
2. **Stateful connections** - Each request creates new connection
3. **No horizontal scaling** - Not optimized for multiple instances

### Scaling Recommendations

#### Horizontal Scaling

```
                    Load Balancer
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    Instance 1       Instance 2      Instance 3
        │                │                │
        └────────────────┼────────────────┘
                         │
                 Connection Pool
                         │
                  Oracle Database
```

**Implementation:**
- Deploy multiple API instances
- Use NGINX or AWS ALB for load balancing
- Implement shared connection pool
- Use PM2 cluster mode

#### Vertical Scaling

- Increase Node.js memory limit
- Optimize database queries
- Implement connection pooling
- Add caching layer

---

## Security Architecture

### Current Security Status

**Implemented:**
- ✅ Parameterized queries (SQL injection prevention)
- ✅ Environment-based credentials
- ✅ CORS enabled

**Missing:**
- ❌ Authentication/Authorization
- ❌ Rate limiting
- ❌ Request validation middleware
- ❌ HTTPS/TLS encryption
- ❌ API key management
- ❌ Audit logging

### Security Recommendations

See [SECURITY.md](./SECURITY.md) for comprehensive security guidelines.

**Priority Implementations:**

1. **Authentication:**
   - JWT-based authentication
   - OAuth 2.0 for third-party access

2. **Authorization:**
   - Role-based access control (RBAC)
   - Endpoint-level permissions

3. **CORS Restriction:**
   - Replace `origin: '*'` with specific domains

4. **Rate Limiting:**
   - Implement express-rate-limit
   - Protect against DoS attacks

5. **Data Encryption:**
   - HTTPS/TLS for transport
   - Encrypt sensitive data at rest

---

## Future Architecture Enhancements

### Recommended Improvements

1. **Microservices Architecture**
   - Separate user and patient services
   - Independent scaling
   - Technology diversity

2. **API Gateway**
   - Centralized authentication
   - Rate limiting
   - Request routing

3. **Event-Driven Architecture**
   - Publish events on data changes
   - Asynchronous processing
   - Better decoupling

4. **GraphQL Layer**
   - Flexible data queries
   - Reduced over-fetching
   - Better client experience

5. **Monitoring and Observability**
   - Application Performance Monitoring (APM)
   - Distributed tracing
   - Centralized logging

---

## Additional Resources

- [Main README](./README.md) - Project overview
- [API Documentation](./API_DOCUMENTATION.md) - API reference
- [Installation Guide](./INSTALLATION.md) - Setup instructions
- [Security Guidelines](./SECURITY.md) - Security best practices
- [Contributing Guide](./CONTRIBUTING.md) - Development workflow

---

## Conclusion

This architecture provides a solid foundation for a healthcare data API with clear separation of concerns, maintainability, and room for growth. The layered approach ensures that each component has a single responsibility, making the codebase easy to understand, test, and extend.

For production deployment, implement the recommended security enhancements, performance optimizations, and monitoring solutions outlined in this document.
