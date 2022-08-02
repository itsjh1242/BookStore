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

function editpw(pw, postnum){
    connection.query(qMypage.editpw, [pw, postnum]);
}

function addAddress(id, addr, postnum){
    connection.query(qMypage.addAddress, [id, addr, postnum]);
}

function deleteAddress(indexNum){
    connection.query(qMypage.deleteAddress, [indexNum]);
}


module.exports = {
    userInfo,
    getAddress,
    editAddress,
    editpw,
    addAddress,
    deleteAddress
}