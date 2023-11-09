/* // Fetch Number of Questions From JSON Object
function getQuestionsWithXMLHttpRequest() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        let questionsObject = JSON.parse(this.responseText)
      console.log(questionsObject);
    }
  };
  myRequest.open("GET", "JSON/questions.json", true);
  myRequest.send();
}
getQuestionsWithXMLHttpRequest();

*/
// Select Elements

let quizArea = document.querySelector(".quiz-area ");
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpans = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let currentIndex = 0;
let rightAnswers = 0;
let question = document.querySelector(".quiz-area h2");
let answerArea = document.querySelector(".answers-area");
let submit = document.querySelector(".submit-button");
let results = document.querySelector(".results");
let countdownInterval;
let countdownElement = document.querySelector(".count-down");

function getQuestionsWithFetch() {
  fetch("JSON/questions.json")
    .then((res) => res.json())
    .then((questions) => {
      // Start CountDown
      countdown(105, questions.length);

      createBullets(questions.length);
      addQData(questions[currentIndex], questions.length);
      submit.onclick = () => {
        let theRightAnswer = questions[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(theRightAnswer, questions.length);
        question.innerHTML = "";
        answerArea.innerHTML = "";
        addQData(questions[currentIndex], questions.length);

        BulletsClass();

        clearInterval(countdownInterval);
        countdown(105, questions.length);
        //Show Results
        showResults(questions.length);
      };
    });
  // .catch((error) => console.error("Error:", error));
}
getQuestionsWithFetch();

function createBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");
    if (i === 0) {
      span.className = "on";
    }
    bulletsSpans.appendChild(span);
  }
}

function addQData(obj, count) {
  if (currentIndex < count) {
    // Create Quiz title

    question.textContent = obj.title;
    // Create Answers
    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      let radioInput = document.createElement("input");

      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.name = "question";
      radioInput.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        radioInput.checked = true;
      }
      theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(theLabelText);
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      answerArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, qCount) {
  let answers = document.getElementsByName("question");
  let theChosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }
  console.log(`right is ${rAnswer}`);
  console.log(`chosen is ${theChosenAnswer}`);
  if (rAnswer === theChosenAnswer) {
    rightAnswers++;
  }
  console.log(rightAnswers);
}
function BulletsClass() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let bulletsSpansArray = Array.from(bulletsSpans);
  bulletsSpansArray.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
  console.log(bulletsSpansArray);
}

function showResults(count) {
  if (currentIndex === count) {
    let theResult;

    quizArea.remove();
    answerArea.remove();
    submit.remove();
    bullets.remove();
    results.style.display = "block";

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResult = `<span class"good">Good</span> Your Right Answers Is ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResult = `<span class"perfect">Perfect</span> Your Right Answers Is ${rightAnswers} From ${count}`;
    } else {
      theResult = `<span class"bad">Not Good</span> Your Right Answers Is ${rightAnswers} From ${count}`;
    }
    results.innerHTML = theResult;
  }
  console.log(currentIndex);
}
function countdown(duration, count) {
  if (currentIndex < count) {
    let min, sec;
    countdownInterval = setInterval(function () {
      min = parseInt(duration / 60);
      sec = parseInt(duration % 60);

      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;

      countdownElement.innerHTML = `${min}:${sec}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submit.click();
      }
    }, 1000);
  }
}
