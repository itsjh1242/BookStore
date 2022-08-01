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

module.exports = router;