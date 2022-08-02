// ------------ myPage Page ------------
exports.signin = 'SELECT * FROM user WHERE user_id = ?';

// adress
exports.getAddress = 'SELECT * FROM address WHERE user_id = ?';

// edit address
exports.editAddress = 'UPDATE address SET address1 = ?, postNum = ? WHERE indexNum = ?';

// edit pw
exports.editpw = 'UPDATE user SET user_pw = ? WHERE indexNum = ?';

// add Address
exports.addAddress = 'INSERT INTO address VALUES (?, ?, ?, null)';

// delete Address
exports.deleteAddress = 'DELETE FROM address WHERE indexNum =?';