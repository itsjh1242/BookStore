var express = require('express');
var router = express.Router();

// controller
const bookCtrl = require("../controllers/bookController");

// 책 디테일 메인 화면
router.get('/:book_id', bookCtrl.bookDetail);

// 바로구매
// 바로구매 화면
router.post('/pay/:book_id', bookCtrl.pay);
// 바로구매 결제하기
router.post('/pay/paynow/:book_id/:pay_amount', bookCtrl.paynow);

// 장바구니
// 장바구니 담기
router.post('/addBasket/:book_id', bookCtrl.addBasket);



module.exports = router;