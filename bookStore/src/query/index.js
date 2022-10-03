// 모든 책 정보 가져와서 메인 화면에 배치
exports.get_Books = "SELECT * FROM book";

// 메인 화면에서 책을 클릭하면 넘어가는 해당 책 상세페이지
exports.get_Books_detail = "SELECT * FROM book WHERE id = ?";