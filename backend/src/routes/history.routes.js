const router = require("express").Router();
const { getHistory } = require("../controller/history.controller");

router.get("/", getHistory);

module.exports = router;
