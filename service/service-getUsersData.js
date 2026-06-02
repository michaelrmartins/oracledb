// Oracle default example

const oracledb = require('oracledb');
oracledb.initOracleClient({configdir: '/opt/oracle/instantclient_23_6'})
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const Dotenv = require('dotenv')
Dotenv.config()

const { querySelectAllUsers, 
        querySelectActiveUsers,
        querySelectInactiveUsers  } = require('./query/query_users')

const oracleUser = process.env.ORACLE_USER
const oraclePasswd = process.env.ORACLE_PASSWD
const oracleCstring = process.env.ORACLE_CSTRING

// Service - Get all users
async function serviceOracleGetAllUsers() {

    const connection = await oracledb.getConnection ({
        user          : oracleUser,
        password      : oraclePasswd,
        connectString : oracleCstring
    });
    const result = await connection.execute(querySelectAllUsers);
    console.log(result.rows);
    await connection.close();
    return result.rows
};

// Service - Get all users
async function serviceOracleGetAllActiveUsers() {

    const connection = await oracledb.getConnection ({
        user          : oracleUser,
        password      : oraclePasswd,
        connectString : oracleCstring
    });
    const result = await connection.execute(querySelectActiveUsers);
    console.log(result.rows);
    await connection.close();
    return result.rows
};

// Service - Get all inactive users
async function serviceOracleGetAllInactiveUsers() {

    const connection = await oracledb.getConnection ({
        user          : oracleUser,
        password      : oraclePasswd,
        connectString : oracleCstring
    });
    const result = await connection.execute(querySelectInactiveUsers);
    console.log(result.rows);
    await connection.close();
    return result.rows
};

 module.exports = {
    serviceOracleGetAllUsers,
    serviceOracleGetAllActiveUsers,
    serviceOracleGetAllInactiveUsers
}