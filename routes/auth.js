const express = require('express');
const connection = require("../config/database");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require('jsonwebtoken');


// 회원가입 라우터
router.post("/", async (req, res) => {
	
	const {name, email, password} = req.body;

	// 비밀번호 해시 생성
	// 소금 생성
	const salt = await bcrypt.genSalt(10); // 10: rounds(라운드 수). 암호화 작업의 복잡성을 의미
	// 사용자가 입력한 비밀번호와 소금을 함께 해시해서 암호화된 비밀번호 hashedPassword를 생성함.
	const hashedPassword = await bcrypt.hash(password, salt);
	
	// 회원가입 정보를 DB에 저장하는 query
	let query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
	// connection.query(
	//					SQL쿼리 문자열,
	//					SQL 쿼리에서 사용되는 값의 배열(쿼리 문자열의 ?와 일치하는 순서대로 대체됨),
	// 					쿼리 질의가 끝난 후 실행되는 콜백함수(오류 및 결과를 매개변수로 받아서 오류 발생 여부에 따라 적절한 응답을 처리)
	// 					)
	connection.query(query, [name, email, hashedPassword], (error, result) => {
		if (error) {
			console.error("회원가입 도중 오류가 발생했습니다.", error);
			res.setHeader('Content-Type', 'application/json; charset=utf-8'); // 한글 인코딩 깨짐 방지 설정
			res.status(500).json({message: "회원가입 도중 오류가 발생했습니다."});
		} else {
			res.setHeader('Content-Type', 'application/json; charset=utf-8'); // 한글 인코딩 깨짐 방지 설정
			res.status(201).json({message: "회원가입이 완료되었습니다."});
		}
	});
});

// 로그인 라우터
router.post("/", async (req, res) => {
	const user = await findUser(req.body.email, req.body.password);

	try {
		if (user) {
			const token = jwt.sign({userEmail: user.email}, 'YOUR_SECRET_KEY', {expiresIn: '1h'});
			res.status(200).json({token: token});
		} else {
			res.status(401).send('invalid credentials');
		}
	} catch (error) {
		res.status(500).send('Server error');
	}
});

module.exports = router;