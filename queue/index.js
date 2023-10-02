const amqp = require('amqplib')
require('dotenv');
const { dB } = require('../models');





let channel, queue = 'video_transcription'
(async function () {
    const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}`);
    channel = await connection.createChannel();
  
    await channel.assertQueue(queue, { durable: true });
  })()


  channel.consume(queue, async (msg) => {
    const videoPath = msg.content.toString();
  
    try {
      // Perform video transcription using Whisper API
    //   const transcription = await transcribeVideo(videoPath);
  
      // Save transcription to a file or database
      // For example, you can save it in the 'transcriptions' directory
      // fs.writeFileSync(`transcriptions/${videoPath}.txt`, transcription);
  
      console.log(`Transcription saved for ${videoPath}`);
    } catch (error) {
      console.error(`Error transcribing video: ${error.message}`);
    }
  
    channel.ack(msg);
  })



  console.log("queue active")