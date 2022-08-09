const connection = require('../database/db');
var qBasket = require('../query/basketQuery');

function getBasket(id, callback){
  connection.query(qBasket.getBasket, [id], (err, br) => {
    callback(br);
  })
}

module.exports ={
  getBasket
}