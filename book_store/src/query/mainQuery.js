// ------------ Main Page ------------
// BestSeller & MainContent
exports.getBestSeller = 'SELECT * FROM book ORDER BY book_salesRate DESC';

// get book
exports.getBookInfo = 'SELECT * FROM book WHERE book_index = ?';

// get cash
exports.getCash = 'SELECT * FROM credit WHERE user_id = ?';

// order book directly
exports.addOrder = 'INSERT INTO orderlist (user_id, book_index, orderNum) VALUES (?, ?, NULL)';

// payment update
exports.updateCash = 'UPDATE credit SET cash = ? WHERE user_id = ?';

// increase sales rate
exports.rateIncrease = 'UPDATE book SET book_salesRate = ? WHERE book_index = ?';

/* Basket Part */
// add Basket
exports.addBasket = 'INSERT INTO basket VALUES (NULL, ?, ?, ?)';

//add Basket dup
exports.addBasketDup = 'UPDATE basket SET book_value = ? WHERE user_id = ? AND book_index = ?';

// get Basket
exports.getBasket = 'SELECT * FROM basket WHERE user_id = ? AND book_index = ?';

exports.test = 'SELECT * FROM book ORDER BY book_salesRate DESC';