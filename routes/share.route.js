const express = require("express")
const { videoController } = require("../controllers");

const router = express.Router()


router.get("/:id", videoController.downloadMovies)


module.exports = router