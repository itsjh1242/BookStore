var express = require("express");
var router = express.Router();
// db
const pool = require("../../db/db");
// controller
const indexCtrl = require("../controllers/indexController");

/* localhost:3000을 입력했을 때의 라우터 */
router.get("/", async function (req, res, next) {
  try {
    let like = [];
    // 메인 화면 도서 정보: DB에 저장된 모든 책들의 정보를 가져와 도서 목록 리스트를 만들어준다.
    const books = await pool.query("SELECT * FROM book");
    // 로그인이 되어 있을 시: SESSION을 이용하여 로그인 여부를 판단
    // SigninStatus: 세션을 통해 로그인 여부가 확인되면 true값을 주어 로그인 된 화면을 다르게 나타낸다.
    // keyword: 검색 기능 차단 - keyword가 true일때와 false일때의 화면을 다르게 나타내기 위한 BOOLEAN

    // 베스트 셀러
    const getBestseller = await pool.query('SELECT * FROM book ORDER BY book_salesrate DESC LIMIT 5;');
    // 좋아요 수
    for(let i = 0; i < getBestseller[0].length; i++){
      const book_like = await pool.query('SELECT COUNT(*) AS like_amount FROM booklike WHERE book_like = 0 AND book_book_id = ?;', [
        getBestseller[0][i].book_id
      ]);
      like.push(book_like[0][0].like_amount)
    }
    console.log(like);
    if (req.session.uid) {
      return res.render("index", {
        signinStatus: true,
        books: books[0],
        keyword: false,
        bestseller: getBestseller[0],
        bestsellerLike: like,
      });
      // 로그인이 안되어 있을 시
    } else {
      return res.render("index", {
        signinStatus: false,
        books: books[0],
        keyword: false,
        bestseller: getBestseller[0],
      });
    }
  } catch (error) {
    console.log(error);
  }
});



// 회원가입
router.get("/join", indexCtrl.join);
router.post("/join", indexCtrl.pjoin);
// 로그인
router.get("/signin", indexCtrl.signin);
router.post("/signin", indexCtrl.psignin);
// 검색
router.post("/search", indexCtrl.search);
// 마이페이지
router.get("/mypage", indexCtrl.mypage);
// 마이페이지 배송지 삭제
router.post("/mypage/deladdress/:address_id", indexCtrl.delAddress);
// 마이페이지 카드 삭제
router.post("/mypage/delcard/:card_id", indexCtrl.delCard);
// 마이페이지 배송지 추가
router.post("/mypage/addaddress", indexCtrl.addAddress);
// 마이페이지 카드 추가
router.post("/mypage/addcard", indexCtrl.addCard);

module.exports = router;
