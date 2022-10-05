const express = require("express");
const session = require("express-session");
const sessionStore = require("../../db/session");
const router = express.Router();

// exports
const pool = require("../../db/db");
const query = require("../query/index");

/* 세션 보안 */
var options = {
  host: "localhost",
  user: "root",
  password: "itsjh0112",
  port: 3306,
  database: "bookstore",
};

router.use(
  session({
    secret: "asdalknsdlkankdnl",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);

/* GET home page. */
router.get("/", async (req, res) => {
  try {
    const books = await pool.query(query.get_Books);
    if (req.session.uid) {
      res.render("index", {
        books: books[0],
        num: books[0].length,
        signinStatus: true,
      });
    } else {
      res.render("index", {
        books: books[0],
        num: books[0].length,
        signinStatus: false,
      });
    }
  } catch (error) {
    return res.redirect("/");
  }
});

// 책 상세정보
router.get("/book/:book_id", async (req, res) => {
  try {
    if (req.session.uid) {
      const book = await pool.query(query.get_Books_detail, [
        req.params.book_id,
      ]);
      res.render("book", {
        bid: req.params.book_id,
        book: book[0][0],
        signinStatus: true,
      });
    } else {
      res.send(
        "<script>alert('로그인이 필요합니다.'); location.href='/';</script>"
      );
    }
  } catch (error) {
    return res.redirect("/");
  }
});

module.exports = router;
