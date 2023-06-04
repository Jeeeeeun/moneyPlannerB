// 생성된 API가 잘 불러와지는지 확인하는 파일
import { pool } from "../app.js";

const getCurrencies = async () => {
  const connection = await pool.getConnection();
  console.log("DB 연결에 성공했습니다.");
  try {
    const [rows] = await connection.query(
      "SELECT country_code, country_name, concat(symbol, exchange_rate) as exchange_rate FROM currencies"
    );
    return rows;
  } catch (error) {
    console.error(error);
  } finally {
    connection.release();
  }
};

(async () => {
  const currencies = await getCurrencies();
  console.log(currencies);
})();
