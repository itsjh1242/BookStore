const connection = require('../database/db');
var qBook = require('../query/bookQuery');

function getBookInfo(n, callback){
  connection.query(qBook.getBookInfo, [n], (err, rows, fields) => {
      callback(rows);
  })
}

module.exports = {
  getBookInfo
}