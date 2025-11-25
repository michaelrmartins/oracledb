# API Documentation

Complete reference for the Oracle DB Healthcare API endpoints.

## Table of Contents

- [Base URL](#base-url)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [User Endpoints](#user-endpoints)
  - [Get All Users](#get-all-users)
  - [Get User Field](#get-user-field)
  - [Get User by CPF](#get-user-by-cpf)
- [Patient Endpoints](#patient-endpoints)
  - [Get All Interned Patients](#get-all-interned-patients)
  - [Get Patients by Bed](#get-patients-by-bed)
- [Data Models](#data-models)
- [Status Codes](#status-codes)

---

## Base URL

```
http://<SERVER_ADDRESS>:<SERVER_PORT>/api
```

Default configuration:
```
http://localhost:8073/api
```

All endpoints are prefixed with `/api`.

---

## Response Format

All successful responses return JSON data with appropriate HTTP status codes.

### Success Response Structure

```json
{
  // Response data varies by endpoint
}
```

### Error Response Structure

```json
{
  "message": "error: Description of what went wrong"
}
```

---

## Error Handling

The API uses standard HTTP status codes to indicate success or failure:

| Status Code | Meaning |
|-------------|---------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid parameters |
| 500 | Internal Server Error - Server-side error |

---

## User Endpoints

### Get All Users

Retrieves complete information for all active users in the system.

**Endpoint:** `GET /api/users`

**Query Filters:**
- Only active users (`SN_ATIVO = 'S'`)
- Only users with CPF registered (`CPF IS NOT NULL`)
- Excludes user codes starting with numbers (0-9)

**Request Example:**

```bash
curl http://localhost:8073/api/users
```

**Response Example:**

```json
[
  {
    "CD_USUARIO": "JOAO.SILVA",
    "NM_USUARIO": "João Silva Santos",
    "CPF": "12345678900",
    "SN_SENHA_PLOGIN": "S",
    "SN_ATIVO": "S"
  },
  {
    "CD_USUARIO": "MARIA.SOUZA",
    "NM_USUARIO": "Maria Souza Costa",
    "CPF": "98765432100",
    "SN_SENHA_PLOGIN": "N",
    "SN_ATIVO": "S"
  }
]
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `CD_USUARIO` | String | User code/username |
| `NM_USUARIO` | String | Full name of the user |
| `CPF` | String | Brazilian Tax ID (11 digits) |
| `SN_SENHA_PLOGIN` | String | First login flag ('S' = Yes, 'N' = No) |
| `SN_ATIVO` | String | Active status ('S' = Active, 'N' = Inactive) |

**Status Codes:**
- `200 OK` - Users retrieved successfully
- `500 Internal Server Error` - Database connection or query error

---

### Get User Field

Retrieves a specific field from all active users.

**Endpoint:** `GET /api/users/:parameter`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `parameter` | String | Yes | Field name to retrieve (e.g., CPF, NM_USUARIO, CD_USUARIO) |

**Request Examples:**

```bash
# Get only CPF numbers
curl http://localhost:8073/api/users/CPF

# Get only user names
curl http://localhost:8073/api/users/NM_USUARIO

# Get only user codes
curl http://localhost:8073/api/users/CD_USUARIO
```

**Response Example (CPF):**

```json
[
  "12345678900",
  "98765432100",
  "11122233344"
]
```

**Response Example (NM_USUARIO):**

```json
[
  "João Silva Santos",
  "Maria Souza Costa",
  "Pedro Oliveira Lima"
]
```

**Status Codes:**
- `200 OK` - Field values retrieved successfully
- `500 Internal Server Error` - Database connection or query error

**Notes:**
- The parameter name is case-sensitive and must match the database column name
- Invalid parameter names will return `undefined` values in the array
- Uses same query filters as [Get All Users](#get-all-users)

---

### Get User by CPF

Retrieves complete information for a specific user filtered by CPF.

**Endpoint:** `GET /api/users/cpf/:cpf`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cpf` | String | Yes | Brazilian Tax ID (11 digits) |

**Request Example:**

```bash
curl http://localhost:8073/api/users/cpf/12345678900
```

**Response Example:**

```json
[
  {
    "CD_USUARIO": "JOAO.SILVA",
    "NM_USUARIO": "João Silva Santos",
    "CPF": "12345678900",
    "SN_SENHA_PLOGIN": "S",
    "SN_ATIVO": "S"
  }
]
```

**Response Example (Not Found):**

```json
[]
```

**Status Codes:**
- `200 OK` - Request processed (returns empty array if CPF not found)
- `500 Internal Server Error` - Database connection or query error

**Notes:**
- Returns an array even for a single user (for consistency)
- Returns empty array `[]` if CPF is not found
- CPF must be exact match (no fuzzy matching)
- CPF should be provided without formatting (only digits)

---

## Patient Endpoints

### Get All Interned Patients

Retrieves information about all currently hospitalized patients.

**Endpoint:** `GET /api/pacientes/internados`

**Query Filters:**
- Only inpatient records (`tp_atendimento = 'I'`)
- Only active internments (`dt_alta IS NULL` - no discharge date)
- Includes bed assignment information

**Request Example:**

```bash
curl http://localhost:8073/api/pacientes/internados
```

**Response Example:**

```json
[
  {
    "CD_PACIENTE": 12345,
    "NM_PACIENTE": "João Silva",
    "DT_NASCIMENTO": "1980-05-15T00:00:00.000Z",
    "NR_CPF": "12345678900",
    "TP_SEXO": "M",
    "CD_ATENDIMENTO": 67890,
    "DT_ATENDIMENTO": "2024-01-15T08:30:00.000Z",
    "DS_LEITO": "Leito 101 - Ala A",
    "CD_LEITO": 101
  },
  {
    "CD_PACIENTE": 67891,
    "NM_PACIENTE": "Maria Souza",
    "DT_NASCIMENTO": "1975-08-22T00:00:00.000Z",
    "NR_CPF": "98765432100",
    "TP_SEXO": "F",
    "CD_ATENDIMENTO": 67892,
    "DT_ATENDIMENTO": "2024-01-20T14:15:00.000Z",
    "DS_LEITO": "Leito 205 - Ala B",
    "CD_LEITO": 205
  }
]
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `CD_PACIENTE` | Number | Unique patient identifier |
| `NM_PACIENTE` | String | Patient's full name |
| `DT_NASCIMENTO` | String (ISO 8601) | Patient's date of birth |
| `NR_CPF` | String | Patient's Brazilian Tax ID |
| `TP_SEXO` | String | Patient's gender ('M' = Male, 'F' = Female) |
| `CD_ATENDIMENTO` | Number | Unique attendance/admission identifier |
| `DT_ATENDIMENTO` | String (ISO 8601) | Date and time of admission |
| `DS_LEITO` | String | Bed description (including ward information) |
| `CD_LEITO` | Number | Unique bed identifier |

**Status Codes:**
- `200 OK` - Patients retrieved successfully
- `500 Internal Server Error` - Database connection or query error

**Database Relations:**
- Joins `atendime` (attendance), `paciente` (patient), and `leito` (bed) tables
- Links patients to their current bed assignments

---

### Get Patients by Bed

Retrieves patient information for a specific bed number.

**Endpoint:** `GET /api/pacientes/internados/:leito`

**Path Parameters:**

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `leito` | Number | Yes | Bed number | Must be numeric, > 0, < 9999 |

**Validation Rules:**

1. **Must be numeric**: Non-numeric values return 400 error
2. **Must be greater than 0**: Zero or negative values return 400 error
3. **Must be less than 9999**: Values >= 9999 return 400 error
4. **Cannot be undefined**: Missing parameter returns 400 error

**Request Example:**

```bash
curl http://localhost:8073/api/pacientes/internados/101
```

**Success Response Example:**

```json
[
  {
    "CD_PACIENTE": 12345,
    "NM_PACIENTE": "João Silva",
    "DT_NASCIMENTO": "1980-05-15T00:00:00.000Z",
    "NR_CPF": "12345678900",
    "TP_SEXO": "M",
    "CD_ATENDIMENTO": 67890,
    "DT_ATENDIMENTO": "2024-01-15T08:30:00.000Z",
    "DS_LEITO": "Leito 101 - Ala A",
    "CD_LEITO": 101
  }
]
```

**Response Example (Bed Empty or Not Found):**

```json
[]
```

**Error Response Examples:**

**Non-numeric bed parameter:**
```json
{
  "message": "error: Bed parameter must be a number."
}
```

**Bed number <= 0:**
```json
{
  "message": "error: Bed parameter must be greater than zero."
}
```

**Bed number >= 9999:**
```json
{
  "message": "error: Bed parameter must be less than 9999."
}
```

**Missing bed parameter:**
```json
{
  "message": "error: Bed parameter is required."
}
```

**Status Codes:**
- `200 OK` - Request processed (returns empty array if bed not found or empty)
- `400 Bad Request` - Invalid bed parameter
- `500 Internal Server Error` - Database connection or query error

**Notes:**
- Returns an array even for a single patient (for consistency)
- Returns empty array `[]` if bed is empty or doesn't exist
- Uses parameterized query (`:leito_id`) to prevent SQL injection
- Server logs received bed parameter for debugging

---

## Data Models

### User Model

Represents a healthcare staff user in the system.

```typescript
interface User {
  CD_USUARIO: string;      // User code/username
  NM_USUARIO: string;      // Full name
  CPF: string;             // Brazilian Tax ID (11 digits)
  SN_SENHA_PLOGIN: string; // First login flag ('S' or 'N')
  SN_ATIVO: string;        // Active status ('S' or 'N')
}
```

**Database Table:** `DBASGU.USUARIOS`

**Business Rules:**
- Only active users are returned (`SN_ATIVO = 'S'`)
- CPF must be present (`CPF IS NOT NULL`)
- User codes starting with digits (0-9) are excluded
- Results sorted by user code in ascending order

---

### Patient Model

Represents a hospitalized patient with attendance and bed information.

```typescript
interface Patient {
  CD_PACIENTE: number;     // Patient identifier
  NM_PACIENTE: string;     // Patient name
  DT_NASCIMENTO: string;   // Birth date (ISO 8601)
  NR_CPF: string;          // Brazilian Tax ID
  TP_SEXO: string;         // Gender ('M' or 'F')
  CD_ATENDIMENTO: number;  // Attendance identifier
  DT_ATENDIMENTO: string;  // Admission date (ISO 8601)
  DS_LEITO: string;        // Bed description
  CD_LEITO: number;        // Bed identifier
}
```

**Database Tables:**
- `paciente` - Patient demographic information
- `atendime` - Attendance/admission records
- `leito` - Bed assignments

**Business Rules:**
- Only inpatient records (`tp_atendimento = 'I'`)
- Only active admissions (no discharge date: `dt_alta IS NULL`)
- Joins patient, attendance, and bed information

---

## Status Codes

### Success Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request was successful |

### Client Error Codes

| Code | Status | Description |
|------|--------|-------------|
| 400 | Bad Request | Invalid request parameters |

### Server Error Codes

| Code | Status | Description |
|------|--------|-------------|
| 500 | Internal Server Error | Database connection or query error |

---

## Authentication

⚠️ **Current Status:** No authentication is implemented.

**For Production:**
- Implement JWT-based authentication
- Add authorization middleware to protect sensitive endpoints
- Implement role-based access control (RBAC)
- Use API keys for service-to-service communication
- Consider OAuth 2.0 for third-party integrations

See [SECURITY.md](./SECURITY.md) for detailed security recommendations.

---

## Rate Limiting

⚠️ **Current Status:** No rate limiting is implemented.

**For Production:**
- Implement request rate limiting
- Use libraries like `express-rate-limit`
- Set appropriate limits based on endpoint sensitivity
- Return 429 (Too Many Requests) when limits exceeded

---

## CORS Configuration

**Current Configuration:** Allows all origins (`origin: '*'`)

**For Production:**
- Restrict CORS to specific trusted origins
- Configure in `app.js`:

```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));
```

---

## Testing the API

### Using cURL

```bash
# Test user endpoints
curl http://localhost:8073/api/users
curl http://localhost:8073/api/users/CPF
curl http://localhost:8073/api/users/cpf/12345678900

# Test patient endpoints
curl http://localhost:8073/api/pacientes/internados
curl http://localhost:8073/api/pacientes/internados/101
```

### Using Postman

1. Import the following endpoints into Postman
2. Set base URL: `http://localhost:8073/api`
3. Create requests for each endpoint
4. Save as a collection for future use

### Using JavaScript (Fetch API)

```javascript
// Get all users
fetch('http://localhost:8073/api/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Get patients by bed
fetch('http://localhost:8073/api/pacientes/internados/101')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

## Troubleshooting

### Common Issues

**Problem:** 500 Internal Server Error

**Possible Causes:**
- Database connection failure
- Invalid Oracle connection string
- Database credentials incorrect
- Oracle Instant Client not installed or configured

**Solution:**
1. Check `.env` configuration
2. Verify Oracle database is accessible
3. Check Oracle Instant Client installation
4. Review application logs

---

**Problem:** Empty array returned when data should exist

**Possible Causes:**
- Data doesn't meet query filters (e.g., user not active)
- CPF or bed number doesn't exist in database
- Connection to wrong database schema

**Solution:**
1. Verify data exists in database
2. Check query filters in `service/query/` files
3. Verify database schema is correct

---

**Problem:** 400 Bad Request on bed endpoint

**Possible Causes:**
- Bed parameter is not numeric
- Bed parameter is out of valid range (0-9999)

**Solution:**
1. Ensure bed parameter is a valid number
2. Check bed number is greater than 0
3. Check bed number is less than 9999

---

## API Versioning

**Current Version:** 1.0.0 (no versioning implemented)

**For Future:**
- Implement API versioning in URL: `/api/v1/users`
- Use HTTP headers for version negotiation
- Maintain backward compatibility
- Document breaking changes

---

## Additional Resources

- [Main README](./README.md) - Project overview and quick start
- [Architecture Guide](./ARCHITECTURE.md) - System design and architecture
- [Installation Guide](./INSTALLATION.md) - Setup and configuration
- [Security Guidelines](./SECURITY.md) - Security best practices
- [Contributing Guide](./CONTRIBUTING.md) - Development workflow

---

## Support

For issues, questions, or contributions, please refer to the [Contributing Guide](./CONTRIBUTING.md).
