const speech = require("@google-cloud/speech")
const fs = require("fs")

const main = async() => {
    const client = new speech.SpeechClient()
    const file = ""
    const audioBytes = file.toString("base64")

    const audio = {
        content: audioBytes,
    }
    const config = {
        encoding: "Linear16",
        sampleRateHertz: 16000,
        languageCode: "en-US",
    }
    const request = {
        audio,
        config,
    }

    const [response] = await client.recognize(request)

    const transcription = response?.map((result) => {
        return result.alternatives[0].transcript
    }).join("\n")

    return transcription
}

const generateTranscription = async(audioBytes) => {
    const client = new speech.SpeechClient()

    const audio = {
        content: audioBytes,
    }
    const config = {
        encoding: "Linear16",
        sampleRateHertz: 16000,
        languageCode: "en-US",
    }
    const request = {
        audio,
        config,
    }

    const [response] = await client.recognize(request)

    const transcription = response?.map((result) => {
        return result.alternatives[0].transcript
    }).join("\n")

    return transcription
}

module.exports = {
    generateTranscription,
}