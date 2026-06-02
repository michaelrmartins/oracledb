// Router - Index

const express = require('express')
const routers = express.Router()

const { controllerGetAllUsers,
        controllerGetAllActiveUsers,
        controllerGetAllInactiveUsers,
        controllerGetAllUsersByParameter,
        controllerGetAllUsersByCpf
        } = require("../controllers/controllerGetUsersData") 

const { getAllPatientsInterned, getAllPatientsInternedByBed } = require("../controllers/controllerGetPatientsData") 

// Route for root path
routers.get("/", (req, res) => {
    res.status(200).send({ message: "Oracle API is Running" })
});

// Routes for Users
routers.get("/users", controllerGetAllUsers)
routers.get("/users/actives", controllerGetAllActiveUsers)
routers.get("/users/inactives", controllerGetAllInactiveUsers)
routers.get("/users/:parameter", controllerGetAllUsersByParameter)
routers.get("/users/cpf/:cpf", controllerGetAllUsersByCpf)

// Routes for patients
routers.get("/pacientes/internados", getAllPatientsInterned)
routers.get("/pacientes/internados/:leito", getAllPatientsInternedByBed)

module.exports = routers;