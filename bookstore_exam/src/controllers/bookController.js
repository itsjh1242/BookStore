
const pool = require("../../db/db");
const router = require("../routes/book");



exports.bookDetail = async (req, res) => {
    try{
        // 로그인한 사용자가 작성한 댓글이 맞는지 확인
        // 로그인 했는지 확인
        let flag = false;
        // params 주소값 가져오기
        let { book_id } = req.params;
        if(req.session.uid){
            flag = true
        }
        const book = await pool.query('SELECT * FROM book WHERE book_id = ?', [
            book_id
        ]);
        // 좋아요 수
        const book_like = await pool.query('SELECT COUNT(*) AS like_amount FROM booklike WHERE book_like = 0 AND book_book_id = ?;', [
            book_id
        ])
        // 리뷰 가져오기
        const getReview = await pool.query('SELECT * FROM bookreview AS A JOIN bookstore1.user AS B ON A.user_user_id = B.user_id WHERE book_book_id = ? ORDER BY book_review_id', [
            book_id
        ]);
        // 
        return res.render('bookDetail', {
            signinStatus: flag,
            book: book[0][0],
            bookid: book_id,
            like: book_like[0][0].like_amount,
            review: getReview[0],
            user_id: req.session.uid,
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
        let year = today.getFullYear(); // 년도
        let month = today.getMonth() + 1;  // 월
        let date = today.getDate();  // 날짜
        let makeDate = year + '/' + month + '/' + date;

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
            let year = today.getFullYear(); // 년도
            let month = today.getMonth() + 1;  // 월
            let date = today.getDate();  // 날짜
            let makeDate = year + '/' + month + '/' + date;
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

// 좋아요
exports.pushLike = async (req, res) => {
    try {
        if(req.session.uid){
            // 먼저 사용자가 해당 책에 좋아요를 눌렀는지 확인하기
            let { book_id } = req.params;
            const isLiked = await pool.query('SELECT * FROM booklike WHERE user_user_id = ? AND book_book_id = ?', [
                req.session.uid, book_id
            ]);
            if(isLiked[0].length === 0){
                const createLike = await pool.query('INSERT INTO booklike VALUES (null, 0, ?, ?)', [
                    req.session.uid, book_id
                ]);
            } else {
                return res.send('<script>alert("이미 좋아요를 눌렀습니다!"); history.go(-1);</script>');
            }
            return res.redirect("/book/" + book_id);
        } else {
            return res.send('<script>alert("먼저 로그인을 해주세요!"); location.href="/join";</script>');
        }
    } catch (error) {
        console.log(error);
    }
}

// 리뷰 등록
exports.addReview = async (req, res) => {
    try{
        let { book_id } = req.params;
        let { review } = req.body;
        let user_bought = [];
        if(req.session.uid){
            // 리뷰가 빈 내용일 때
            if(review === ""){
                return res.send('<script>alert("작성된 내용이 없습니다!"); history.go(-1);</script>');
            }
            // 사용자가 주문한 주문 번호를 전부 가져온다
            const getOrder = await pool.query('SELECT order_id FROM bookstore1.order WHERE user_user_id = ?', [
                req.session.uid
            ]);
            // 주문 번호를 이용해서 책 번호 찾기
            for(let i = 0; i < getOrder[0].length; i++){
                const getBooks = await pool.query('SELECT book_book_id FROM order_list WHERE order_order_id = ?', [
                    getOrder[0][i].order_id
                ]);
                for(let j = 0; j < getBooks[0].length; j++){
                    if(!(user_bought.includes(getBooks[0][j].book_book_id))){
                        user_bought.push(getBooks[0][j].book_book_id);
                    }
                }
            }
            // 사용자가 리뷰를 남기려는 책을 사용자가 구매 하였을 때
            if(user_bought.includes(parseInt(book_id))){
                const addReview = await pool.query('INSERT INTO bookreview VALUES (null, ?, ?, ?)', [
                    review, req.session.uid, book_id
                ]);
                return res.redirect('/book/' + book_id);
            } else {
                return res.send('<script>alert("책을 구매하지 않으셨습니다!"); history.go(-1);</script>');
            }
        } else {
            return res.send('<script>alert("로그인을 해야합니다!"); history.go(-1);</script>');
        }
    } catch (error) {
        console.log(error);
    }
}

exports.deleteReview = async (req, res) => {
    try {
        let { review_id, book_id } = req.params;
        const delReview = await pool.query('DELETE FROM bookreview WHERE book_review_id = ?', [
            review_id
        ]);
        return res.redirect('/book/' + book_id);
    } catch (error) {
        console.log(error);
    }
}