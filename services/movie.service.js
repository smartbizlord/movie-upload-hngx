const httpStatus = require('http-status');
const { dB } = require('../models');
const ApiError = require('../utils/ApiError');
const fs = require('fs');

const moviesWithoutAuth = async () => {
        const videos = await dB.videos.find({ isActive: true, })
            .select("movieLocation shareLink")
        return {
            message: "success",
            videos,
        };
};

const movieStream = async (req, res) => {

    
    const {originalUrl, headers, movie} = req;
    const tisMovie = await dB.videos.findOne({_id: movie, isActive: true})
    if(!tisMovie) {  res.end()  }
    else { 
    const fileName = tisMovie.uniqueel
    range = headers.range;

    const videoPath = `${process.cwd()}/public/${fileName}`;
    const videoSize = fs.statSync(videoPath).size;
    const maxChunkSize = 1 * 1024 * 1024; // 1MB
    const maxChunks = 10;

    if(!range) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'video/mp4');

        fs.createReadStream(videoPath).pipe(res);
        // res.end()
    } else {

    const positions = range.replace(/bytes=/, '').split('-');
    const start = parseInt(positions[0], 10);
    let end = positions[1] ? parseInt(positions[1], 10) : videoSize - 1;

    if (end - start > maxChunkSize) {
        end = start + maxChunkSize;
    }

    // Check if the requested number of chunks exceeds the maximum
    if (Math.ceil((end - start + 1) / maxChunkSize) > maxChunks) {
        end = start + maxChunkSize * maxChunks;
    }

    // Ensure the end of the range does not exceed the end of the video
    if (end > videoSize - 1) {
        end = videoSize - 1;
    }

    res.statusCode = 206;
    res.setHeader('Content-Range', `bytes ${start}-${end}/${videoSize}`);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Length', end - start + 1);
    res.setHeader('Content-Type', 'video/mp4');

    fs.createReadStream(videoPath, { start, end }).pipe(res);
}}
}

const movieDownload = async (req, res) => {

    
    const {movie} = req;
    const tisMovie = await dB.videos.findOne({_id: movie, isActive: true})
    if(!tisMovie) {res.end()}
    else { const fileName = tisMovie.uniqueel
        const filArr = fileName.split('.')
    const downloadName = `${filArr[0]}_Smovies.net.${filArr[1]}`

    const videoPath = `./public/${fileName}`;

   

    res.statusCode = 200;
    res.setHeader('Content-Disposition', `attachment; filename=${downloadName}`);
    res.setHeader('Content-Type', 'video/mp4');

    fs.createReadStream(videoPath).pipe(res);}

}


const movieUpload = async (req, res) => {
    if(!req.file) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You did not upload any recording');
    } else {

        const movieLocation = `https://movie-upload-hngx.onrender.com/recordings/${req.file.filename}`
        const shareLink = `https://movie-upload-hngx.onrender.com/share/${req.file.filename}`
        const uniqueel = req.file.filename

        await dB.videos.create({
            movieLocation,
            shareLink,
            uniqueel,
            isActive: true,
        })

    }
}

module.exports = {
    moviesWithoutAuth,
    movieStream,
    movieDownload,
    movieUpload,
}