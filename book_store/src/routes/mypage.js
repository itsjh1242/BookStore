var express = require('express');
var router = express.Router();
const { upload } = require('./multer');



const cSignUp = require('../controllers/mypageController');


// myPage
router.get('/', function(req, res){
    try{
        if(req.session.uid){
            res.render('user/mypage', {
                signinStatus: true,
                userName: req.session.userName
            });
        } else{
            res.render('user/mypage', {
                signinStatus: false,
                userName: false
            });
        }
    } catch (err1) {
        throw (err1);
    }
});

router.post("/test", upload.single("img"), async (req, res) => {
    const imgfile = req.file;
    console.log(imgfile);
    res.render('user/signup', {
        signinStatus: false,
        userName: false
    });
});
  

module.exports = router;
