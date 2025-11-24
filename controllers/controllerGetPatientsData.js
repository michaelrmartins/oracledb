// Controller - Get Patients Data 

const { serviceOracleGetPatientsInterned, serviceOracleGetPatientsInternedByBed } = require('../service/app-oracleget')

// Return data from all interned patients
const getAllPatientsInterned = async ( req, res) => {
    returnPatientsData = await serviceOracleGetPatientsInterned() 
    const returnPatientsInternetData = returnPatientsData
    res.status(200).send(returnPatientsInternetData)
}

// return data from interned patients by bed
const getAllPatientsInternedByBed = async ( req, res) => {
    const leito = req.params.leito
    if (isNaN(leito)) {return res.status(400).send({ message: "error: Bed parameter must be a number." })}
    if (leito <= 0) {return res.status(400).send({ message: "error: Bed parameter must be greater than zero." })}
    if (leito > 9999) {return res.status(400).send({ message: "error: Bed parameter must be less than 9999." })}
    if (leito === undefined) {return res.status(400).send({ message: "error: Bed parameter is required." })}
    console.log(`Bed parameter received: ${leito}`)
    returnPatientsData = await serviceOracleGetPatientsInternedByBed(leito) 
    const returnPatientsInternetData = returnPatientsData
    res.status(200).send(returnPatientsInternetData)
}

module.exports = {
getAllPatientsInterned,
getAllPatientsInternedByBed
}