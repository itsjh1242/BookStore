var express = require('express');
var router = express.Router();

const cBasket = require('../controllers/basketController');

router.get('/', function(req, res){
  try{
    if(req.session.uid){
      cBasket.getBasket(req.session.uid, (br) => {
        res.render('user/basket', {
          signinStatus: true,
          userName: req.session.userName,
          br: br
        });
      });
    };
  } catch (err1) {
    throw err1;
  }
})

router.post('/', function(req, res){
  try{
    console.log(req.body.selected);
  } catch (err1) {
    throw err1;
  }
})

router.post('/update', function(req, res){
  try{
    cBasket.initStatus();
    let amount = req.body.hiddenAmount;
    let arr = req.body.mychk;
    if(arr === undefined){
      return res.send("<script>alert('하나 이상 선택하세요!'); history.back();</script>");
    }
    if(Array.isArray(arr) === false){
      cBasket.updateBasket(Number(amount[0]), Number(arr), req.session.uid);
      return res.redirect('/pay');
    }
    for(var i = 0; i < arr.length; i++){
      cBasket.updateBasket(Number(amount[i]), Number(arr[i]), req.session.uid);
    };
    return res.redirect('/pay');
  }catch (err1){
    throw err1;
  }
})



module.exports = router;