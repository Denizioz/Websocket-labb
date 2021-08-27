const socket = io("/Quiz");
const questionText = document.getElementById("question");
const answer1 = document.getElementById("opt1");
const answer2 = document.getElementById("opt2");
const answer3 = document.getElementById("opt3");
const answer4 = document.getElementById("opt4");

answer1.addEventListener("click", () => {
  socket.send(input.value);
  console.log(answer1.value);
});

console.log("hej");

socket.on("stateQuestion", (question, msg1, msg2, msg3, msg4) => {
  questionText.innerHTML = question;
  answer1.innerHTML = msg1;
  answer2.innerHTML = msg2;
  answer3.innerHTML = msg3;
  answer4.innerHTML = msg4;
});
