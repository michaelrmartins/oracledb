// Oracle default example

const oracledb = require('oracledb');
oracledb.initOracleClient({configdir: '/opt/oracle/instantclient_23_6'})
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const Dotenv = require('dotenv')
Dotenv.config()

const { querySelectUsers } = require('./query/query_users')

const oracleUser = process.env.ORACLE_USER
const oraclePasswd = process.env.ORACLE_PASSWD
const oracleCstring = process.env.ORACLE_CSTRING

async function serviceOracleGetUsers() {

    const connection = await oracledb.getConnection ({
        user          : oracleUser,
        password      : oraclePasswd,
        connectString : oracleCstring
    });

    const result = await connection.execute(querySelectUsers);

    console.log(result.rows);
    await connection.close();
    return result.rows

}

module.exports = {
    serviceOracleGetUsers
}