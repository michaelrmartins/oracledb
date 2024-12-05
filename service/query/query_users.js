// -- Retorna código do usuário, nome, CPF, se já fez o primeiro login, se está ativo ou não.


const querySelectUsers = `
SELECT cd_usuario, nm_usuario ,CPF, sn_senha_plogin, sn_ativo FROM DBASGU.USUARIOS
WHERE SN_ATIVO = 'S'
  AND CPF IS NOT NULL
  -- AND SN_SENHA_PLOGIN = 'S'
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
ORDER BY CD_USUARIO asc
`; // End Query

module.exports = {
  querySelectUsers
  
}