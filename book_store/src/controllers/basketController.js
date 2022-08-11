const connection = require('../database/db');
var qBasket = require('../query/basketQuery');

function getBasket(id, callback){
  connection.query(qBasket.getBasket, [id], (err, br) => {
    callback(br);
  })
}

function updateBasket(b_value, b_number, id){
  connection.query(qBasket.updateBasket, [b_value, true, b_number, id]);
}

function initStatus(){
  connection.query(qBasket.initStatus, [false]);
}


module.exports ={
  getBasket,
  updateBasket,
  initStatus
}