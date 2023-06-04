import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "moneyPlanner",
            description: "가계부 프로그램"
        },
        servers: [
            {
                url: "http://localhost:3000", // 요청 url
            },
        ],
    },
    apis: ["./routers/*.js", "./routers/user/*.js"], // swagger 파일 연동
}

const specs = swaggerJsdoc(options);

export default {swaggerUi, specs};