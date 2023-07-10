//require statements
const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
})
const {sendEmail} = require('./Email/email')
const express = require("express");
const {SignUp, Login} = require('./ServerFunctions/LoginRegister')


//configre express app
const app = express();
app.use(express.json())

app.get('/SendGood',function(req,res){
    res.json({"response":"good"})
})
app.post('/login', Login)
app.post('/signup', SignUp)


app.listen(process.env.PORT || 3001, function () {//host site
    console.log("Port: 3000");
    
});