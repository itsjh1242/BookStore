const connection = require('../database/db');
var qPay = require('../query/payQuery');

function checkedbasket(callback){
  connection.query(qPay.checkedbasket, (err, chkb) => {
    callback(chkb);
  })
}

function hasCash(id, callback){
  connection.query(qPay.hasCash, [id], (err, cash) => {
    callback(cash);
  });
}

function totalPrice(callback){
  connection.query(qPay.totalPrice, (err, totalprice) => {
    callback(totalprice[0].totalprice);
  });
}

function deleteBasket(){
  connection.query(qPay.removeBasket);
}

function payment(cash, id){
  connection.query(qPay.payment, [cash, id]);
}

function basketOrder(id, index, amount){
  connection.query(qPay.basketOrder, [id, index, amount]);
}

function updateRate(rate, index){
  connection.query(qPay.updateRate, [rate, index]);
}

function getRate(index, callback){
  connection.query(qPay.getRate, [index], (err, rate) => {
    callback(rate[0].book_salesRate);
  });
}

module.exports = {
  checkedbasket,
  hasCash,
  totalPrice,
  deleteBasket,
  basketOrder,
  updateRate,
  getRate,
  payment
}
