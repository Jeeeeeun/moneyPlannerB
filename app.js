// Express 애플리케이션을 생성하고 설정하는 파일.
// package.json r.3의 type이 commonjs이면 require로 모듈 불러와야 함.
// cf, 만약 그 type이 module이면 import로 모듈 불러와야 함.
const express = require("express");
const connection = require("./config/database");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const authRouter = require("./routes/auth");
const currencyRouter = require("./routes/currency");

const app = express(); // express 모듈 불러옴
const port = 3000;

// swagger 옵션 설정
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

// 미들웨어 설정
app.use(
    cors({
        // 백엔드에서 CORS 설정해주는 부분.
        // 프론트엔드와 백엔드가 다른 도메인에서 실행될 경우 이 설정이 필요함.
        origin: "http://localhost:3001", // *: 모든 출처 허용 옵션. true를 써도 된다.
        credentials: true,
    })
);

// JSON 형태의 요청 본문 파싱 & 백엔드에서 사용할 수 있는 형태로 변환
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 라우터 설정
app.use("/api-docs", swaggerUI.serve);
app.get("/api-docs", swaggerUI.setup(specs));
app.use("/", authRouter);
app.use("/", authRouter);
app.use("/api/getCurrencyList", currencyRouter);

// 서버 실행
app.listen(port, () => {
    console.log(`port ${port}에서 서버가 실행되었습니다.`);
});
