const path = require("path");

const axios = require("axios").default

const express = require("express");
const app = express();

const http = require("http");
const httpServer = http.createServer(app);

const io = require("socket.io")(httpServer);

app.use(express.static(path.join(__dirname, "/public/")));

let players = 0
let sessionOwner = ""
let shuffle = []
let answerSend = []
let correctAnswer = ""
let question = ""
let score = 0
let onlineActivity = "offline"
let remover = 0


const getQuestions = async () => {
  try {
    await axios.get("https://opentdb.com/api.php?amount=1&type=multiple")
      .then((response) => {
        {
          let data = response.data.results[0]
          question = data.question
          correctAnswer = data.correct_answer
          shuffle = data.incorrect_answers
          shuffle.push(correctAnswer)
          // Behövdes inte ett NPM paket för att skicka svaren i slumpmässig ordning :)          
          for (let i = shuffle.length; i > 0; i--) {
            let random = Math.floor(Math.random() * i)
            answerSend.push(shuffle[random])
            shuffle.splice(random, 1)
          }
        }
      }
      )
  } catch (err) {
    console.error(err)
  }
}




io.of("/quiz").on("connect", async socket => {
  if ((players === 0)) {
    onlineActivity = "Connected"
    remover = 1
    io.of("/quiz").emit("activity", onlineActivity, remover, score)
    socket.join("player");
    players++;
    sessionOwner = socket.id
    await getQuestions()
    io.emit("quizData", question, answerSend)
    answerSend = []
  } else {
    socket.join("spectator");
    onlineActivity = "Connected"
    io.of("/quiz").emit("activity", onlineActivity, remover, score)
  }

  await getQuestions()
  io.of("/quiz").emit("quizData", question, answerSend)
  answerSend = []

  socket.on("control", async (x) => {
    if (socket.id !== sessionOwner) {
      return
    }

    if (x === correctAnswer) {
      score++
      io.of("/quiz").emit("updateScore", score, question, correctAnswer)
      await getQuestions()
      io.of("/quiz").emit("quizData", question, answerSend)
      answerSend = []
    } else {
      io.of("/quiz").emit("updateScoreWrong", question, x)
      await getQuestions()
      io.of("/quiz").emit("quizData", question, answerSend)
      answerSend = []
    }
  })

  socket.on("disconnecting", () => {
    if (socket.id === sessionOwner) {
      players--
      onlineActivity = "Disconnected"
      remover = 0
      score = 0
      io.of("/quiz").emit("activity", onlineActivity, remover, score)
      answerSend = []
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected.`);
  });
})
httpServer.listen(3000);
