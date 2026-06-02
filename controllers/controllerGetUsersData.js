// Controller - GetData 

const { serviceOracleGetAllUsers, 
        serviceOracleGetAllActiveUsers,
        serviceOracleGetAllInactiveUsers
 } = require('../service/service-getUsersData')

// Return data from all users
const controllerGetAllUsers = async ( req, resp) => {
    returnUsersData = await serviceOracleGetAllUsers()
    const returnUsersDataCpfs = returnUsersData.map(user => user)
    resp.status(200).send(returnUsersDataCpfs)
}


//return data from all active users
const controllerGetAllActiveUsers = async ( req, resp) => {
    returnUsersData = await serviceOracleGetAllActiveUsers()
    const returnUsersDataCpfs = returnUsersData.map(user => user)
    resp.status(200).send(returnUsersDataCpfs)
}

//return data from all inactive users
const controllerGetAllInactiveUsers = async ( req, resp) => {
    returnUsersData = await serviceOracleGetAllInactiveUsers()
    const returnUsersDataCpfs = returnUsersData.map(user => user)
    resp.status(200).send(returnUsersDataCpfs)
}

// Return data by user parameter
const controllerGetAllUsersByParameter = async ( req, resp) => {
    returnUsersData = await serviceOracleGetAllUsers()
    const userParameter = req.params.parameter
    const returnUsersDataCpfs = returnUsersData.map(user => user[userParameter])
    resp.status(200).send(returnUsersDataCpfs)
}

// Return user data by cpf
const controllerGetAllUsersByCpf = async ( req, resp) => {
    returnUsersData = await serviceOracleGetAllUsers()
    const userCPF = req.params.cpf
    const returnUsersDataCpfs = returnUsersData
    .filter( filtered => filtered.CPF === userCPF)
    .map(user => user)
    resp.status(200).send(returnUsersDataCpfs)
}

module.exports = {
    controllerGetAllUsers,
    controllerGetAllActiveUsers,
    controllerGetAllInactiveUsers,
    controllerGetAllUsersByParameter,
    controllerGetAllUsersByCpf
}