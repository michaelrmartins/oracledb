// Model query para consulta de usuários.

const baseQuerySelectUsers = `
SELECT 
  cd_usuario, 
  nm_usuario, 
  CPF, 
  sn_senha_plogin, 
  sn_ativo 
FROM 
  DBASGU.USUARIOS 
WHERE 
  (
    CD_USUARIO NOT LIKE '0%' 
    AND CD_USUARIO NOT LIKE '1%' 
    AND CD_USUARIO NOT LIKE '2%' 
    AND CD_USUARIO NOT LIKE '3%' 
    AND CD_USUARIO NOT LIKE '4%' 
    AND CD_USUARIO NOT LIKE '5%' 
    AND CD_USUARIO NOT LIKE '6%' 
    AND CD_USUARIO NOT LIKE '7%' 
    AND CD_USUARIO NOT LIKE '8%' 
    AND CD_USUARIO NOT LIKE '9%'
  ) 
  AND CPF IS NOT NULL`;

// -- Retorna código do usuário, nome, CPF, se já fez o primeiro login de todos os usuários.
const querySelectAllUsers = `
${baseQuerySelectUsers}
ORDER BY CD_USUARIO asc
`; // End Query

// -- Retorna código do usuário, nome, CPF, se já fez o primeiro login dos usuários ativos.
const querySelectActiveUsers = `
${baseQuerySelectUsers}
  AND SN_ATIVO = 'S'
ORDER BY CD_USUARIO asc
`; // End Query

// -- Retorna código do usuário, nome, CPF, se já fez o primeiro login dos usuários inativos.
const querySelectInactiveUsers = `
${baseQuerySelectUsers}
  AND SN_ATIVO = 'N'
ORDER BY CD_USUARIO asc
`; // End Query

module.exports = {
  querySelectAllUsers,
  querySelectActiveUsers,
  querySelectInactiveUsers
  
}