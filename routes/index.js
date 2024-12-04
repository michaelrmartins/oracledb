// Router - Index

const express = require('express')
const routers = express.Router()

const { getUsers } = require("../controllers/controllerGetData") 

// Routes
routers.use("/users", getUsers)
routers.use("/leitos", (req, resp) => resp.status(200).send("Wellcome leitos page"))
routers.use("/admin", (req, resp) => resp.status(200).send("Wellcome Admin page"))

module.exports = routers;