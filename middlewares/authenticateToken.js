const jwt = require('jsonwebtoken');

// req: HTTP 요청 객체. 클라이언트로부터 들어온 요청 정보를 포함함.
// res: HTTP 응답 객체. 서버에서 응답할 정보를 포함함. 응답을 완료하는 데 사용됨.
// next: 다음 미들웨어나 핸들러로 이동하기 위한 함수. 다음 미들웨어로 이동할 때 사용됨.
const authenticateToken = (req, res, next) => {
    
    // 토큰 추출
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split('')[1];

    // 토큰 유무 확인
    if (!token) return res.sendStatus(401); // 토큰이 없으면 401 unauthorized 상태 반환

    // 토큰 검증
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // 올바르지 않은 토큰 처리
        if (err) return res.sendStatus(403); // 403 Forbidden 상태 반환
        
        // 토큰에서 사용자 정보 파싱
        req.user = user;
        
        // 다음 미들웨어로 이동
        next();
    });
}

module.exports = {
    authenticateToken: authenticateToken,
}