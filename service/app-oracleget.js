// Oracle default example

const oracledb = require('oracledb');
oracledb.initOracleClient({configdir: '/opt/oracle/instantclient_23_6'})

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const mypw = "trevo48folhas"

async function run() {

    const connection = await oracledb.getConnection ({
        user          : "zabbixmv",
        password      : mypw,
        connectString : "producao.world"
    });

    const result = await connection.execute(
        `SELECT CD_USUARIO, CPF
FROM DBASGU.USUARIOS
WHERE SN_ATIVO = 'S'
  AND CPF IS NOT NULL
  AND (
        CD_USUARIO NOT LIKE '0%' AND
        CD_USUARIO NOT LIKE '1%' AND
        CD_USUARIO NOT LIKE '2%' AND
        CD_USUARIO NOT LIKE '3%' AND
        CD_USUARIO NOT LIKE '4%' AND
        CD_USUARIO NOT LIKE '5%' AND
        CD_USUARIO NOT LIKE '6%' AND
        CD_USUARIO NOT LIKE '7%' AND
        CD_USUARIO NOT LIKE '8%' AND
        CD_USUARIO NOT LIKE '9%'
      )
ORDER BY CD_USUARIO asc`
    );

    console.log(result.rows);
    await connection.close();
}

run();
