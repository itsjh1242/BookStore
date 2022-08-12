const connection = require('../database/db');
var qOrder = require('../query/orderlist');

function getOrderList(id, callback){
  connection.query(qOrder.getOrderList, [id], (err, bl) => {
    callback(bl);
  })
}

function getBookInfo(id, callback){
  connection.query(qOrder.getBookInfo, [id], (err, bi) => {
    callback(bi);
  })
}

module.exports = {
  getOrderList,
  getBookInfo
}