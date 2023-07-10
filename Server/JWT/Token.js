const jwt = require('jsonwebtoken');
const {dbConn} = require('../../Config/db.config');
const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
})

function generateJWT(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRETE,{expiresIn:'12h'})
}

function InsertToken(token){

    //database query
    dbConn.query("INSERT INTO RefreshToken (RefreshToken) VALUES (?)", [token], function (err, result) {

        //if an error occures
        if (err) {
            return "error"
        } else {//register user
            return "inserted"
        }
    });
    
}

module.exports = {generateJWT,InsertToken}