const pool = require("../../db/db");
// 회원가입 페이지 GET
exports.join = async (req, res) => {
  try {
    return res.render("join", {
      signinStatus: false,
    });
  } catch (error) {
    console.log(error);
  }
};
// 회원가입 화면에서 "가입하기" 버튼을 눌렀을 때 실행되는 POST
exports.pjoin = async (req, res) => {
  try {
    const { uid, upw, uname } = req.body;
    // 중복 아이디 확인
    const idCheck = await pool.query("SELECT * FROM user WHERE user_id = ?", [
      uid,
    ]);
    // 가입 승인
    if (idCheck[0].length === 0) {
      const join = await pool.query("INSERT INTO user VALUES (?, ?, ?)", [
        uid,
        upw,
        uname,
      ]);
    } else {
      // 아이디 중복
      return res.send(
        "<script>alert('이미 가입된 아이디!'); location.href='/join';</script>"
      );
    }
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

// 로그인 페이지 GET
exports.signin = async (req, res) => {
  try {
    // 로그인 된 상태로 로그인 화면에 들어오는 경우 -> ERROR (예외: 로그아웃 주소 -> signin)
    if (req.session.uid) {
      delete req.session.uid;
      req.session.save(function () {
        return res.redirect("/");
      });
    } else {
      return res.render("signin", {
        signinStatus: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

// 로그인 화면에서 "로그인" 버튼을 눌렀을 때 실행되는 POST
exports.psignin = async (req, res) => {
  try {
    // WEB에서 사용자가 입력한 아이디 비밀번호를 가져온다.
    const { uid, upw } = req.body;
    // 사용자 정보 비교
    const isUser = await pool.query(
      "SELECT * FROM user WHERE user_id = ? AND user_pw = ?",
      [uid, upw]
    );
    // 사용자가 입력한 아이디가 DB에 존재하지 않을 때
    if (isUser[0].length === 0) {
      return res.send(
        "<script>alert('로그인 정보 불일치'); location.href='/signin';</script>"
      );
    } else {
      // 일치한다면 세션에 uid 속성을 추가하여 사용자 아이디를 입력한 후 저장
      req.session.uid = uid;
      req.session.save(function () {
        return res.redirect("/");
      });
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

// 메인화면에서 검색 기능
exports.search = async (req, res) => {
  try {
    // flag 변수: 사용자 로그인이 되어 있을 때와 아닐 떄를 구분
    let flag = false;
    // 세션에 로그인 정보가 있다면 flag를 true로 설정하여 signinStatus를 true로 준다.
    if (req.session.uid) {
      flag = true;
    }
    // 사용자가 WEB에서 검색 창에 입력한 내용 가져오기
    const { search } = req.body;
    // 검색어 관련 도서 찾기
    const result = await pool.query(
      "SELECT * FROM book WHERE book_name LIKE ?",
      ["%" + search + "%"]
    );
    // 검색 결과 없을 시
    if (result[0].length === 0) {
      return res.send(
        '<script>alert("검색된 내용이 없습니다."); location.href="/";</script>'
      );
    } else {
      // 검색된 결과 디스플레이
      return res.render("index", {
        signinStatus: flag,
        books: result[0],
        keyword: search,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// 마이페이지
exports.mypage = async (req, res) => {
  try {
    // 개인정보 가져오기
    const getMyInfo = await pool.query("SELECT * FROM user WHERE user_id = ?", [
      req.session.uid,
    ]);
    // 배송지 & 카드 정보 가져오기
    const address = await pool.query(
      "SELECT * FROM address WHERE user_user_id = ?",
      [req.session.uid]
    );
    const card = await pool.query(
      'SELECT *, concat(card_num, " | ", card_type, " | ", card_date) AS mycard FROM card WHERE user_user_id = ?',
      [req.session.uid]
    );
    return res.render("mypage", {
      signinStatus: true,
      user: getMyInfo[0],
      address: address[0],
      card: card[0],
    });
  } catch (error) {
    console.log(error);
  }
};

// 마이페이지 배송지 삭제
exports.delAddress = async (req, res) => {
  try {
    let { address_id } = req.params;
    // 배송지 삭제
    const delAddress = await pool.query(
      "DELETE FROM address WHERE address_id = ?",
      [address_id]
    );
    return res.redirect("/mypage");
  } catch (error) {
    console.log(error);
  }
};

// 카드 삭제
exports.delCard = async (req, res) => {
  try {
    let { card_id } = req.params;
    // 배송지 삭제
    const delAddress = await pool.query("DELETE FROM card WHERE card_id = ?", [
      card_id,
    ]);
    return res.redirect("/mypage");
  } catch (error) {
    console.log(error);
  }
};

// 배송지 추가
exports.addAddress = async (req, res) => {
  try {
    let { new_post, new_basic, new_detail } = req.body;
    if (new_post === "" || new_basic === "" || new_detail === "") {
      return res.send(
        "<script>alert('입력 정보를 다시 확인해주세요.'); location.href='/mypage';</script>"
      );
    }
    // 배송지 추가
    const addAddress = await pool.query(
      "INSERT INTO address VALUES (?, ?, ?, ?, ?)",
      [null, new_post, new_basic, new_detail, req.session.uid]
    );
    return res.redirect("/mypage");
  } catch (error) {
    console.log(error);
  }
};
// 카드 추가
exports.addCard = async (req, res) => {
  try {
    let { new_num, new_date, new_type } = req.body;
    if (new_num.length !== 16 || new_date === "" || new_type === "") {
      return res.send(
        "<script>alert('입력 정보를 다시 확인해주세요.'); location.href='/mypage';</script>"
      );
    }
    // 카드 추가
    const addCard = await pool.query(
      "INSERT INTO card VALUES (?, ?, ?, ?, ?)",
      [null, new_num, new_date, new_type, req.session.uid]
    );
    return res.redirect("/mypage");
  } catch (error) {
    console.log(error);
  }
};
