const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'itsjh0112',
    port:3306,
    database:'node_db',
    dateStrings: 'date' // transformated date type
});

// get all data
function getAllMemos(callback){
    connection.query(`SELECT * FROM MEMOS ORDER BY ID DESC`, (err, rows, fields) => {
        callback(rows);
    });
}

// insert memo data
function insertMemo(content, callback) {
    connection.query(`INSERT INTO MEMOS (CONTENT, CREATED_AT, UPDATED_AT) VALUES ('${content}', NOW(), NOW())`, (err, result) => {
        if (err) throw err;
        callback();
    });
}
// get memo by id
function getMemoById(id, callback){
    connection.query(`SELECT * FROM MEMOS WHERE ID = ${id}`, (err, row, fields) => {
        if(err) throw err;
        callback(row);
    });
}
// update memo by id
function updateMemoById(id, content , callback){
    connection.query(`UPDATE MEMOS SET CONTENT = '${content}', UPDATED_AT = NOW() WHERE ID = ${id}`, (err, result) => {
        if(err) throw err;
        callback();
    });
}
// delete memo by id
function deleteMemoById(id, callback){
    connection.query(`DELETE FROM MEMOS WHERE ID = ${id}`, (err, result) => {
        callback();
    });
}

module.exports = {
    getAllMemos,
    insertMemo,
    getMemoById,
    updateMemoById,
    deleteMemoById
}