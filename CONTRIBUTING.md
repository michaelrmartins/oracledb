# Contributing Guide

Welcome! This guide will help you contribute to the Oracle DB Healthcare API project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Git Workflow](#git-workflow)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)
- [Adding New Features](#adding-new-features)
- [Bug Reports](#bug-reports)
- [Questions](#questions)

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- [ ] Read the [README.md](./README.md)
- [ ] Completed the [INSTALLATION.md](./INSTALLATION.md) setup
- [ ] Reviewed the [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ ] Understood [SECURITY.md](./SECURITY.md) guidelines
- [ ] Set up your development environment
- [ ] Installed all dependencies

### Development Environment Setup

```bash
# Clone the repository
git clone <repository-url>
cd oracledb

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure .env with your settings
nano .env

# Run in development mode
npm run dev
```

---

## Development Workflow

### 1. Choose an Issue

- Browse [existing issues](#) or create a new one
- Comment on the issue to express interest
- Wait for approval before starting work

### 2. Create a Feature Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 3. Make Changes

- Write clean, maintainable code
- Follow code standards (see below)
- Add comments where necessary
- Update documentation if needed

### 4. Test Your Changes

```bash
# Test manually
npm run dev

# Test all endpoints
curl http://localhost:8073/api/users
curl http://localhost:8073/api/pacientes/internados
```

### 5. Commit Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add user authentication middleware"
```

### 6. Push and Create Pull Request

```bash
# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

---

## Code Standards

### JavaScript Style Guide

#### 1. Naming Conventions

```javascript
// Variables and functions: camelCase
const userName = 'John';
const getUserData = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = '/api';

// Classes: PascalCase
class UserController {}

// Private variables: prefix with underscore
const _privateVariable = 'private';
```

#### 2. Function Declarations

```javascript
// Prefer async/await over promises
// ✅ Good
async function getUsers() {
    const users = await serviceOracleGetUsers();
    return users;
}

// ❌ Avoid
function getUsers() {
    return serviceOracleGetUsers().then(users => users);
}
```

#### 3. Error Handling

```javascript
// Always handle errors
async function getUserData(req, res) {
    try {
        const users = await serviceOracleGetUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            message: 'Failed to fetch users'
        });
    }
}
```

#### 4. Code Comments

```javascript
// Use comments for complex logic only
// ✅ Good - explains why
// Exclude users starting with numbers (system accounts)
const filteredUsers = users.filter(user =>
    !user.CD_USUARIO.match(/^[0-9]/)
);

// ❌ Bad - explains what (code is self-explanatory)
// Loop through users
users.forEach(user => {
    // Print user name
    console.log(user.name);
});
```

#### 5. File Structure

```javascript
// Order of sections in a file:
// 1. Imports/requires
const express = require('express');
const { serviceOracleGetUsers } = require('../service/app-oracleget');

// 2. Constants
const MAX_USERS = 100;

// 3. Helper functions
const validateUser = (user) => { /* ... */ };

// 4. Main functions
const getAllUsers = async (req, res) => { /* ... */ };

// 5. Exports
module.exports = { getAllUsers };
```

### SQL Style Guide

```sql
-- Use uppercase for keywords
-- Use lowercase for identifiers
-- Indent for readability
SELECT
    paciente.cd_paciente,
    paciente.nm_paciente,
    atendime.dt_atendimento
FROM
    atendime
    INNER JOIN paciente ON paciente.cd_paciente = atendime.cd_paciente
WHERE
    atendime.tp_atendimento = 'I'
    AND atendime.dt_alta IS NULL
ORDER BY
    atendime.dt_atendimento DESC;
```

### Code Quality Tools

#### ESLint (Recommended)

```bash
# Install ESLint
npm install --save-dev eslint

# Initialize ESLint
npx eslint --init

# Run ESLint
npx eslint .

# Fix auto-fixable issues
npx eslint . --fix
```

**.eslintrc.js example:**

```javascript
module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        'indent': ['error', 4],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'no-console': 'off', // Allow console in Node.js
        'no-unused-vars': 'warn',
    },
};
```

#### Prettier (Optional)

```bash
# Install Prettier
npm install --save-dev prettier

# Create .prettierrc
echo '{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 4,
  "trailingComma": "es5"
}' > .prettierrc

# Format code
npx prettier --write .
```

---

## Git Workflow

### Branch Naming

Use descriptive branch names:

```
feature/add-authentication
feature/patient-search
fix/cpf-validation
fix/connection-pool
docs/api-documentation
refactor/controller-layer
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```bash
git commit -m "feat: add JWT authentication middleware"
git commit -m "fix: correct bed validation logic"
git commit -m "docs: update API documentation for new endpoints"
git commit -m "refactor: extract database connection to separate module"
git commit -m "test: add unit tests for user controller"
git commit -m "chore: update dependencies"
```

**Good commit messages:**
```
✅ feat: add rate limiting to API endpoints
✅ fix: handle null CPF values in user query
✅ docs: add security guidelines to README
```

**Bad commit messages:**
```
❌ update
❌ fixed bug
❌ changes
❌ asdf
```

### Keep Commits Atomic

```bash
# ✅ Good - one logical change per commit
git commit -m "feat: add user authentication"
git commit -m "docs: update README with auth instructions"
git commit -m "test: add auth middleware tests"

# ❌ Bad - multiple unrelated changes
git commit -m "add auth, fix bug, update docs"
```

---

## Testing

### Manual Testing

Before submitting a PR, test all affected endpoints:

```bash
# Start server
npm run dev

# Test endpoints
curl -X GET http://localhost:8073/api/users
curl -X GET http://localhost:8073/api/users/CPF
curl -X GET http://localhost:8073/api/users/cpf/12345678900
curl -X GET http://localhost:8073/api/pacientes/internados
curl -X GET http://localhost:8073/api/pacientes/internados/101

# Test error cases
curl -X GET http://localhost:8073/api/pacientes/internados/abc  # Should return 400
curl -X GET http://localhost:8073/api/pacientes/internados/0    # Should return 400
```

### Testing Checklist

- [ ] All endpoints respond correctly
- [ ] Error cases return appropriate status codes
- [ ] Invalid inputs are handled gracefully
- [ ] Database queries execute without errors
- [ ] No sensitive data logged to console
- [ ] Performance is acceptable
- [ ] No breaking changes to existing endpoints

### Unit Testing (Future)

**Recommended setup:**

```bash
# Install testing framework
npm install --save-dev jest supertest

# Create test file
touch controllers/controllerGetData.test.js
```

**Example test:**

```javascript
// controllers/controllerGetData.test.js
const request = require('supertest');
const app = require('../app');

describe('GET /api/users', () => {
    it('should return 200 OK', async () => {
        const response = await request(app).get('/api/users');
        expect(response.statusCode).toBe(200);
    });

    it('should return array of users', async () => {
        const response = await request(app).get('/api/users');
        expect(Array.isArray(response.body)).toBe(true);
    });
});
```

---

## Documentation

### When to Update Documentation

Update documentation when you:

- Add new endpoints
- Change endpoint behavior
- Add new features
- Modify configuration
- Change database schema
- Update dependencies

### Documentation Standards

#### API Documentation

When adding a new endpoint, document:

1. **Endpoint path and method**
2. **Description**
3. **Parameters** (path, query, body)
4. **Request example**
5. **Response example**
6. **Error responses**
7. **Status codes**

**Example:**

```markdown
### Get User by ID

Retrieves a single user by their unique identifier.

**Endpoint:** `GET /api/users/:id`

**Parameters:**
- `id` (path, required): User ID

**Request:**
```bash
curl http://localhost:8073/api/users/123
```

**Response (200 OK):**
```json
{
    "CD_USUARIO": "JOHN.DOE",
    "NM_USUARIO": "John Doe",
    "CPF": "12345678900"
}
```

**Error Response (404 Not Found):**
```json
{
    "message": "User not found"
}
```
```

#### Code Documentation

```javascript
/**
 * Retrieves all active users from the database
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with user array
 *
 * @example
 * GET /api/users
 * Response: [{ CD_USUARIO: "john.doe", NM_USUARIO: "John Doe", ... }]
 */
const getAllUsers = async (req, res) => {
    // Implementation
};
```

---

## Pull Request Process

### Before Creating a PR

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Commits are clean and descriptive
- [ ] Branch is up to date with main
- [ ] No merge conflicts

### Creating a Pull Request

1. **Push your branch:**
```bash
git push origin feature/your-feature-name
```

2. **Create PR on GitHub** with this template:

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Added authentication middleware
- Updated user controller
- Added tests for new features

## Testing
- [ ] Tested manually
- [ ] All endpoints working
- [ ] Error cases handled

## Related Issue
Closes #123

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings introduced
```

### PR Title Format

```
feat: add user authentication system
fix: correct bed validation in patient endpoint
docs: update installation guide
refactor: improve database connection handling
```

---

## Code Review Guidelines

### As a Reviewer

**What to look for:**

1. **Functionality**
   - Does the code work as intended?
   - Are edge cases handled?

2. **Code Quality**
   - Is the code readable?
   - Are there code smells?
   - Is it maintainable?

3. **Security**
   - Are there security vulnerabilities?
   - Is input validated?
   - Are credentials protected?

4. **Performance**
   - Are there performance issues?
   - Can it be optimized?

5. **Documentation**
   - Is the code documented?
   - Is API documentation updated?

**Giving Feedback:**

```markdown
✅ Good feedback:
"Consider using parameterized queries here to prevent SQL injection.
Example: connection.execute(query, [param])"

❌ Bad feedback:
"This is wrong"
```

**Be constructive:**
- Point out both good and bad
- Suggest improvements
- Ask questions for clarification

### As a Contributor

**Receiving Feedback:**

- Don't take it personally
- Ask for clarification if needed
- Respond to all comments
- Make requested changes promptly

**Resolving Comments:**

- Address each comment
- Reply when you've made changes
- Explain if you disagree (politely)
- Request re-review when ready

---

## Adding New Features

### Process for Adding New Endpoints

#### 1. Create SQL Query

**File:** `service/query/query_your_feature.js`

```javascript
const queryGetYourData = `
SELECT
    column1,
    column2
FROM
    your_table
WHERE
    condition = :param
`;

module.exports = { queryGetYourData };
```

#### 2. Add Service Function

**File:** `service/app-oracleget.js`

```javascript
// Import query
const { queryGetYourData } = require('./query/query_your_feature');

// Add service function
async function serviceGetYourData(param) {
    const connection = await oracledb.getConnection({
        user: oracleUser,
        password: oraclePasswd,
        connectString: oracleCstring
    });

    const result = await connection.execute(queryGetYourData, [param]);
    console.log(`Query returned ${result.rows.length} rows`);
    await connection.close();
    return result.rows;
}

// Export
module.exports = {
    // ... existing exports
    serviceGetYourData
};
```

#### 3. Create Controller

**File:** `controllers/controllerYourFeature.js`

```javascript
const { serviceGetYourData } = require('../service/app-oracleget');

const getYourData = async (req, res) => {
    try {
        const param = req.params.param;

        // Validate input
        if (!param) {
            return res.status(400).json({
                message: 'Parameter is required'
            });
        }

        // Get data
        const data = await serviceGetYourData(param);

        // Send response
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};

module.exports = { getYourData };
```

#### 4. Add Route

**File:** `routes/index.js`

```javascript
// Import controller
const { getYourData } = require('../controllers/controllerYourFeature');

// Add route
routers.get("/your-endpoint/:param", getYourData);
```

#### 5. Test

```bash
# Manual test
curl http://localhost:8073/api/your-endpoint/test-param

# Test error cases
curl http://localhost:8073/api/your-endpoint/
```

#### 6. Document

Add to `API_DOCUMENTATION.md`:

```markdown
### Get Your Data

**Endpoint:** `GET /api/your-endpoint/:param`

**Description:** Brief description

**Parameters:**
- `param` (required): Description

**Response Example:**
[...]
```

---

## Bug Reports

### Reporting Bugs

**Before reporting:**
1. Check if bug already reported
2. Verify it's reproducible
3. Gather information

**Bug report template:**

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: Ubuntu 20.04
- Node.js: v18.0.0
- Oracle DB: 19c

**Error Logs**
```
[Paste error logs here]
```

**Additional Context**
Any other relevant information
```

### Fixing Bugs

1. Create issue if not exists
2. Create branch: `fix/bug-description`
3. Fix the bug
4. Add test to prevent regression
5. Submit PR referencing issue

---

## Questions

### Where to Ask Questions

1. **Technical questions**: Create a discussion on GitHub
2. **Security concerns**: Email security team directly
3. **Bug reports**: Create an issue
4. **Feature requests**: Create an issue with `enhancement` label

### Getting Help

- Review documentation first
- Search existing issues
- Provide context and details
- Be patient and respectful

---

## Development Best Practices

### Security First

- **Never commit credentials**
- **Always validate input**
- **Use parameterized queries**
- **Review [SECURITY.md](./SECURITY.md)** before coding

### Performance Considerations

- **Use connection pooling** for database
- **Avoid N+1 queries**
- **Index database properly**
- **Cache when appropriate**

### Code Organization

```
controllers/    - Business logic, request/response handling
service/        - Data access layer
service/query/  - SQL queries
routes/         - Route definitions
middleware/     - Reusable middleware
utils/          - Utility functions
config/         - Configuration files
```

---

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes

**Example:**
- `1.0.0` → `2.0.0` (breaking change)
- `1.0.0` → `1.1.0` (new feature)
- `1.0.0` → `1.0.1` (bug fix)

---

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing! 🎉

---

## Additional Resources

- [README.md](./README.md) - Project overview
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [INSTALLATION.md](./INSTALLATION.md) - Setup guide
- [SECURITY.md](./SECURITY.md) - Security guidelines

---

**Questions?** Feel free to ask! We're here to help.
