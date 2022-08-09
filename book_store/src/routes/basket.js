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

module.exports = router;