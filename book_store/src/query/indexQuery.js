// index query
exports.getAllIndex = 'SELECT * FROM test';
// post index value
exports.postIndexValue = 'INSERT INTO test (user_id, user_pw, user_email, user_name, user_contact) VALUES (?, ?, ?, ?, ?)';
// delete index value
exports.deleteIndexValue = 'DELETE FROM test WHERE ID = ?';