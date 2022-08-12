// get orderList
// exports.getOrderList = 'SELECT * FROM orderlist WHERE user_id = ?';

// get bookInfo
// exports.TgetBookInfo = 'SELECT * FROM book WHERE book_index = ?'

// get bookInfo join
exports.getBookInfo = 'SELECT DISTINCT * FROM orderlist AS a LEFT JOIN book AS b ON a.book_index = b.book_index WHERE user_id = ? ORDER BY a.date';

/* 
[
  RowDataPacket {
    user_id: 'admin',
    book_index: 2,
    orderNum: 10,
    date: 2022-08-06T06:14:27.000Z,
    book_title: '돈의속성',
    book_price: 16000,
    book_salesRate: 5,
    book_num: 131,
    book_genre: '자기개발',
    book_info: '돈의속성입니다.'
  },
  RowDataPacket {
    user_id: 'admin',
    book_index: 2,
    orderNum: 11,
    date: 2022-08-06T06:14:39.000Z,
    book_title: '돈의속성',
    book_price: 16000,
    book_salesRate: 5,
    book_num: 131,
    book_genre: '자기개발',
    book_info: '돈의속성입니다.'
  },
  RowDataPacket {
    user_id: 'admin',
    book_index: 3,
    orderNum: 12,
    date: 2022-08-06T06:14:42.000Z,
    book_title: '가장나쁜일',
    book_price: 15000,
    book_salesRate: 3,
    book_num: 133,
    book_genre: '소설',
    book_info: '릴레이 소설입니다.'
  }
]
*/