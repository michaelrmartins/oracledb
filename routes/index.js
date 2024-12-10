// Router - Index

const express = require('express')
const routers = express.Router()

const { getAllUsers, getAllUsersByParameter, getAllUsersByCpf } = require("../controllers/controllerGetData") 

// Routes
routers.get("/users", getAllUsers)
routers.get("/users/:parameter", getAllUsersByParameter)
routers.get("/users/cpf/:cpf", getAllUsersByCpf)

module.exports = routers;