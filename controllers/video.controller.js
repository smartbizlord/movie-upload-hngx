const httpStatus = require('http-status');
const catchAsync = require('../utils/asyncly');
const { movieService } = require('../services');

const getMovies = catchAsync(async (req, res) => {
    const movies = await movieService.moviesWithoutAuth();
    res.status(httpStatus.OK).send(movies)
});

const streamMovies = catchAsync(async (req, res) => {
    movie = req.params?.id;
    console.log(movie, "movieiD")
    req.movie = movie;
    await movieService.movieStream(req, res);
});

const downloadMovies = catchAsync(async (req, res) => {
    movie = req.params?.id;

    req.movie = movie;
    await movieService.movieDownload(req, res);
});

const uploadMovies = catchAsync(async (req, res) => {
    await movieService.movieUpload(req, res)
    res.status(httpStatus.NO_CONTENT).send({
        message : "Movie upload successful"
    });
})

const shareStream = catchAsync(async (req, res) => {
    req.movie = req.params?.id;;
    await movieService.shareStream(req, res)
})





module.exports = {
    getMovies,
    streamMovies,
    downloadMovies,
    uploadMovies,
    shareStream,
}