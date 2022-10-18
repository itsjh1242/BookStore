const pool = require("../../db/db");

// 장바구니 메인 페이지
exports.basket = async (req, res) => {
    try{
        // 장바구니 가져오기
        const getBasket = await pool.query('SELECT * FROM basket_list AS A JOIN book AS B ON A.book_book_id = B.book_id WHERE basket_basket_id = (SELECT basket_id FROM basket WHERE user_user_id = ?)', [
            req.session.uid
        ]);
        // 장바구니가 있는지 확인하기
        if(getBasket[0].length === 0){
            return res.send("<script>alert('장바구니에 담긴 항목이 없습니다.'); location.href='/'</script>");
        } else {
            return res.render('basket', {
                signinStatus: true,
                basket: getBasket[0],
            });
        }
    } catch (error) {
        console.log(error);
    }
}

// 장바구니 항목 삭제
exports.delBasket = async (req, res) => {
    try{
        let { basket_id, book_id } = req.params;
        const delBasketList = await pool.query('DELETE FROM basket_list WHERE basket_basket_id = ? AND book_book_id = ?', [
            basket_id, book_id
        ]);
        return res.redirect('/basket');
    } catch (error) {
        console.log(error);
    }
}

// 장바구니 구매할 도서 양 조절
exports.setAmount = async (req, res) => {
    try{
        let { basket_id, book_id } = req.params;
        let { flag } = req.body;
        if(flag === '+'){
            const setAmount = await pool.query('UPDATE basket_list SET basket_bookcount = basket_bookcount + 1 WHERE basket_basket_id = ? AND book_book_id = ?', [
                basket_id, book_id
            ]);
        } else {
            const setAmount = await pool.query('UPDATE basket_list SET basket_bookcount = basket_bookcount - 1 WHERE basket_basket_id = ? AND book_book_id = ?', [
                basket_id, book_id
            ]);
        }
        // 수량이 0이 되면 삭제
        const setAmount = await pool.query('DELETE FROM basket_list WHERE basket_bookcount = 0');
        return res.redirect('/basket');
    } catch (error) {
        console.log(error);
    }
}

// 장바구니 -> 결제 화면
exports.basketPage = async (req, res) => {
    try{
        let itemlist = [];
        let total_price = 0;
        let total_amount = 0;
        let { items } = req.body;
        // 예외: 도서를 선택하지 않은 경우
        if(items === undefined){
            return res.send('<script>alert("구매할 도서를 선택해야 합니다."); location.href="/basket"</script>');
        }
        if(typeof items === 'string'){
            const getBasketList = await pool.query('SELECT *, book_price * basket_bookcount AS total_price FROM book AS A join basket_list AS B ON A.book_id = B.book_book_id WHERE book_id = ?', [
                items
            ]);
            itemlist.push(getBasketList[0][0]);
        } else {
            // 장바구니에서 사용자가 선택한 책 아이디를 가지고 온다 -> 책과 장바구니 리스트를 조인하여 사용자가 선택한 도서의 정보와 장바구니에 담긴 수량 가져오기
            for(let i = 0; i < items.length; i++){
                const getBasketList = await pool.query('SELECT *, book_price * basket_bookcount AS total_price FROM book AS A join basket_list AS B ON A.book_id = B.book_book_id WHERE book_id = ?', [
                    items[i]
                ]);
                itemlist.push(getBasketList[0][0]);
            }
        }
        // 총 결제금액 및 수량 구하기
        for(let i = 0; i < itemlist.length; i++){
            total_price += parseInt(itemlist[i].total_price);
            total_amount += parseInt(itemlist[i].basket_bookcount);
        }
        // 회원 카드 및 배송지 정보 가져오기
        const address = await pool.query('SELECT *, concat(address_postnum, " ", address_basicaddress, " ", address_detailaddress) AS myaddr FROM address WHERE user_user_id = ?', [
            req.session.uid
        ]);
        const card = await pool.query('SELECT *, concat(card_num, " | ", card_type, " | ", card_date) AS mycard FROM card WHERE user_user_id = ?', [
            req.session.uid
        ]);
        return res.render('pay', {
            signinStatus: true,
            method: "basket",
            book: itemlist,
            address: address[0],
            card: card[0],
            total_price: total_price,
            total_amount: total_amount,
        });
    } catch (error) {
        console.log(error);
    }
}

// 장바구니에서 결제할 때
exports.basketPay = async (req, res) => {
    try {
        let today = new Date();   
        let year = today.getFullYear(); // 년도
        let month = today.getMonth() + 1;  // 월
        let date = today.getDate();  // 날짜
        let makeDate = year + '/' + month + '/' + date;
        let { total_price, dc_price, total_pay_price, total_amount, address_id, card_id, items, pay_amount } = req.body;
        // 배송지 & 카드 정보 가져오기
        const getPayInfo = await pool.query('SELECT * FROM address AS A JOIN card AS B ON A.address_id = ? AND B.card_id = ?', [
            address_id, card_id
        ]);
        // 주문 생성
        const createOrder = await pool.query('INSERT INTO bookstore1.order VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            null, total_pay_price, makeDate, getPayInfo[0][0].card_type, getPayInfo[0][0].card_num, getPayInfo[0][0].card_date, getPayInfo[0][0].address_postnum, getPayInfo[0][0].address_basicaddress, getPayInfo[0][0].address_detailaddress, req.session.uid
        ]);
        // 장바구니에 도서가 1개 이상일 수 있기 때문에 반복문을 사용해야 함
        // 주문 내역 등록 및 장바구니 목록 삭제
        for(let i = 0; i < items.length; i++){
            const createOrderList = await pool.query('INSERT INTO order_list VALUES ((SELECT MAX(order_id) AS id FROM bookstore1.order WHERE user_user_id = ?), ?, ?)', [
                req.session.uid, items[i], pay_amount[i]
            ]);
            // 장바구니 목록 삭제
            const delBasketList = await pool.query('DELETE FROM basket_list WHERE basket_basket_id = (SELECT basket_id FROM basket WHERE user_user_id = ?) AND book_book_id = ?', [
                req.session.uid, items[i]
            ]);
        // 책 수량 증감
            const setBookAmount = await pool.query('UPDATE book SET book_count = book_count - ? WHERE book_id = ?', [
                pay_amount[i], items[i]
            ]);
        }
        // 장바구니 목록에 아무것도 없으면 장바구니를 삭제
        const isBasketListEmpty = await pool.query('SELECT * FROM basket_list WHERE basket_basket_id = (SELECT basket_id FROM basket WHERE user_user_id = ?)', [
            req.session.uid
        ]);
        if(isBasketListEmpty[0].length === 0){
            // 장바구니 삭제
            const delBasket = await pool.query('DELETE FROM basket WHERE user_user_id = ?', [
                req.session.uid
            ]);
        }
        return res.send("<script>alert('결제가 완료되었습니다.'); location.href='/';</script>")
    } catch (error) {
        console.log(error);
    }
}

