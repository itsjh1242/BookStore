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
                    res.render('user/myinfo', {
                        signinStatus: true,
                        userName: req.session.userName,
                        rows: rows,
                        address: address
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
    let deleteStatus = req.body.hiddenInputDelete;

    if (deleteStatus === "ok" && input !== ""){
        cMyPage.deleteAddress(indexNum);
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
    };

    if (newpw !== ""){
        cMyPage.editpw(newpw, id);
        res.redirect('/info');
    };

    if (input !== ""){
        var splitVal = input.split(' ');
        var postnum = parseInt(splitVal[0]);
        var splitAddr = splitVal.slice(1);
        var addr = "";
        for (var i = 0; i < splitAddr.length; i++){
            addr += splitAddr[i];
        }
        try{
            cMyPage.getAddress(id, (address) => {
                cMyPage.editAddress(addr, postnum, indexNum);
            res.redirect('/info');
            });
        } catch (err1) {
            throw err1;
        }
    };
});


module.exports = router;