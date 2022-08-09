var express = require('express');
var router = express.Router();
var connection = require('../database/db');
var session = require('express-session');
var MySQLStore = require('express-mysql-session');

const cMain = require('../controllers/mainController');
const e = require('express');

var options={
    host:'localhost',
    user: 'root',
    password: 'itsjh0112',
    port: 3306,
    database: 'node_db'
};
var sessionStore = new MySQLStore(options);

router.use(
    session({
        secret: 'asdqweasdasd',
        resave: false,
        saveUninitialized: true,
        store: sessionStore
    })
);


// Main Page
router.get('/', function(req, res){
    cMain.getBestSeller((rows) => {
        try{
            if (req.session.uid){
                res.render('index', {
                    rows: rows,
                    page: './main/main',
                    best: './bestSeller',
                    content: './content',
                    signinStatus: true,
                    userName: req.session.userName
                });
            } else {
                res.render('index', {
                    rows: rows,
                    page: './main/main',
                    best: './bestSeller',
                    content: './content',
                    signinStatus: false,
                    userName: false
                });
            }
            } catch (err1){
                throw err1;
            } 
        });
    });

router.post('/', function(req, res){
    let book = req.body.bookinfo;
    cMain.getBookInfo(book, (rows) => {
        res.render('main/bookinfo', {
            signinStatus: true,
            userName: req.session.userName,
            userid: req.session.uid,
            rows: rows
        })
    })
})

router.post('/buynow', function(req, res){
    try{
        let book_index = Number(req.body.bookindex1);
        let book_price = req.body.bookprice1;
        let id = req.session.uid;
        cMain.getCash(id, (credit) => {
            if (credit.length !== 0){
                let currentCash = credit[0].cash;
                if (currentCash < book_price){
                    return res.send("<script>alert('잔액이 부족합니다.');history.back();</script>")
                } else {
                    let updateCash = currentCash - book_price;
                    let rate = Number(req.body.salesrate) + 1
                    cMain.addOrder(id, book_index);
                    cMain.updatePayment(updateCash, id);
                    cMain.rateIncrease(rate, book_index);
                    return res.send("<script>alert('주문이 완료되었습니다.');history.back();</script>")
                }
            } else {
                return res.send("<script>alert('사용가능한 카드가 없습니다.');history.back();</script>")
            }
            
        })
    } catch (err1) {
        throw err1;
    }

})

router.post('/gobasket', function(req, res){
    try{
        let book_index = Number(req.body.bookindex2);
        let id = req.session.uid;
        // cMain.getBasket(id, book_index, (basket) => {
        //     console.log(basket);
        // })
        cMain.getBasket(id, book_index, (basket) => {
            if(basket.length > 0){
                cMain.addBasketDup(basket[0].book_value + 1, id, book_index);
                return res.send("<script>alert('동일한 상품이 장바구니에 추가되었습니다.');history.back();</script>");
            } else {
                cMain.addBasket(id, book_index);
                return res.send("<script>alert('새로운 상품이 장바구니에 추가되었습니다.');history.back();</script>");
            }
        });
    } catch (err1) {
        throw err1;
    }
});

    
router.get('/', function(req, res){
    res.render('html', {
        name: req.session.uid
    })
})



module.exports = router;
