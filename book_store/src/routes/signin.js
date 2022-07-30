var express = require('express');
var router = express.Router();


const cSignIn = require('../controllers/signinController');

//  index info
// router.get('/', function(req, res, next) {
//     indexController.getAllIndex((rows) => {
//         res.render('index', {rows : rows});
//     });
// });

// SignIn Page
// router.get('/', function(req, res){
//     try{
//         if (req.session.uid){
//             res.render('user/signin', {signinStatus: true});
//         } else{
//             res.render('user/signin', {signinStatus: false});
//         }
//     } catch (err1) {
//         throw err1;
//     }
// });

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
            res.render('user/signin', {
                signinStatus: false,
                userName: false
            });
        }
    } catch (err1) {
        throw (err1);
    }
});

router.post('/', function(req, res){
    var id = req.body.id;
    var pw = req.body.pw;
    cSignIn.signIn(id, (rows) => {
        console.log(rows);
        try{
            if (rows.length > 0){
                console.log('has data');
                if (pw === rows[0].user_pw){
                    console.log('logged in');
                    req.session.uid = rows[0].user_id;
                    req.session.userName = rows[0].user_name;
                    req.session.isLogined = true;
                    req.session.save(function () {
                        var userName = req.session.userName;
                        res.redirect("../");
                    });
                } else {
                    console.log('pw incorrect');
                    req.session.save(function () {
                        var userName = false;
                        res.redirect("/signin");
                    });
                }
            } else {
                console.log('no id data');
                req.session.save(function () {
                    var userName = false;
                    res.redirect("/signin");
                });
            }
        } catch (err1) {
            throw err1;
        };
    });
})


module.exports = router;
