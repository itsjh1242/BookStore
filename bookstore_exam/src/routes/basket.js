var express = require('express');
var router = express.Router();
// controller
const basketCtrl = require("../controllers/basketController");

// 장바구니
router.get('/', basketCtrl.basket);
// 장바구니 항목 삭제
router.post('/del/:basket_id/:book_id', basketCtrl.delBasket);
//장바구니 구매할 도서 양 조절
router.post('/setamount/:basket_id/:book_id', basketCtrl.setAmount);
// 장바구니 구매하기 버튼 -> 결제화면
router.post('/', basketCtrl.basketPage);
// 장바구니 결제 화면에서 결제하기 버튼을 눌렀을 때 실행되는 결제 함수
router.post('/basketpay', basketCtrl.basketPay);


module.exports = router;