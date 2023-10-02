const httpStatus = require('http-status');
const catchAsync = require('../utils/asyncly');
const { movieService } = require('../services');
const ApiError = require('../utils/ApiError');
const fs = require("fs");
const path = require("path");
const amqp = require("amqplib")
require('dotenv');

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

const recordAndSave = async (req, res) => {
    const chunkIndex = req.body.index;
    const videoChunk = req.body.data;
    const recordingId = req.body.recordingId;
    const hasNextChunk = req.body.hasNextChunk;

    const tempDir = path.join(process.cwd() + "/temp")
    const recordingsDir = path.join(process.cwd() + "/public")

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }
  
    const tempFilePath = `${tempDir}/${recordingId}_${chunkIndex}.chunk`;

    if (!hasNextChunk) {
      // No more chunks expected, send video for transcription
      const tempFilePaths = fs.readdirSync(tempDir).filter(file => file.startsWith(`${recordingId}_`));
      const chunks = tempFilePaths.map(filePath => fs.readFileSync(`${tempDir}/${filePath}`));
      const completeRecording = Buffer.concat(chunks);

      // Save the complete recording
      const outputFilePath = `${recordingsDir}/${recordingId}.mp4`;
      fs.writeFile(outputFilePath, completeRecording, 'base64', (err) => {
        if (err) {
          return res.status(500).send(err);
        }

        console.log(`Recording saved at ${outputFilePath}`);

        // Clean up temporary files
        tempFilePaths.forEach(filePath => fs.unlinkSync(`${tempDir}/${filePath}`));

        // Connect to RabbitMQ and send video for transcription
      //   amqp.connect(`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}`).then((connection) => {
      //     return connection.createChannel().then((channel) => {
      //       const queue = 'video_transcription';

      //       channel.assertQueue(queue, { durable: true });
      //       channel.sendToQueue(queue, Buffer.from(outputFilePath)); // Send the file path

      //       console.log('Sent video for transcription');

      //       setTimeout(() => {
      //         connection.close();
      //       }, 500);
      //     });
      //   }).catch(console.warn);

        res.sendStatus(200);
      });
    }
  
    if (videoChunk) {
      fs.writeFile(tempFilePath, videoChunk, 'base64', (err) => {
        if (err) {
          console.log(err, "there was a problem saving the chunk to disk")
          return new ApiError(httpStatus.BAD_GATEWAY, "Movie Upload failed");
        }
    
        console.log(`Received and saved chunk ${chunkIndex}`);
    
         {
          res.sendStatus(200);
        }
      });
    }
  }

  const initializer = () => {}



  const newFunc = async (req, res) => {
    const chunkIndex = req.body.index;
    const videoChunk = req.body.data;
    const recordingId = req.body.recordingId;
    const hasNextChunk = req.body.hasNextChunk;

    const tempDir = path.join(process.cwd() + "/temp")
    const recordingsDir = path.join(process.cwd() + "/public")

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }
  
    const tempFilePath = `${tempDir}/${recordingId}_${chunkIndex}.chunk`;
  
    fs.writeFile(tempFilePath, videoChunk, 'base64', (err) => {
      if (err) {
        return new ApiError(httpStatus.BAD_GATEWAY, "Movie Upload failed");
      }
  
      console.log(`Received and saved chunk ${chunkIndex}`);
  
      if (!hasNextChunk) {
        // No more chunks expected, send video for transcription
        const tempFilePaths = fs.readdirSync(tempDir).filter(file => file.startsWith(`${recordingId}_`));
        const chunks = tempFilePaths.map(filePath => fs.readFileSync(`${tempDir}/${filePath}`));
        const completeRecording = Buffer.concat(chunks);
  
        // Save the complete recording
        const outputFilePath = `${recordingsDir}/${recordingId}.mp4`;
        fs.writeFile(outputFilePath, completeRecording, 'base64', (err) => {
          if (err) {
            return res.status(500).send(err);
          }
  
          console.log(`Recording saved at ${outputFilePath}`);
  
          // Clean up temporary files
          tempFilePaths.forEach(filePath => fs.unlinkSync(`${tempDir}/${filePath}`));
  
          // Connect to RabbitMQ and send video for transcription
          amqp.connect('amqp://localhost').then((connection) => {
            return connection.createChannel().then((channel) => {
              const queue = 'video_transcription';
  
              channel.assertQueue(queue, { durable: true });
              channel.sendToQueue(queue, Buffer.from(outputFilePath)); // Send the file path
  
              console.log('Sent video for transcription');
  
              setTimeout(() => {
                connection.close();
              }, 500);
            });
          }).catch(console.warn);
  
          res.sendStatus(200);
        });
      } else {
        res.sendStatus(200);
      }
    });
  }





module.exports = {
    getMovies,
    streamMovies,
    downloadMovies,
    uploadMovies,
    shareStream,
    recordAndSave,
    initializer,
}