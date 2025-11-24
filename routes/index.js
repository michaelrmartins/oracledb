// Router - Index

const express = require('express')
const routers = express.Router()

const { getAllUsers, getAllUsersByParameter, getAllUsersByCpf } = require("../controllers/controllerGetData") 
const { getAllPatientsInterned, getAllPatientsInternedByBed } = require("../controllers/controllerGetPatientsData") 

// Routes for Users
routers.get("/users", getAllUsers)
routers.get("/users/:parameter", getAllUsersByParameter)
routers.get("/users/cpf/:cpf", getAllUsersByCpf)

// Routes for patients
routers.get("/pacientes/internados", getAllPatientsInterned)
routers.get("/pacientes/internados/:leito", getAllPatientsInternedByBed)

module.exports = routers;