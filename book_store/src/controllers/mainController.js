const connection = require('../database/db');
var qMain = require('../query/mainQuery');

// Main Page
// Best Seller
function getBestSeller(callback){
    connection.query(qMain.getBestSeller, (err, rows) => {
        callback(rows);
    });
}

module.exports = {
    getBestSeller
}