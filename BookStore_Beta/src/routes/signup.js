var express = require('express');
var router = express.Router();
const { upload } = require('./multer');



const cSignUp = require('../controllers/signupController');


// SignUp Page
router.get('/', function(req, res){
    try{
        if(req.session.uid){
        delete req.session.uid;
        delete req.session.isLogined;
        delete req.session.userName;
        req.session.save(function () {
            var userName = req.session.userName;
            res.redirect("/");
        });
        } else{
            res.render('user/signup', {
                signinStatus: false,
                userName: false
            });
        }
    } catch (err1) {
        throw (err1);
    }
});

// SignUp Register

router.post('/', function(req, res){
    var id = req.body.inputid;
    var pw = req.body.inputpw;
    var name = req.body.inputname;
    cSignUp.SignUp(id, (rows) => {
        try{
            if (rows.length === 0){
                cSignUp.Register(id, pw, name);
                req.session.save(function() {
                    var userName = false;
                    res.redirect('/signin');
                });
            } else {
                console.log('already exist id');
                req.session.save(function() {
                    var userName = false;
                    res.redirect('/signup');
                });
            }
        } catch (err1){
            throw err1;
        }
    });
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
