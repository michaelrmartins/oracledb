// Start core file configuration

const express = require('express')
const app = express()
const routes = require('./routes/index.js')
// const cors = require('cors')

// Enable Express to use json
app.use(express.json())

// // Enable access from any origin !!! DANGER - REMOVE IN PRODUCTION  
// app.use (cors(

//     {
//         origin: '*'
//     }
// ));

// console.log(routes)

app.use("/api", routes)

module.exports = app;