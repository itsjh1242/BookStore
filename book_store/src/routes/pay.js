var express = require('express');
var router = express.Router();

const cPay = require('../controllers/payController');

router.get('/', function(req, res){
  try{
    if(req.session.uid){
        cPay.checkedbasket((chkb) => {
            res.render('user/pay', {
                signinStatus: true,
                userName: req.session.userName,
                chkb: chkb
            });
        });
    }
} catch (err1) {
    throw (err1);
}
})

router.post('/', function(req, res){
    try{
        cPay.hasCash(req.session.uid, (cash) => {
            cPay.totalPrice((totalprice) => {
                if(Number(cash[0].cash) > Number(totalprice)){
                    cPay.checkedbasket((rows) => {
                        for(var i = 0; i < rows.length; i++){
                            cPay.updateRate(Number(rows[i].book_salesRate) + Number(rows[i].book_value), rows[i].book_index);
                            cPay.basketOrder(req.session.uid, rows[i].book_index, rows[i].book_value);
                        }
                    });
                    let payCash = Number(cash[0].cash) - Number(totalprice);
                    cPay.payment(payCash, req.session.uid);
                    cPay.deleteBasket();
                    return res.redirect('/orderlist');
                } else {
                    return res.send("<script>alert('잔액이 부족합니다!'); history.back();</script>")
                }
            })
        })
    } catch (err1) {
        throw err1;
    }
    
})

module.exports = router;