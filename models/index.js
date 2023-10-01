const mongoose = require("mongoose")
const dotenv = require('44');
const path = require("path")
const video = require('./video')

dotenv.config({ path: path.join(__dirname, '../.env') })

const mongooseInstance = mongoose.connect(process.env.DB_URL)
const dB = {};


mongooseInstance
.then(async() => {
  console.info('Database is good');
})
.catch(err => {
  console.error('Database no dey work', err);
})

dB.videos = mongoose.model('videos', video)




module.exports = {
  dB
};