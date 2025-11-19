// Query to select all interned patients

const querySelectPatientsInterned = `
SELECT paciente.nm_paciente,paciente.dt_nascimento,atendime.dt_atendimento ,leito.ds_leito,leito.cd_leito 
FROM atendime
inner JOIN paciente ON paciente.cd_paciente = atendime.cd_paciente
INNER JOIN leito ON leito.cd_leito = atendime.cd_leito

WHERE atendime.tp_atendimento = 'I'
AND   atendime.dt_alta IS NULL

`; // End Query

module.exports = {
querySelectPatientsInterned

}