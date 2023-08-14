const express = require('express');
const connection = require("../config/database");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/users');  // User 모델 가져오기
//const crypto = require('crypto');


// 회원가입 라우터
router.post("/signUp", async (req, res) => {
	
	const {name, email, password} = req.body;

	// 비밀번호 해시 생성
	// 소금 생성
	const salt = await bcrypt.genSalt(10); // 10: rounds(라운드 수). 암호화 작업의 복잡성을 의미
	// 사용자가 입력한 비밀번호와 소금을 함께 해시해서 암호화된 비밀번호 hashedPassword를 생성함.
	const hashedPassword = await bcrypt.hash(password, salt);
	
	try {
		// 회원가입 정보를 DB에 저장
		const newUser = await User.create({
			name: name,
			email: email,
			password: hashedPassword
		});

		res.setHeader('Content-Type', 'application/json; charset=utf-8'); // 한글 인코딩 깨짐 방지 설정
		res.status(201).json({message: "회원가입이 완료되었습니다."});
	} catch (error) {
		console.error("회원가입 도중 오류가 발생했습니다.", error);
			res.setHeader('Content-Type', 'application/json; charset=utf-8'); // 한글 인코딩 깨짐 방지 설정
			res.status(500).json({message: "회원가입 도중 오류가 발생했습니다."});
	}
});

// 로그인 라우터
router.post("/login", async (req, res) => {

	// 임시 secret key 발급 코드
	//const secret = crypto.randomBytes(32).toString('hex');
	//console.log('Generated secret: ', secret);

	// HTTP 요청 본문에 포함된 email과 password를 가저옴
	const {email, password} = req.body;

	try {

		const user = await User.findOne({where: {email}});
		
		// 유저가 없을 경우
		if (user === null) {
			return res.status(401).send('존재하지 않는 이메일입니다.');
		}
		
		const isPwValid = await bcrypt.compare(password, user.password);

		if (isPwValid) {
			const token = jwt.sign({userEmail: user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});

			res.cookie('token', token, {
				httpOnly: true,
				expires: new Date(Date.now() + 1 * 3600000), // 1시간 후 쿠키 만료
				secure: false, // 나중에 https로만 접근할 수 있게 하려면 값을 process.env.NODE_ENV === 'production'로 바꾸기
				sameSite: 'Lax', // CSRF 공격 방지를 위한 설정
			})

			res.status(200).json({token: token});
		} else {
			res.status(401).send('비밀번호가 일치하지 않습니다.');
		}
		
	} catch (error) {
		res.status(500).send('서버 에러');
	}
});


// 로그아웃 라우터
router.post('/logout', async (req, res) => {
	// 토큰을 삭제하는 쿠키를 설정
	res.cookie('token', '', {
		httpOnly: true,
		expires: new Date(0), // 만료시간을 과거로 설정해 토큰을 삭제
		secure: false,
		sameSite: 'Lax',
	})

	res.status(200).send('로그아웃 되었습니다.')
})
module.exports = router;