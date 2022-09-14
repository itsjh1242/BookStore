const express = require('express');
const session = require("express-session");
const pool = require("../db/db");
const sessionStore = require("../db/session");
const router = express.Router();

/* 세션 보안 */
router.use(
  session({
      secret: "bookstore",
      resave: false,
      saveUninitialized: true,
      store: sessionStore,
  })
);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
