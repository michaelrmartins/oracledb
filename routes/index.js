// Router - Index

const express = require('express')
const routers = express.Router()

const { getAllUsers, getAllUsersByParameter } = require("../controllers/controllerGetData") 

// Routes
routers.get("/users", getAllUsers)
routers.get("/users/:parameter", getAllUsersByParameter)

module.exports = routers;