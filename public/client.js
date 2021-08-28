const socket = io("/quiz")

const questionText = document.getElementById("questionText");
const answer1 = document.getElementById("opt1");
const answer2 = document.getElementById("opt2");
const answer3 = document.getElementById("opt3");
const answer4 = document.getElementById("opt4");
const points = document.getElementById("scoreCard")
const log = document.getElementById("log")
const activity = document.getElementById("activity")
const logRemover = document.getElementById("logRemover")

socket.on("quizData", (question, answerSend) => {
  questionText.innerText = question;
  answer1.innerText = answerSend[0];
  answer2.innerText = answerSend[1];
  answer3.innerText = answerSend[2];
  answer4.innerText = answerSend[3];
});

socket.on("activity", (onlineActivity, remover, score) => {
  activity.innerText = onlineActivity
  points.innerText = score
  if (remover === 0) {
    document.getElementById("logRemover").removeChild(document.getElementById("log"))
    let newLog = document.createElement("DL")
    newLog.setAttribute("id", "log")
    document.getElementById("logRemover").appendChild(newLog)
  }
})

socket.on("updateScore", (score, question, correctAnswer) => {
  points.innerText = score
  let questionNode = document.createElement("DT")
  let questionTextNode = document.createTextNode("Question: " + question)
  questionNode.appendChild(questionTextNode)
  document.getElementById("log").appendChild(questionNode)
  let answerNode = document.createElement("DD")
  let answerTextNode = document.createTextNode("Answer: " + correctAnswer + " /// Correct")
  answerNode.appendChild(answerTextNode)
  document.getElementById("log").appendChild(answerNode)
})

socket.on("updateScoreWrong", (question, answer) => {
  let questionNode = document.createElement("DT")
  let questionTextNode = document.createTextNode("Question: " + question)
  questionNode.appendChild(questionTextNode)
  document.getElementById("log").appendChild(questionNode)
  let answerNode = document.createElement("DD")
  let answerTextNode = document.createTextNode("Answer: " + answer + " /// Incorrect")
  answerNode.appendChild(answerTextNode)
  document.getElementById("log").appendChild(answerNode)
})

function pressButton(param) {
  let x = document.getElementById(param).innerText
  socket.emit("control", x)
}