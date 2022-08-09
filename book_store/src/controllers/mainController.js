const connection = require('../database/db');
var qMain = require('../query/mainQuery');

// Main Page
// Best Seller
function getBestSeller(callback){
    connection.query(qMain.getBestSeller, (err, rows) => {
        callback(rows);
    });
}

function getBookInfo(n, callback){
    connection.query(qMain.getBookInfo, [n], (err, rows, fields) => {
        callback(rows);
    })
}

function getCash(id, callback){
    connection.query(qMain.getCash, [id], (err, credit) => {
        callback(credit);
    });
}

function addOrder(id, index){
    connection.query(qMain.addOrder, [id, index]);
}

function updatePayment(cash, id){
    try{
        connection.query(qMain.updateCash, [cash, id]);
    } catch (err1) {
        throw err1;
    }
    
}

function rateIncrease(rate, index){
    connection.query(qMain.rateIncrease, [rate, index]);
}

function addBasket(id, index){
    connection.query(qMain.addBasket, [id, index, 1]);
}

function addBasketDup(value, id, index){
    connection.query(qMain.addBasketDup, [value, id, index]);
}

function getBasket(id, index, callback){
    connection.query(qMain.getBasket, [id, index], (err, basket) => {
        callback(basket)
    });
}


module.exports = {
    getBestSeller,
    getBookInfo,
    getCash,
    addOrder,
    updatePayment,
    rateIncrease,
    addBasket,
    addBasketDup,
    getBasket
}