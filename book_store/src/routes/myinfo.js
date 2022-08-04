var express = require('express');
var router = express.Router();
const { upload } = require('./multer');

const cMyPage = require('../controllers/mypageController');

// myInfo
router.get('/', function(req, res){
    try{
        if(req.session.uid){
            cMyPage.userInfo(req.session.uid, (rows) => {
                cMyPage.getAddress(req.session.uid, (address) => {
                    cMyPage.getCard(req.session.uid, (card) => {
                        res.render('user/myinfo', {
                            signinStatus: true,
                            userName: req.session.userName,
                            rows: rows,
                            address: address,
                            card: card
                        });
                    });
                });
            });
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

router.post('/', function(req, res){
    let id = req.session.uid;
    let newpw = req.body.newpw;
    let input = req.body.Editedaddress;
    let select = req.body.select;
    let indexNum = req.body.hiddenIndex;
    let StatusDel = req.body.hiddenStatus;
    let StatusCard = req.body.hiddenStatusCard;



    if (StatusDel === "delete" && input !== ""){
        cMyPage.deleteAddress(indexNum);
    }

    if (StatusCard === "card"){
        try{
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
            cMyPage.getCard(req.session.uid, (card) => {
                if(card.length < 2){
                    cMyPage.addCard(req.session.uid, cardnum, cardexp, cardtype);
                }
            })
        } catch (err1){
            throw err1;
        }
        

    }

    if (select === "---배송지 추가---" && input !== ""){
        var splitVal = input.split(' ');
        var postnum = parseInt(splitVal[0]);
        var splitAddr = splitVal.slice(1);
        var addr = "";
        for (var i = 0; i < splitAddr.length; i++){
            addr += splitAddr[i];
        }
        cMyPage.getAddress(id, (address) => {
            if (address.length < 2){
                cMyPage.addAddress(id, addr, postnum);
            };
        });
    }

    if (newpw !== ""){
        cMyPage.editpw(newpw, id);
    }

    if (input !== ""){
        var splitVal = input.split(' ');
        var postnum = parseInt(splitVal[0]);
        var splitAddr = splitVal.slice(1);
        var addr = "";
        for (var i = 0; i < splitAddr.length; i++){
            addr += splitAddr[i];
        }
        try{
            cMyPage.editAddress(addr, postnum, indexNum);
        } catch (err1) {
            throw err1;
        }
    } else {
        res.redirect('/info');
    }
    res.redirect('/info');
});


module.exports = router;