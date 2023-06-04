// Express 애플리케이션을 생성하고 설정하는 파일.
// package.json r.3의 type이 commonjs이면 require로 모듈 불러와야 함.
// cf, 만약 그 type이 module이면 import로 모듈 불러와야 함
const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

// 이런 게 미들웨어....
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
    apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

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

app.get("/getCurrency", async (req, res) => {
    try {
        console.log("DB 연결 성공");
        const [rows, fields] = await connection.query(
            "SELECT country_code, country_name, concat(symbol, exchange_rate) as exchange_rate FROM currencies"
        );
        res.send(rows);
    } catch (err) {
        console.log("DB 연결 실패");
        console.error(err);
    }
});

app.listen(port, () => {
    console.log(`port ${port}에서 서버가 실행되었습니다.`);
});
