// get Basket
exports.getBasket = 'SELECT * FROM book AS a LEFT JOIN basket AS b ON a.book_index = b.book_index WHERE user_id = ?';

//exports.getBookInfo = 'SELECT DISTINCT * FROM orderlist AS a LEFT JOIN book AS b ON a.book_index = b.book_index WHERE user_id = ? ORDER BY a.date';