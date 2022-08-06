var express = require('express');
var router = express.Router();

const cOrder = require('../controllers/orderController');

router.get('/', function(req, res){
  try{
    if(req.session.uid){
      cOrder.getBookInfo(req.session.uid, (bi) => {
        res.render('user/orderlist', {
          signinStatus: true,
          userName: req.session.userName,
          bi: bi
        })
      })
    }
  } catch (err1) {
    throw err1;
  }
});

module.exports = router;