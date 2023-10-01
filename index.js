const http = require("http")
const express = require("express")
const app = express()
const compression = require("compression")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const xss = require("xss-clean")
const path = require("path")
const createError = require("http-errors")
const ApiError = require("./utils/ApiError")
const amqp = require('amqplib')
const openai = require('openai')
const { errorConverter, errorHandler } = require("./middlewares/error")
require('dotenv');


const queue = 'video_transcription'

let channel;
// (async function () {
//     const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}`);
//     channel = await connection.createChannel();
  
//     await channel.assertQueue(queue, { durable: true });
//   })()


//   channel.consume(queue, async (msg) => {
//     const videoPath = msg.content.toString();
  
//     try {
//       // Perform video transcription using Whisper API
//       const transcription = await transcribeVideo(videoPath);
  
//       // Save transcription to a file or database
//       // For example, you can save it in the 'transcriptions' directory
//       // fs.writeFileSync(`transcriptions/${videoPath}.txt`, transcription);
  
//       console.log(`Transcription saved for ${videoPath}`);
//     } catch (error) {
//       console.error(`Error transcribing video: ${error.message}`);
//     }
  
//     channel.ack(msg);
//   })




const indexRouter = require("./routes/index")
app.use(express.json())
app.use(express.urlencoded( { extended: false}))
app.use(cookieParser())
app.use("/videos", express.static(path.join(__dirname, "public")))
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
app.use(compression())
app.use(cors())
app.options("*", cors())

app.use("/", indexRouter)

app.use((req, res, next) => {
    next(new ApiError(404))
})
app.use(errorConverter)
app.use(errorHandler)




const server = http.createServer(app)
const port = process.env.PORT || 3001



const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.info("server closed")
            process.exit(1)
        })
    }
    else {
        process.exit(1)
    }
}

const unexpectedHandler = (err) => {
    console.error(err)
    exitHandler()
}

const onError = () => {}
const onListening = () => {
    const addr = server.address()
    const bind  = typeof addr == "string" ? "pipe " + addr : "port " + addr
    console.log(bind)
}





process.on("uncaughtException", unexpectedHandler)
process.on("unhandledRejection", unexpectedHandler)
process.on("SIGTERM", () => {
    console.info("SIGTERM received")
    if (server) {
        server.close()
    }
})
server.on("listening", onListening)

server.listen(port, () => {
    console.log("server dey run")
})