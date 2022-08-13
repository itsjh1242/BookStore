const mysql = require('mysql')

/* Connection Pool 
DB에 연결된 Connection을 미리 만들어 둔 후 Pool에 보관했다가 
필요할 때 Pool에서 Connection을 가져다 사용한 후 다시 Pool로 변환 */

const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '0112',
    port: 3306,
    database: 'node_db',
    multipleStatements : true
})

module.exports = connection;

