const mongoose = require("mongoose")
const Schema = mongoose.Schema

  const Movies = Schema({
    movieLocation : {
      type: String,
      required: true
    },
    shareLink : {
      type: String,
      required: true,
    },
    uniqueel: {
        type: String,
        required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  }, { timestamps: true });

  module.exports = Movies