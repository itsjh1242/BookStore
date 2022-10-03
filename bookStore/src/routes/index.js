const express = require('express');
const session = require("express-session");
var MySQLStore = require('express-mysql-session');
const pool = require("../../db/db");
const sessionStore = require("../../db/session");
const router = express.Router();

/* 세션 보안 */
var options={
  host:'localhost',
  user: 'root',
  password: 'itsjh0112',
  port: 3306,
  database: 'bookstore'
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
