var express = require('express');
var router = express.Router();

// controller
const orderCtrl = require("../controllers/orderController");

// 주문 목록 메인 화면
router.get('/', orderCtrl.orderPage);
// 주문 상세 화면
router.post('/detail/:order_id', orderCtrl.orderDetailPage);



module.exports = router;