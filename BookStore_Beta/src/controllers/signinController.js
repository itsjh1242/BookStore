const connection = require('../database/db');
var qSignIn = require('../query/signinQuery');


function signIn(id, callback){
    connection.query(qSignIn.signin, [id], (err, rows) => {
        callback(rows);
    })
}

module.exports = {
    signIn
}