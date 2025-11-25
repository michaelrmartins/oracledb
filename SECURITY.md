# Security Guidelines

Comprehensive security guidelines and best practices for the Oracle DB Healthcare API.

## Table of Contents

- [Security Overview](#security-overview)
- [Current Security Status](#current-security-status)
- [Critical Security Issues](#critical-security-issues)
- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [Network Security](#network-security)
- [Input Validation](#input-validation)
- [Database Security](#database-security)
- [API Security](#api-security)
- [Logging & Monitoring](#logging--monitoring)
- [Compliance](#compliance)
- [Security Checklist](#security-checklist)
- [Incident Response](#incident-response)
- [Security Updates](#security-updates)

---

## Security Overview

This API handles **sensitive healthcare data** including:
- Personal Identifiable Information (PII)
- Protected Health Information (PHI)
- Brazilian Tax IDs (CPF)
- Patient medical information

**Security is paramount** and should be treated with the highest priority. This document outlines current vulnerabilities and provides actionable recommendations for securing the application.

---

## Current Security Status

### ✅ Security Features Implemented

1. **Parameterized SQL Queries**
   - Uses bind variables to prevent SQL injection
   - Example: `querySelectPatientsInternedByBed` uses `:leito_id` parameter

2. **Environment-based Configuration**
   - Credentials stored in `.env` file
   - Not committed to version control

3. **Input Validation (Partial)**
   - Bed number validation in patient endpoint
   - Type checking and range validation

### ❌ Critical Security Issues

1. **No Authentication** - Anyone can access all endpoints
2. **No Authorization** - No role-based access control
3. **CORS Wide Open** - Allows requests from any origin (`origin: '*'`)
4. **No Rate Limiting** - Vulnerable to DoS attacks
5. **No HTTPS** - Data transmitted in plain text
6. **No Audit Logging** - No record of who accessed what data
7. **No API Keys** - No mechanism to identify clients
8. **Sensitive Data in Logs** - Database results logged to console

### ⚠️ Risk Assessment

| Risk | Severity | Impact | Likelihood |
|------|----------|--------|------------|
| Unauthorized data access | **CRITICAL** | Data breach, LGPD violation | High |
| Data interception | **CRITICAL** | PHI exposure | High |
| DoS attacks | **HIGH** | Service disruption | Medium |
| SQL injection | **LOW** | Data breach | Low (mitigated) |
| CORS exploitation | **HIGH** | Unauthorized access | High |

---

## Critical Security Issues

### 1. CORS Configuration ⚠️ CRITICAL

**Current Issue:**
```javascript
// app.js - Line 12-17
app.use(cors({
    origin: '*'  // DANGER - Allows ANY website to access your API
}));
```

**Risk:**
- Any website can make requests to your API
- Cross-site request forgery (CSRF) attacks
- Unauthorized data access from malicious sites

**Solution:**

```javascript
// Restrict to specific domains
const allowedOrigins = [
    'https://yourdomain.com',
    'https://app.yourdomain.com',
    'https://admin.yourdomain.com'
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2. No Authentication ⚠️ CRITICAL

**Current Issue:**
- All endpoints are publicly accessible
- No way to identify users
- No access control

**Risk:**
- Unauthorized access to patient data
- LGPD (Brazilian GDPR) violations
- Data breaches

**Solution: Implement JWT Authentication**

```bash
# Install required packages
npm install jsonwebtoken bcrypt
```

**Create authentication middleware:**

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            message: 'Access token required'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: 'Invalid or expired token'
            });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
```

**Protect routes:**

```javascript
// routes/index.js
const { authenticateToken } = require('../middleware/auth');

// Protect all routes
routers.use(authenticateToken);

// Or protect specific routes
routers.get("/users", authenticateToken, getAllUsers);
routers.get("/pacientes/internados", authenticateToken, getAllPatientsInterned);
```

**Create login endpoint:**

```javascript
// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { username, password } = req.body;

    // Verify credentials against database
    // This is pseudo-code - implement actual user verification
    const user = await verifyUserCredentials(username, password);

    if (!user) {
        return res.status(401).json({
            message: 'Invalid credentials'
        });
    }

    // Generate token
    const token = jwt.sign(
        {
            userId: user.id,
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    res.json({
        token,
        expiresIn: 28800 // 8 hours in seconds
    });
};

module.exports = { login };
```

### 3. No HTTPS/TLS ⚠️ CRITICAL

**Current Issue:**
- Data transmitted in plain text
- Passwords and PHI visible to network sniffers

**Risk:**
- Man-in-the-middle attacks
- Data interception
- Credential theft

**Solution:**

**Option 1: HTTPS in Node.js**

```javascript
// server.js
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('/path/to/private-key.pem'),
    cert: fs.readFileSync('/path/to/certificate.pem')
};

https.createServer(options, app).listen(server_port, () => {
    console.log(`Secure server running on https://${server_address}:${server_port}`);
});
```

**Option 2: NGINX Reverse Proxy (Recommended)**

See [INSTALLATION.md](./INSTALLATION.md#add-ssl-with-lets-encrypt) for NGINX SSL setup with Let's Encrypt.

---

## Authentication & Authorization

### Recommended Authentication Strategy

#### 1. JWT-Based Authentication

**Advantages:**
- Stateless
- Scalable
- Industry standard

**Implementation:**

```javascript
// Add to .env
JWT_SECRET=your-very-secure-random-string-change-this
JWT_EXPIRATION=8h
```

#### 2. Role-Based Access Control (RBAC)

Define roles and permissions:

```javascript
// config/roles.js
const roles = {
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    NURSE: 'nurse',
    RECEPTIONIST: 'receptionist'
};

const permissions = {
    admin: ['read:users', 'write:users', 'read:patients', 'write:patients'],
    doctor: ['read:users', 'read:patients', 'write:patients'],
    nurse: ['read:patients', 'write:patients'],
    receptionist: ['read:patients']
};

module.exports = { roles, permissions };
```

**Authorization middleware:**

```javascript
// middleware/authorize.js
const authorize = (requiredPermission) => {
    return (req, res, next) => {
        const userPermissions = req.user.permissions || [];

        if (!userPermissions.includes(requiredPermission)) {
            return res.status(403).json({
                message: 'Insufficient permissions'
            });
        }

        next();
    };
};

module.exports = { authorize };
```

**Usage:**

```javascript
// Require specific permission
routers.get(
    "/users",
    authenticateToken,
    authorize('read:users'),
    getAllUsers
);
```

### API Key Authentication (Alternative)

For service-to-service communication:

```javascript
// middleware/apiKey.js
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({
            message: 'API key required'
        });
    }

    // Verify against database or environment variable
    const validKeys = process.env.API_KEYS.split(',');

    if (!validKeys.includes(apiKey)) {
        return res.status(403).json({
            message: 'Invalid API key'
        });
    }

    next();
};

module.exports = { validateApiKey };
```

---

## Data Protection

### 1. Encrypt Sensitive Data at Rest

**Database-level encryption:**
- Use Oracle Transparent Data Encryption (TDE)
- Encrypt specific columns (CPF, sensitive fields)

**Application-level encryption:**

```javascript
const crypto = require('crypto');

// Encryption configuration
const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
    };
}

function decrypt(encryptedData) {
    const decipher = crypto.createDecipheriv(
        algorithm,
        key,
        Buffer.from(encryptedData.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
```

### 2. Data Masking

**Mask sensitive data in responses:**

```javascript
// utils/dataMasking.js
function maskCPF(cpf) {
    if (!cpf || cpf.length !== 11) return cpf;
    return `***.***.${cpf.slice(-2)}`;
}

function maskName(name) {
    if (!name) return name;
    const parts = name.split(' ');
    if (parts.length === 1) return name[0] + '***';
    return `${parts[0]} ${parts[parts.length - 1][0]}***`;
}

module.exports = { maskCPF, maskName };
```

**Apply in controllers:**

```javascript
const { maskCPF, maskName } = require('../utils/dataMasking');

const getAllPatients = async (req, res) => {
    const patients = await serviceOracleGetPatientsInterned();

    // Mask data for non-admin users
    if (req.user.role !== 'admin') {
        patients.forEach(patient => {
            patient.NR_CPF = maskCPF(patient.NR_CPF);
            patient.NM_PACIENTE = maskName(patient.NM_PACIENTE);
        });
    }

    res.status(200).send(patients);
};
```

### 3. Secure Data in Transit

- **Always use HTTPS** in production
- **Enforce TLS 1.2 or higher**
- **Use strong cipher suites**

---

## Network Security

### 1. Firewall Configuration

**Recommended firewall rules:**

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP (redirect to HTTPS)
sudo ufw allow 443/tcp     # HTTPS
sudo ufw deny 8073/tcp     # Block direct access to API port

# Enable firewall
sudo ufw enable
```

### 2. Rate Limiting

**Implement rate limiting to prevent abuse:**

```bash
npm install express-rate-limit
```

```javascript
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per windowMs
    message: {
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for sensitive endpoints
const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        message: 'Too many requests to sensitive endpoint.'
    }
});

module.exports = { apiLimiter, strictLimiter };
```

**Apply to routes:**

```javascript
// app.js
const { apiLimiter } = require('./middleware/rateLimiter');

// Apply to all API routes
app.use('/api', apiLimiter, routes);

// Or apply to specific routes
const { strictLimiter } = require('./middleware/rateLimiter');
routers.get("/users", strictLimiter, getAllUsers);
```

### 3. IP Whitelisting

**For internal APIs:**

```javascript
// middleware/ipWhitelist.js
const ipWhitelist = [
    '192.168.1.0/24',  // Internal network
    '10.0.0.0/8',      // Private network
    '203.0.113.10'     // Specific trusted IP
];

const checkIpWhitelist = (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;

    // Simple check (for production, use a library like 'ipaddr.js')
    const isAllowed = ipWhitelist.some(ip => clientIp.includes(ip));

    if (!isAllowed) {
        return res.status(403).json({
            message: 'Access denied from this IP address'
        });
    }

    next();
};

module.exports = { checkIpWhitelist };
```

---

## Input Validation

### 1. Comprehensive Input Validation

**Install validation library:**

```bash
npm install express-validator
```

**Create validation middleware:**

```javascript
// middleware/validation.js
const { body, param, validationResult } = require('express-validator');

// Validation rules for bed parameter
const validateBed = [
    param('leito')
        .isInt({ min: 1, max: 9998 })
        .withMessage('Bed number must be between 1 and 9998'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        next();
    }
];

// Validation rules for CPF
const validateCPF = [
    param('cpf')
        .isLength({ min: 11, max: 11 })
        .withMessage('CPF must be 11 digits')
        .isNumeric()
        .withMessage('CPF must contain only numbers'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        next();
    }
];

module.exports = { validateBed, validateCPF };
```

**Apply validation:**

```javascript
// routes/index.js
const { validateBed, validateCPF } = require('../middleware/validation');

routers.get("/pacientes/internados/:leito", validateBed, getAllPatientsInternedByBed);
routers.get("/users/cpf/:cpf", validateCPF, getAllUsersByCpf);
```

### 2. Sanitize Inputs

```javascript
// Always sanitize user inputs
const sanitize = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};
```

---

## Database Security

### 1. Principle of Least Privilege

**Create dedicated database user with minimal permissions:**

```sql
-- Create application user
CREATE USER healthcare_api IDENTIFIED BY secure_password;

-- Grant only SELECT permission on required tables
GRANT SELECT ON DBASGU.USUARIOS TO healthcare_api;
GRANT SELECT ON PACIENTE TO healthcare_api;
GRANT SELECT ON ATENDIME TO healthcare_api;
GRANT SELECT ON LEITO TO healthcare_api;

-- Do NOT grant:
-- - INSERT, UPDATE, DELETE (unless absolutely necessary)
-- - DBA privileges
-- - Access to other schemas
```

### 2. Connection Security

**Use connection pooling:**

```javascript
// service/dbPool.js
const oracledb = require('oracledb');

let pool;

async function createPool() {
    try {
        pool = await oracledb.createPool({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWD,
            connectString: process.env.ORACLE_CSTRING,
            poolMin: 2,
            poolMax: 10,
            poolIncrement: 1,
            poolTimeout: 60,
            enableStatistics: true
        });
        console.log('Connection pool created');
    } catch (err) {
        console.error('Error creating connection pool:', err);
        throw err;
    }
}

async function closePool() {
    if (pool) {
        try {
            await pool.close(10);
            console.log('Connection pool closed');
        } catch (err) {
            console.error('Error closing pool:', err);
        }
    }
}

function getPool() {
    if (!pool) {
        throw new Error('Pool not created. Call createPool first.');
    }
    return pool;
}

module.exports = { createPool, closePool, getPool };
```

### 3. Protect Credentials

**Never hardcode credentials:**

❌ **Bad:**
```javascript
const user = 'myuser';
const password = 'mypassword123';
```

✅ **Good:**
```javascript
const user = process.env.ORACLE_USER;
const password = process.env.ORACLE_PASSWD;
```

**Use secrets management:**
- AWS Secrets Manager
- Azure Key Vault
- HashiCorp Vault
- Environment variables (minimum)

---

## API Security

### 1. Security Headers

**Install helmet:**

```bash
npm install helmet
```

```javascript
// app.js
const helmet = require('helmet');

// Add security headers
app.use(helmet());

// Or customize
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));
```

### 2. Request Size Limits

```javascript
// app.js
app.use(express.json({ limit: '10kb' })); // Limit request body size
```

### 3. Disable Unnecessary HTTP Methods

```javascript
// middleware/methodFilter.js
const allowedMethods = ['GET', 'POST', 'OPTIONS'];

const methodFilter = (req, res, next) => {
    if (!allowedMethods.includes(req.method)) {
        return res.status(405).json({
            message: 'Method not allowed'
        });
    }
    next();
};

module.exports = { methodFilter };
```

### 4. Hide Technology Stack

```javascript
// app.js
// Remove X-Powered-By header
app.disable('x-powered-by');
```

---

## Logging & Monitoring

### 1. Implement Audit Logging

**Create audit logger:**

```javascript
// utils/auditLogger.js
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/audit.log');

function auditLog(req, action, details = {}) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        userId: req.user?.userId || 'anonymous',
        username: req.user?.username || 'anonymous',
        ip: req.ip || req.connection.remoteAddress,
        action,
        endpoint: req.originalUrl,
        method: req.method,
        userAgent: req.get('user-agent'),
        details
    };

    const logLine = JSON.stringify(logEntry) + '\n';

    fs.appendFile(logFile, logLine, (err) => {
        if (err) console.error('Error writing audit log:', err);
    });
}

module.exports = { auditLog };
```

**Log all access:**

```javascript
// middleware/auditMiddleware.js
const { auditLog } = require('../utils/auditLogger');

const auditMiddleware = (req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        auditLog(req, 'API_ACCESS', {
            statusCode: res.statusCode,
            duration: `${duration}ms`
        });
    });

    next();
};

module.exports = { auditMiddleware };
```

### 2. Remove Sensitive Data from Logs

**Current Issue:**
```javascript
// service/app-oracleget.js - Line 25, 37, 52
console.log(result.rows);  // Logs ALL patient/user data
```

**Solution:**

```javascript
// Log only metadata, not sensitive data
console.log(`Query executed successfully. Rows returned: ${result.rows.length}`);

// If you must log data, mask it first
const maskedData = result.rows.map(row => ({
    ...row,
    CPF: maskCPF(row.CPF),
    NM_PACIENTE: maskName(row.NM_PACIENTE)
}));
console.log(maskedData);
```

### 3. Centralized Logging

**Use Winston for structured logging:**

```bash
npm install winston
```

```javascript
// config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'logs/combined.log'
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;
```

### 4. Monitoring & Alerting

**Set up monitoring for:**
- Failed login attempts
- Unusual access patterns
- High error rates
- Performance degradation
- Database connection failures

**Tools:**
- Prometheus + Grafana
- ELK Stack (Elasticsearch, Logstash, Kibana)
- AWS CloudWatch
- New Relic
- Datadog

---

## Compliance

### LGPD (Lei Geral de Proteção de Dados)

As this application handles Brazilian personal data, LGPD compliance is **mandatory**.

**Requirements:**

1. **Data Minimization**
   - Only collect necessary data
   - Limit data retention

2. **User Rights**
   - Right to access their data
   - Right to data portability
   - Right to deletion
   - Right to correction

3. **Consent Management**
   - Obtain explicit consent
   - Document consent
   - Allow consent withdrawal

4. **Security Measures**
   - Implement technical safeguards
   - Encrypt sensitive data
   - Control access

5. **Breach Notification**
   - Notify authorities within 72 hours
   - Notify affected individuals

**Implementation:**

```javascript
// Implement data subject rights endpoints
routers.get('/users/me/data', authenticateToken, exportMyData);
routers.delete('/users/me', authenticateToken, deleteMyData);
routers.put('/users/me', authenticateToken, updateMyData);
```

### HIPAA Considerations

If this system is used in international contexts or with US healthcare data:

- Implement Business Associate Agreement (BAA)
- Encrypt PHI at rest and in transit
- Maintain audit logs for 6 years
- Implement automatic logoff
- Unique user identification
- Emergency access procedures

---

## Security Checklist

### Pre-Production Checklist

- [ ] **Authentication implemented** (JWT, OAuth, or API keys)
- [ ] **Authorization implemented** (RBAC)
- [ ] **HTTPS/TLS configured** (Let's Encrypt, valid certificate)
- [ ] **CORS restricted** (specific origins only)
- [ ] **Rate limiting enabled** (per IP, per user)
- [ ] **Input validation** (all endpoints)
- [ ] **Security headers** (Helmet.js)
- [ ] **Audit logging** (all access logged)
- [ ] **Sensitive data masked** (in logs and responses)
- [ ] **Database credentials secured** (secrets manager)
- [ ] **Least privilege database user** (minimal permissions)
- [ ] **Connection pooling** (optimized)
- [ ] **Error handling** (no sensitive info in errors)
- [ ] **Dependencies updated** (no known vulnerabilities)
- [ ] **Firewall configured** (minimal ports open)
- [ ] **Monitoring enabled** (alerts configured)
- [ ] **Backup strategy** (tested)
- [ ] **Incident response plan** (documented)
- [ ] **Security testing performed** (penetration testing)
- [ ] **LGPD compliance verified** (data protection officer consulted)

### Regular Security Maintenance

- [ ] **Weekly**: Review access logs for suspicious activity
- [ ] **Monthly**: Update npm dependencies
- [ ] **Monthly**: Review and rotate API keys
- [ ] **Quarterly**: Security audit
- [ ] **Quarterly**: Penetration testing
- [ ] **Annually**: Full security assessment
- [ ] **Annually**: Update SSL certificates

---

## Incident Response

### Security Incident Response Plan

#### 1. Detection & Identification

**Monitor for:**
- Unusual access patterns
- Multiple failed login attempts
- Unexpected data exports
- Database errors
- Performance anomalies

#### 2. Containment

**Immediate actions:**
```bash
# Stop the application
pm2 stop oracledb-api

# Block suspicious IPs
sudo ufw deny from <suspicious-ip>

# Review active sessions
pm2 logs --lines 1000
```

#### 3. Investigation

- Review audit logs
- Check database logs
- Analyze network traffic
- Identify affected data

#### 4. Recovery

- Restore from clean backup if needed
- Patch vulnerabilities
- Update credentials
- Reset tokens

#### 5. Post-Incident

- Document incident
- Notify affected parties (LGPD requirement)
- Update security measures
- Conduct lessons learned

### Emergency Contacts

**Maintain contact list for:**
- Security team lead
- Database administrator
- System administrator
- Legal/compliance officer
- Data protection officer (DPO)

---

## Security Updates

### Keeping Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# For breaking changes
npm audit fix --force
```

### Subscribe to Security Advisories

- **Node.js Security**: https://nodejs.org/en/blog/vulnerability/
- **npm Security Advisories**: https://www.npmjs.com/advisories
- **Oracle Security**: https://www.oracle.com/security-alerts/
- **Express.js**: https://expressjs.com/en/advanced/security-updates.html

---

## Security Resources

### Tools

- **OWASP ZAP** - Web application security scanner
- **Burp Suite** - Security testing
- **nmap** - Network scanning
- **Wireshark** - Network analysis
- **Snyk** - Dependency vulnerability scanning

### Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [LGPD Official Text](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

## Conclusion

Security is not a one-time task but an ongoing process. Regularly review and update security measures, stay informed about new threats, and prioritize the protection of sensitive healthcare data.

**Remember:** With healthcare data, security breaches can have serious legal, financial, and ethical consequences. Invest in security from the start.

For questions or concerns about security, consult with a security professional or contact your organization's security team.

---

**Last Updated:** 2024
**Review Schedule:** Quarterly
**Next Review:** [Set date]
