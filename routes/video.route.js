const express = require("express")
const { uploadMovie, uploadThumbNail, uploadMovieWithThumbNail} = require('../middlewares/upload');
const { videoController } = require("../controllers");

const router = express.Router()

//  uploadMovieWithThumbNail.fields([{ name: 'movie', maxCount: 1 }, { name: 'thumbNail', maxCount: 1 }]), validate(movieValidation.uploadMovies), movieController.uploadMovies

router.post("/upload", videoController.recordAndSave)
router.post("/initialize", videoController.initializer)
// router.post("/upload", uploadMovie.single("video"), videoController.uploadMovies)
router.get("/", videoController.getMovies)
router.all("/:id", videoController.streamMovies)


module.exports = router