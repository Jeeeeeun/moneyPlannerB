const express = require("express");
const connection = require("../config/database");
const dotenv = require("dotenv");
const { authenticateToken } = require('../middlewares/authenticateToken');

dotenv.config();

const router = express.Router();

router.get("/getCurrencyList", authenticateToken, async (req, res) => {
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

module.exports = router;
