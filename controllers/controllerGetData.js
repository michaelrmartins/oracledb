// Controller - GetData 

const getUsers = async ( req, resp) => {
    resp.status(200).send("Controller get Users")
}

module.exports = {
    getUsers
}