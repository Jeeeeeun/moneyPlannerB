// Express 애플리케이션을 생성하고 설정하는 파일.
// package.json r.3의 type이 commonjs이면 require로 모듈 불러와야 함.
// cf, 만약 그 type이 module이면 import로 모듈 불러와야 함.
const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express(); // express 모듈 불러옴

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API",
            version: "1.0.0",
            description: "API documentation",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["routes/*.js"],
};

const specs = swaggerJsDoc(options);

// 백엔드에서 CORS 설정해주는 부분.
// 프론트엔드와 백엔드가 다른 도메인에서 실행될 경우 이 설정이 필요함.
app.use(
    cors({
        origin: "*", // 모든 출처 허용 옵션. true를 써도 된다.
        credentials: true,
    })
);

app.use("/api-docs", swaggerUI.serve);
app.get("/api-docs", swaggerUI.setup(specs));

const port = 3000;

dotenv.config();

const connection = mysql.createConnection({
    // connection 생성
    host: process.env.DB_HOST, // process.env 객체로 .env 파일에 작성한 환경 변수를 데려옴.
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: "moneyPlanner",
});

app.get("/getCurrencyList", async (req, res) => {
    try {
        connection.query(
            "SELECT country_code, country_name, concat(symbol, exchange_rate) as exchange_rate FROM currencies",
            function (err, result) {
                res.send(result);
            }
        );
    } catch (err) {
        console.error(err);
    }
});

// JSON 형태의 요청 본문 파싱 & 백엔드에서 사용할 수 있는 형태로 변환
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// 회원가입 엔드포인트 설정
app.post("/", async (req, res) => {
	
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

app.listen(port, () => {
    console.log(`port ${port}에서 서버가 실행되었습니다.`);
});
