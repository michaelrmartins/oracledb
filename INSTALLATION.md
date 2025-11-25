# Installation Guide

Complete guide for setting up and deploying the Oracle DB Healthcare API.

## Table of Contents

- [Prerequisites](#prerequisites)
- [System Requirements](#system-requirements)
- [Installation Steps](#installation-steps)
  - [1. Install Node.js](#1-install-nodejs)
  - [2. Install Oracle Instant Client](#2-install-oracle-instant-client)
  - [3. Clone Repository](#3-clone-repository)
  - [4. Install Dependencies](#4-install-dependencies)
  - [5. Configure Environment](#5-configure-environment)
  - [6. Verify Database Connection](#6-verify-database-connection)
- [Running the Application](#running-the-application)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Troubleshooting](#troubleshooting)
- [Verification](#verification)

---

## Prerequisites

Before installing the application, ensure you have:

- [ ] Access to an Oracle Database instance
- [ ] Database credentials (username, password, connection string)
- [ ] System administrator privileges (for installing Oracle Instant Client)
- [ ] Basic knowledge of command line operations

---

## System Requirements

### Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| **Operating System** | Linux, macOS, or Windows |
| **Node.js** | v14.0.0 or higher |
| **RAM** | 2 GB minimum |
| **Disk Space** | 500 MB free space |
| **Network** | Access to Oracle Database |

### Supported Platforms

- **Linux**: Ubuntu 18.04+, CentOS 7+, RHEL 7+
- **macOS**: 10.14 (Mojave) or higher
- **Windows**: Windows 10 or Windows Server 2016+

---

## Installation Steps

### 1. Install Node.js

#### Linux (Ubuntu/Debian)

```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Linux (CentOS/RHEL)

```bash
# Using NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version
```

#### macOS

```bash
# Using Homebrew
brew install node

# Verify installation
node --version
npm --version
```

#### Windows

1. Download installer from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Follow installation wizard
4. Open Command Prompt and verify:

```cmd
node --version
npm --version
```

---

### 2. Install Oracle Instant Client

The Oracle Instant Client is required for the `oracledb` npm package to connect to Oracle databases.

#### Linux (Ubuntu/Debian)

```bash
# Download Oracle Instant Client
cd /opt
sudo mkdir oracle
cd oracle

# Download from Oracle website or use wget (requires Oracle account)
# For this example, we'll use version 23.6
sudo wget https://download.oracle.com/otn_software/linux/instantclient/2360000/instantclient-basic-linux.x64-23.6.0.0.0dbru.zip

# Install unzip if needed
sudo apt-get install unzip

# Extract the archive
sudo unzip instantclient-basic-linux.x64-23.6.0.0.0dbru.zip

# Create symbolic link
sudo ln -s /opt/oracle/instantclient_23_6 /opt/oracle/instantclient

# Add to library path
echo "/opt/oracle/instantclient_23_6" | sudo tee /etc/ld.so.conf.d/oracle-instantclient.conf
sudo ldconfig

# Verify installation
ls -la /opt/oracle/instantclient_23_6
```

#### Linux (CentOS/RHEL)

```bash
# Install required packages
sudo yum install libaio

# Download and install Oracle Instant Client RPM
cd /tmp
wget https://download.oracle.com/otn_software/linux/instantclient/2360000/oracle-instantclient-basic-23.6.0.0.0-1.el8.x86_64.rpm

# Install RPM
sudo rpm -ivh oracle-instantclient-basic-23.6.0.0.0-1.el8.x86_64.rpm

# The default installation path is /usr/lib/oracle/23.6/client64
```

#### macOS

```bash
# Download Oracle Instant Client for macOS
cd ~/Downloads

# Download from Oracle website
# Example for 23.6:
curl -O https://download.oracle.com/otn_software/mac/instantclient/236000/instantclient-basic-macos.x64-23.6.0.0.0dbru.dmg

# Open the DMG file and copy to /opt
sudo mkdir -p /opt/oracle
sudo cp -r instantclient_23_6 /opt/oracle/

# Set environment variables (add to ~/.zshrc or ~/.bash_profile)
echo 'export DYLD_LIBRARY_PATH=/opt/oracle/instantclient_23_6:$DYLD_LIBRARY_PATH' >> ~/.zshrc
source ~/.zshrc
```

#### Windows

1. Download Oracle Instant Client from [Oracle website](https://www.oracle.com/database/technologies/instant-client/downloads.html)
2. Extract to `C:\oracle\instantclient_23_6`
3. Add to PATH:
   - Right-click "This PC" → Properties
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find "Path" and click "Edit"
   - Add `C:\oracle\instantclient_23_6`
   - Click OK

4. Install Visual C++ Redistributable if not already installed:
   - Download from [Microsoft](https://aka.ms/vs/17/release/vc_redist.x64.exe)
   - Run installer

---

### 3. Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd oracledb

# Or if you received a zip file
unzip oracledb.zip
cd oracledb
```

---

### 4. Install Dependencies

```bash
# Install all npm dependencies
npm install

# This will install:
# - express (web framework)
# - oracledb (Oracle database driver)
# - dotenv (environment variables)
# - cors (CORS middleware)
# - nodemon (development tool)
# - pm2 (production process manager)
```

**Expected Output:**
```
added 150 packages, and audited 151 packages in 15s

found 0 vulnerabilities
```

**Troubleshooting npm install:**

If you encounter errors during `npm install`:

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

### 5. Configure Environment

#### Create Environment File

```bash
# Copy the example environment file
cp .env.example .env

# Edit the file
nano .env
# or
vim .env
# or use your preferred editor
```

#### Configure Environment Variables

Edit `.env` file with your specific configuration:

```env
# ============================================
# LOCAL SERVER PARAMETERS
# ============================================
SERVER_ADDRESS=localhost
SERVER_PORT=8073

# ============================================
# ORACLE DB PARAMETERS
# ============================================
ORACLE_USER=your_database_username
ORACLE_PASSWD=your_database_password
ORACLE_CSTRING=your_connection_string
```

#### Connection String Formats

**Basic Format:**
```
hostname:port/service_name
```

**Example:**
```
ORACLE_CSTRING=192.168.1.100:1521/ORCL
```

**TNS Format:**
```
(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=hostname)(PORT=port))(CONNECT_DATA=(SERVICE_NAME=service_name)))
```

**Example:**
```
ORACLE_CSTRING=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.1.100)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=ORCL)))
```

#### Environment Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `SERVER_ADDRESS` | Address where API will listen | `localhost`, `0.0.0.0`, `192.168.1.10` |
| `SERVER_PORT` | Port number for API | `8073`, `3000`, `8080` |
| `ORACLE_USER` | Oracle database username | `dbuser`, `system`, `healthcare_app` |
| `ORACLE_PASSWD` | Oracle database password | `SecurePassword123!` |
| `ORACLE_CSTRING` | Oracle connection string | `localhost:1521/ORCL` |

---

### 6. Verify Database Connection

#### Update Oracle Client Path

Edit `service/app-oracleget.js` if your Oracle Instant Client is in a different location:

```javascript
// Line 4 in app-oracleget.js
oracledb.initOracleClient({
    configdir: '/opt/oracle/instantclient_23_6'  // Update this path
})
```

**Common paths:**
- Linux (Ubuntu/Debian): `/opt/oracle/instantclient_23_6`
- Linux (CentOS/RHEL): `/usr/lib/oracle/23.6/client64`
- macOS: `/opt/oracle/instantclient_23_6`
- Windows: `C:\\oracle\\instantclient_23_6`

#### Test Database Connection

Create a test script `test-connection.js`:

```javascript
const oracledb = require('oracledb');
require('dotenv').config();

oracledb.initOracleClient({
    configdir: '/opt/oracle/instantclient_23_6'
});

async function testConnection() {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWD,
            connectString: process.env.ORACLE_CSTRING
        });
        console.log('✓ Successfully connected to Oracle Database!');

        const result = await connection.execute('SELECT SYSDATE FROM DUAL');
        console.log('✓ Query test successful:', result.rows);

    } catch (err) {
        console.error('✗ Connection failed:', err.message);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

testConnection();
```

Run the test:

```bash
node test-connection.js
```

**Expected Output:**
```
✓ Successfully connected to Oracle Database!
✓ Query test successful: [ [ 2024-01-15T10:30:00.000Z ] ]
```

---

## Running the Application

### Development Mode

Development mode uses `nodemon` to automatically restart the server when files change.

```bash
npm run dev
```

**Expected Output:**
```
[nodemon] 3.1.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`
Server running on: http://localhost:8073
```

### Production Mode

Production mode runs the server with Node.js directly.

```bash
npm start
```

**Expected Output:**
```
Server running on: http://localhost:8073
```

---

## Production Deployment

### Using PM2 (Recommended)

PM2 is a production process manager for Node.js applications with load balancing.

#### Install PM2 Globally

```bash
npm install -g pm2
```

#### Start Application with PM2

```bash
# Start the application
pm2 start server.js --name oracledb-api

# Save PM2 process list
pm2 save

# Set PM2 to start on system boot
pm2 startup
# Follow the instructions displayed
```

#### PM2 Commands

```bash
# View running processes
pm2 list

# Monitor application
pm2 monit

# View logs
pm2 logs oracledb-api

# View specific logs
pm2 logs oracledb-api --lines 100

# Restart application
pm2 restart oracledb-api

# Stop application
pm2 stop oracledb-api

# Delete from PM2
pm2 delete oracledb-api

# View application info
pm2 info oracledb-api
```

#### Cluster Mode (Multiple Instances)

```bash
# Start 4 instances (CPU cores)
pm2 start server.js --name oracledb-api -i 4

# Start max instances (all CPU cores)
pm2 start server.js --name oracledb-api -i max

# Scale up or down
pm2 scale oracledb-api +2  # Add 2 more instances
pm2 scale oracledb-api 2   # Scale to 2 instances
```

### Using Systemd (Linux)

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/oracledb-api.service
```

Add the following content:

```ini
[Unit]
Description=Oracle DB Healthcare API
After=network.target

[Service]
Type=simple
User=your_username
WorkingDirectory=/path/to/oracledb
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=oracledb-api

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable oracledb-api

# Start the service
sudo systemctl start oracledb-api

# Check status
sudo systemctl status oracledb-api

# View logs
sudo journalctl -u oracledb-api -f
```

### Using NGINX as Reverse Proxy

#### Install NGINX

```bash
# Ubuntu/Debian
sudo apt-get install nginx

# CentOS/RHEL
sudo yum install nginx
```

#### Configure NGINX

Create NGINX configuration:

```bash
sudo nano /etc/nginx/sites-available/oracledb-api
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:8073;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/oracledb-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx
```

#### Add SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your_domain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

---

## Docker Deployment

### Create Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine

# Install Oracle Instant Client dependencies
RUN apk add --no-cache libaio libnsl libc6-compat curl

# Create app directory
WORKDIR /usr/src/app

# Download and install Oracle Instant Client
RUN mkdir -p /opt/oracle
WORKDIR /opt/oracle
RUN curl -o instantclient-basic-linux.zip https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip && \
    unzip instantclient-basic-linux.zip && \
    rm instantclient-basic-linux.zip && \
    ln -s /opt/oracle/instantclient* /opt/oracle/instantclient

# Set environment
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient:$LD_LIBRARY_PATH

# Copy application files
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Expose port
EXPOSE 8073

# Start application
CMD [ "node", "server.js" ]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  oracledb-api:
    build: .
    ports:
      - "8073:8073"
    environment:
      - SERVER_ADDRESS=0.0.0.0
      - SERVER_PORT=8073
      - ORACLE_USER=${ORACLE_USER}
      - ORACLE_PASSWD=${ORACLE_PASSWD}
      - ORACLE_CSTRING=${ORACLE_CSTRING}
    restart: unless-stopped
    networks:
      - api-network

networks:
  api-network:
    driver: bridge
```

### Build and Run

```bash
# Build image
docker build -t oracledb-api .

# Run container
docker run -d \
  --name oracledb-api \
  -p 8073:8073 \
  --env-file .env \
  oracledb-api

# Or use docker-compose
docker-compose up -d

# View logs
docker logs -f oracledb-api

# Stop container
docker stop oracledb-api

# Remove container
docker rm oracledb-api
```

---

## Troubleshooting

### Issue: "Cannot find module 'oracledb'"

**Solution:**
```bash
npm install oracledb
```

### Issue: "DPI-1047: Cannot locate a 64-bit Oracle Client library"

**Possible Causes:**
- Oracle Instant Client not installed
- Wrong path configured
- Library not in system path

**Solution:**

**Linux:**
```bash
# Verify installation
ls -la /opt/oracle/instantclient_23_6

# Update library path
echo "/opt/oracle/instantclient_23_6" | sudo tee /etc/ld.so.conf.d/oracle-instantclient.conf
sudo ldconfig

# Verify
ldconfig -p | grep oracle
```

**macOS:**
```bash
# Set library path
export DYLD_LIBRARY_PATH=/opt/oracle/instantclient_23_6:$DYLD_LIBRARY_PATH

# Add to shell profile
echo 'export DYLD_LIBRARY_PATH=/opt/oracle/instantclient_23_6:$DYLD_LIBRARY_PATH' >> ~/.zshrc
```

**Windows:**
- Add `C:\oracle\instantclient_23_6` to PATH
- Restart terminal/command prompt

### Issue: "ORA-12170: TNS:Connect timeout occurred"

**Possible Causes:**
- Database not accessible
- Firewall blocking connection
- Wrong connection string

**Solution:**
```bash
# Test network connectivity
ping database_host

# Test Oracle port
telnet database_host 1521

# Verify connection string format
# Should be: hostname:port/service_name
```

### Issue: "EADDRINUSE: Address already in use"

**Possible Causes:**
- Port 8073 already in use
- Another instance running

**Solution:**
```bash
# Linux/macOS - Find process using port
lsof -i :8073
# Kill the process
kill -9 <PID>

# Windows - Find process
netstat -ano | findstr :8073
# Kill process
taskkill /PID <PID> /F

# Or change port in .env file
SERVER_PORT=8080
```

### Issue: "Connection refused to Oracle Database"

**Solution:**
1. Verify Oracle Database is running
2. Check firewall rules
3. Verify credentials in `.env`
4. Test connection with SQL*Plus:
```bash
sqlplus username/password@connection_string
```

### Issue: Module not found errors after npm install

**Solution:**
```bash
# Remove and reinstall
rm -rf node_modules package-lock.json
npm install

# If still failing, check Node.js version
node --version
# Should be v14.0.0 or higher

# Update npm
npm install -g npm@latest
```

---

## Verification

### Test All Endpoints

```bash
# Base URL
BASE_URL="http://localhost:8073/api"

# Test user endpoints
curl $BASE_URL/users
curl $BASE_URL/users/CPF
curl $BASE_URL/users/cpf/12345678900

# Test patient endpoints
curl $BASE_URL/pacientes/internados
curl $BASE_URL/pacientes/internados/101
```

### Check Server Health

```bash
# Check if server is running
ps aux | grep node

# Check port is listening
netstat -an | grep 8073

# Check logs
# If using PM2:
pm2 logs oracledb-api

# If using systemd:
sudo journalctl -u oracledb-api -f
```

---

## Next Steps

After successful installation:

1. **Read the API Documentation** - [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. **Review Security Guidelines** - [SECURITY.md](./SECURITY.md)
3. **Understand the Architecture** - [ARCHITECTURE.md](./ARCHITECTURE.md)
4. **Set up monitoring** - Implement logging and monitoring solutions
5. **Configure backups** - Set up regular database backups
6. **Security hardening** - Implement authentication and HTTPS

---

## Support

For additional help:
- Review [Troubleshooting](#troubleshooting) section
- Check [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
- Consult Oracle documentation for database-specific issues
- Check Node.js and npm documentation for runtime issues

---

**Installation complete! Your Oracle DB Healthcare API is ready to use.**
