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
