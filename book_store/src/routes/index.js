var express = require('express');
var router = express.Router();
var connection = require('../database/db');
var session = require('express-session');
var MySQLStore = require('express-mysql-session');

const cMain = require('../controllers/mainController');

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
router.get('/', function(req, res){
    res.render('html', {
        name: req.session.uid
    })
})

module.exports = router;
