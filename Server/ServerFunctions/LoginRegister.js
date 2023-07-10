const {dbConn} = require('../../Config/db.config');
const bcrypt = require('bcrypt')
const {generateJWT, InsertToken} = require('../JWT/Token')
const jwt = require('jsonwebtoken');
const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
})


const saltRounds = 10;

function Login(req,res){
    const user = req.body.UserName;
    const Password = req.body.Password;//add use of password
    console.log(user + " "+ Password)

    //database query
    dbConn.query("SELECT * FROM Users WHERE UserName = ?", [user], function (err, rows) {

        //if an error occures
        if (err) {
            const error = "there was an issue with your username or password";
            res.render('Login', { error });
        }
        else {
            if (rows.length == 1) {
                bcrypt.compare(Password, rows[0].Password, function (err, result) {
                    if (result == true) {//if logged in is successful
                        console.log(rows[0].FirstName);
                        const tokenOBJ = {name: rows[0].FirstName}
                        const accessToken = generateJWT(tokenOBJ)
                        const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRETE)

                        //InsertToken(refreshToken)
                        res.json({accessToken: accessToken, refreshToken: refreshToken})
                    } else {
                        res.json({"response":"bad"});//this is wrong
                    }
                });

            } else {//could not find user or password wrong
                res.json({"response":"bad"});//this is wrong
            }
        }

    });
}
function SignUp(req,res){
    const UserName = req.body.UserName;
    const Password = req.body.Password;

    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    

    //encrypt 
    bcrypt.hash(Password, saltRounds, function (err, hash) {
        //database query
        dbConn.query("INSERT INTO Users (UserName,Password,FirstName,LastName) VALUES (?,?,?,?)", [UserName, hash, FirstName, LastName], function (err, result) {

            //if an error occures
            if (err) {
                console.log(err)
                const error = "User Taken";
                res.json({"response":"User Taken"})
            } else {//register user
                const error = "Signed in"
                console.log("Data inserted");
                res.json({"response":"Inserted"})
            }
        });
    });
}


module.exports = {SignUp, Login};