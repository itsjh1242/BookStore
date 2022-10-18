const pool = require("../../db/db");

// 주문목록 화면 띄우기
exports.orderPage = async (req, res) => {
    try{
        let orderAmount = []
        let orderBook = []
        // 주문 목록 가지고오기
        const order = await pool.query('SELECT * FROM bookstore1.order WHERE user_user_id = ? ORDER BY order_id DESC', [
            req.session.uid
        ]);
        // 주문 목록 상세 ( 총 주문 도서, 도서 이름 )
        for(let i = 0; i < order[0].length; i++){
            const orderDetail = await pool.query('SELECT SUM(order_bookcount) AS order_amount FROM order_list WHERE order_order_id = ?', [
                order[0][i].order_id
            ]);
            const orderDetailBook = await pool.query('SELECT * FROM order_list AS A JOIN book AS B ON A.book_book_id = B.book_id WHERE A.order_order_id = ?', [
                order[0][i].order_id
            ]);
            orderAmount.push(orderDetail[0][0].order_amount);
            orderBook.push(orderDetailBook[0][0].book_name);
        }
        console.log(orderBook);
        return res.render('order', {
            signinStatus: true,
            order: order[0],
            orderAmount: orderAmount,
            orderBook: orderBook,
        })
    } catch (error) {
        console.log(error);
    }
}

// 주문 상세화면 띄우기
exports.orderDetailPage = async (req, res) => {
    try {
        let order_amount = 0;
        let { order_id } = req.params;
        // 주문 리스트 가져오기
        const getOrderList = await pool.query('SELECT * FROM order_list AS A JOIN book AS B ON A.book_book_id = B.book_id WHERE order_order_id = ?', [
            order_id
        ]);
        // 총 구매 도서량 구하기
        for(let i = 0; i < getOrderList[0].length; i++){
            order_amount += getOrderList[0][i].order_bookcount;
        }
        // 주문 목록 가져오기
        const getOrder = await pool.query('SELECT * FROM bookstore1.order WHERE order_id = ?', [
            order_id
        ]);
        return res.render('orderDetail', {
            signinStatus: true,
            orderlist: getOrderList[0],
            order: getOrder[0],
            orderAmount: order_amount,
        })
    } catch (error) {
        console.log(error);
    }
}
