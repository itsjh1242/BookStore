// ------------ myPage Page ------------
exports.signin = 'SELECT * FROM user WHERE user_id = ?';

// get adress
exports.getAddress = 'SELECT * FROM address WHERE user_id = ?';

// edit address
exports.editAddress = 'UPDATE address SET address1 = ?, postNum = ? WHERE indexNum = ?';

// edit pw
exports.editpw = 'UPDATE user SET user_pw = ? WHERE user_id = ?';

// add Address
exports.addAddress = 'INSERT INTO address VALUES (?, ?, ?, null)';

// delete Address
exports.deleteAddress = 'DELETE FROM address WHERE indexNum =?';

// get card
exports.getCard = 'SELECT * FROM credit WHERE user_id = ?';

// add card
// exports.addCard = 'INSERT INTO credit (user_id, cardnum, cardexp, indexNum, cardtype, cash) VALUES (?, ?, ?, null, ?, 0)'

// delete card
exports.deleteCard = 'DELETE FROM credit WHERE user_id =? AND cardnum = ?';