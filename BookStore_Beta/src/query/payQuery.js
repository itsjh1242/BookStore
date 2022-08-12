// get all basket where bStatus = 1
exports.checkedbasket = 'SELECT * FROM basket AS a LEFT JOIN book AS b ON a.book_index = b.book_index WHERE bStatus = 1';

// get credit card
exports.hasCash = 'SELECT * FROM credit WHERE user_id = ? ORDER BY cash DESC LIMIT 1';

// get total price
exports.totalPrice = 'SELECT SUM(book_price * book_value) AS totalprice FROM basket AS a LEFT JOIN book AS b ON a.book_index = b.book_index WHERE bStatus = 1'

// order
// delete basket
exports.deleteBasket = 'DELETE FROM basket WHERE basketNum = ?';

// addOrder
exports.basketOrder = 'INSERT INTO orderlist (user_id, book_index, orderNum, orderamount) VALUES (?, ?, NULL, ?)';

// salesRate
exports.updateRate = 'UPDATE book SET book_salesRate = ? WHERE book_index = ?';

// removeBasket
exports.removeBasket = 'DELETE FROM basket WHERE bStatus = 1';

// payment
exports.payment = 'UPDATE credit SET cash = ? WHERE user_id = ?';