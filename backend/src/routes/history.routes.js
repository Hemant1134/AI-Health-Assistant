const router = require("express").Router();
const { getHistory, getChatData } = require("../controller/history.controller");

router.get("/",                     getHistory);
router.get("/:id/details",          getChatData)

module.exports = router;
