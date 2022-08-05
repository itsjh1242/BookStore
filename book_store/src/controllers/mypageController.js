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

function editAddress(addr, postnum, indexNum){
    connection.query(qMypage.editAddress, [addr, postnum, indexNum]);
}

function editpw(pw, id){
    connection.query(qMypage.editpw, [pw, id]);
}

function addAddress(id, addr, postnum){
    connection.query(qMypage.addAddress, [id, addr, postnum]);
}

function deleteAddress(indexNum){
    connection.query(qMypage.deleteAddress, [indexNum]);
}

function getCard(id, callback){
    connection.query(qMypage.getCard, [id], (err, card) => {
        callback(card);
    })
}

// function addCard(id, cardnum, cardexp, cardtype, callback){
//     connection.query(qMypage.addCard, [id, cardnum, cardexp, cardtype], (err) => {
//         callback(err);
//     });
// }

function deleteCard(id, cardnum){
    connection.query(qMypage.deleteCard, [id, cardnum]);
}


module.exports = {
    userInfo,
    getAddress,
    editAddress,
    editpw,
    addAddress,
    deleteAddress,
    getCard,
    deleteCard
}