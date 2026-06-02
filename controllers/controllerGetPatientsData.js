// Controller - Get Patients Data 

const { serviceOracleGetPatientsInterned, serviceOracleGetPatientsInternedByBed } = require('../service/service-getPatientsData.js')

// Return data from all interned patients
const getAllPatientsInterned = async (req, res) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });
    const returnPatientsData = await serviceOracleGetPatientsInterned();
    res.status(200).send(returnPatientsData);
};

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
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });
    res.status(200).send(returnPatientsInternetData)
}

module.exports = {
getAllPatientsInterned,
getAllPatientsInternedByBed
}