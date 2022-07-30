// ------------ SignUp Page ------------
exports.signup = 'SELECT * FROM user WHERE user_id = ?';

exports.register = 'INSERT INTO user VALUES (?, ?, ?)';