const connection = require('../database/db');
var qMypage = require('../query/mypageQuery');

// myPage
function userInfo(id, callback){
    connection.query(qMypage.signin, [id], (err, rows) => {
        callback(rows);
    });
}

function getAddress(id, callback){
    connection.query(qMypage.getAddress, [id], (err, address) => {
        callback(address);
    });
}

module.exports = {
    userInfo,
    getAddress
}