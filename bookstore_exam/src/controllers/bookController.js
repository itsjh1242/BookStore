const pool = require("../../db/db");

exports.bookDetail = async (req, res) => {
    try{
        let flag = false;
        if(req.session.uid){
            flag = true
        }
        let { book_id } = req.params;
        const book = await pool.query('SELECT * FROM book WHERE book_id = ?', [
            book_id
        ]);
        return res.render('bookDetail', {
            signinStatus: flag,
            book: book[0][0],
            bookid: book_id,
        });
    } catch (error) {
        console.log(error);
    }
}
// 결제화면 
exports.pay = async (req, res) => {
    try{
        if(req.session.uid){
            let { book_id } = req.params;
            let { pay_amount } = req.body;
            // <포인트><할인> 포인트 차감 및 할인 관련 수정할 쿼리문
            const book = await pool.query('SELECT book_id, book_name, book_count, book_price, book_price * ? AS total_price FROM book WHERE book_id = ?', [
                pay_amount, book_id
            ]);
            // 배송지 & 카드 정보 가져오기
            const address = await pool.query('SELECT *, concat(address_postnum, " ", address_basicaddress, " ", address_detailaddress) AS myaddr FROM address WHERE user_user_id = ?', [
                req.session.uid
            ]);
            const card = await pool.query('SELECT *, concat(card_num, " | ", card_type, " | ", card_date) AS mycard FROM card WHERE user_user_id = ?', [
                req.session.uid
            ]);
            return res.render('pay', {
                signinStatus: true,
                book: book[0][0],
                method: "pay",
                amount: pay_amount,
                address: address[0],
                card: card[0],
            });
        } else {
            return res.send('<script>alert("로그인 먼저 해주세요.");location.href="/signin";</script>');
        }
    } catch (error) {
        console.log(error);
    }
}
// 바로구매 결제하기
exports.paynow = async (req, res) => {
    try{
        let today = new Date();
        let year = today.getFullYear().toString();
        let month = (today.getMonth() + 1).toString();
        let date = today.getDate().toString();
        let makeDate = year.concat("/", month).concat("/", date);
        let { total_price, dc_price, total_pay_price, address_id, card_id } = req.body;
        let { book_id, pay_amount } = req.params; 
        // 배송지 & 카드 정보 가져오기
        const getPayInfo = await pool.query('SELECT * FROM address AS A JOIN card AS B ON A.address_id = ? AND B.card_id = ?', [
            address_id, card_id
        ]);
        // 주문 생성
        const createOrder = await pool.query('INSERT INTO bookstore1.order VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            null, total_pay_price, makeDate, getPayInfo[0][0].card_type, getPayInfo[0][0].card_num, getPayInfo[0][0].card_date, getPayInfo[0][0].address_postnum, getPayInfo[0][0].address_basicaddress, getPayInfo[0][0].address_detailaddress, req.session.uid
        ]);
        // 주문 내역 등록
        const createOrderList = await pool.query('INSERT INTO order_list VALUES ((SELECT MAX(order_id) AS id FROM bookstore1.order WHERE user_user_id = ?), ?, ?)', [
            req.session.uid, book_id, pay_amount
        ]);
        // 책 수량 증감
        const setBookAmount = await pool.query('UPDATE book SET book_count = book_count - ? WHERE book_id = ?', [
            pay_amount, book_id
        ]);
        return res.send("<script>alert('결제가 완료되었습니다.'); location.href='/';</script>")
    } catch (error) {
        console.log(error);
    }
}

exports.addBasket = async (req, res) => {
    try{
        if(req.session.uid){
            let today = new Date();
            let year = today.getFullYear().toString();
            let month = (today.getMonth() + 1).toString();
            let date = today.getDate().toString();
            let makeDate = year.concat("/", month).concat("/", date);
            let { book_id } = req.params;
            let { pay_amount } = req.body;
            // 장바구니가 존재하는지 확인 후 없으면 생성
            const isBasketDup = await pool.query('SELECT * FROM basket WHERE user_user_id = ?', [
                req.session.uid
            ]);
            if(isBasketDup[0].length === 0){
                // 장바구니 생성
                const createBasket = await pool.query('INSERT INTO basket VALUES (?, ?, ?)', [
                    null, makeDate, req.session.uid
                ]);
            }
            // 장바구니에 같은 책이 있는지 확인
            const isBookDup = await pool.query('SELECT * FROM basket_list WHERE basket_basket_id = (SELECT basket_id FROM basket WHERE user_user_id = ?) AND book_book_id = ?', [
                req.session.uid, book_id
            ]);
            if(isBookDup[0].length === 0){
                // 새로운 책 장바구니 목록에 등록
                const addBasketList = await pool.query('INSERT INTO basket_list VALUES ((SELECT basket_id FROM basket WHERE user_user_id = ?), ?, ?)', [
                    req.session.uid, book_id, pay_amount
                ]);
            } else {
                // 장바구니에 등록된 책 수량 증가
                const setBasketList = await pool.query('UPDATE basket_list SET basket_basketcount = basket_basketcount + ? WHERE basket_basket_id = (SELECT basket_id FROM basket WHERE user_user_id = ?) AND book_book_id = ?', [
                    pay_amount, req.session.uid, book_id
                ]);
            }
            return res.send("<script>alert('장바구니에 담았습니다.'); location.href='/';</script>")
        } else {
            return res.send('<script>alert("로그인 먼저 해주세요.");location.href="/signin";</script>');
        }
    } catch (error) {
        console.log(error);
    }
}