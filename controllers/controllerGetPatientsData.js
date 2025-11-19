// Controller - Get Patients Data 

const { serviceOracleGetPatientsInterned } = require('../service/app-oracleget')

// Return data from all interned patients
const getAllPatientsInterned = async ( req, res) => {
    returnPatientsData = await serviceOracleGetPatientsInterned() 
    const returnPatientsInternetData = returnPatientsData
    res.status(200).send(returnPatientsInternetData)
}

module.exports = {
getAllPatientsInterned
}