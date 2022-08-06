var express = require('express');
var router = express.Router();
const cMyPage = require('../controllers/mypageController');

router.get('/', function(req, res){
  try{
      if(req.session.uid){
        cMyPage.getCard(req.session.uid, (card) => {
          res.render('user/card', {
            signinStatus: true,
            userName: req.session.userName,
            card: card
          });
        })
      } else{
          res.render('/', {
              signinStatus: false,
              userName: false
          });
      }
  } catch (err1) {
      throw (err1);
  }
})

router.post('/', function(req,res){
  try{
    if(req.session.uid){
      let cardnum =
      req.body.cardNum1.toString()
      + req.body.cardNum2.toString()
      + req.body.cardNum3.toString()
      + req.body.cardNum4.toString();
      let expM = req.body.cardExpM.toString();
      let expY = req.body.cardExpY.toString();
      /* 유효기간 입력 값 정렬 ex. 01 02 03... */
      if (expM.length < 2){
          expM = "0" + expM;
      };
      if (expY.length < 2){
          expY = "0" + expY;
      };
      let cardexp = expM + expY;
      let cardtype = req.body.cardType;
      cMyPage.addCard(req.session.uid, cardnum, cardexp, cardtype);
      return res.redirect('/card');
    }
  } catch (err1) {
    throw err1;
  }
})

module.exports = router;