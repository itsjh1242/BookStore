const connection = require('../database/db');
var qMain = require('../query/mainQuery');

/* Test 
function getAllIndex(callback){
    connection.query(indexQuery.getAllIndex, (err, rows, fields) => {
        callback(rows);
    })
}

function postIndexValue(id, pw, email, name, contact, callback){
    connection.query(indexQuery.postIndexValue, [id, pw, email, name, contact], (err, result) => {
        if (err) throw err;
        callback();
    })
}

function deleteIndex(id, callback){
    connection.query(indexQuery.deleteIndexValue, (err, result) => {
        callback();
    })
}
*/


module.exports = {
}
