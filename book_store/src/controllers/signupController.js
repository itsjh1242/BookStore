const connection = require('../database/db');
var qSignUp = require('../query/signupQuery');

function SignUp(id, callback){
    connection.query(qSignUp.signup, [id], (err, rows) =>{
        callback(rows);
    });
}

function Register(id, pw, name){
    connection.query(qSignUp.register, [id, pw, name]);
}

module.exports = {
    SignUp,
    Register
}