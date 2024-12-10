// Controller - GetData 

const { serviceOracleGetUsers } = require('../service/app-oracleget')

// Return data from all users
const getAllUsers = async ( req, resp) => {
    returnUsersData = await serviceOracleGetUsers()
    const returnUsersDataCpfs = returnUsersData.map(user => user)
    resp.status(200).send(returnUsersDataCpfs)
}

// Return data by user parameter
const getAllUsersByParameter = async ( req, resp) => {
    returnUsersData = await serviceOracleGetUsers()
    const userParameter = req.params.parameter
    const returnUsersDataCpfs = returnUsersData.map(user => user[userParameter])
    resp.status(200).send(returnUsersDataCpfs)
}

// Return user data by cpf
const getAllUsersByCpf = async ( req, resp) => {
    returnUsersData = await serviceOracleGetUsers()
    const userCPF = req.params.cpf
    const returnUsersDataCpfs = returnUsersData
    .filter( filtered => filtered.CPF === userCPF)
    .map(user => user)
    resp.status(200).send(returnUsersDataCpfs)
}

module.exports = {
    getAllUsers,
    getAllUsersByParameter,
    getAllUsersByCpf
}