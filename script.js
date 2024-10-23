const questions = [
  {
    question: "What is the brain of the computer?",
    answer: [
      { text: "Monitor", correct: false },
      { text: "CPU", correct: true },
      { text: "Keyboard", correct: false },
      { text: "Mouse", correct: false },
    ],
  },
  {
    question: "Which of the following is a programming language?",
    answer: [
      { text: "HTML", correct: false },
      { text: "CSS", correct: false },
      { text: "Python", correct: true },
      { text: "HTTP", correct: false },
    ],
  },
  {
    question: "Which device is used to input data into a computer?",
    answer: [
      { text: "Monitor", correct: false },
      { text: "Mouse", correct: true },
      { text: "Printer", correct: false },
      { text: "Speaker", correct: false },
    ],
  },
  {
    question: "What does RAM stand for?",
    answer: [
      { text: "Read Access Memory", correct: false },
      { text: "Random Access Memory", correct: true },
      { text: "Read Action Memory", correct: false },
      { text: "Random Application Memory", correct: false },
    ],
  },
  {
    question: "Which of the following is an output device?",
    answer: [
      { text: "Keyboard", correct: false },
      { text: "Mouse", correct: false },
      { text: "Monitor", correct: true },
      { text: "RAM", correct: false },
    ],
  },
  {
    question: "Which protocol is used to browse websites?",
    answer: [
      { text: "HTTP", correct: true },
      { text: "FTP", correct: false },
      { text: "SMTP", correct: false },
      { text: "SSH", correct: false },
    ],
  },
  {
    question: "What does GUI stand for?",
    answer: [
      { text: "Graphical User Interface", correct: true },
      { text: "General User Input", correct: false },
      { text: "Graphical Utility Input", correct: false },
      { text: "General Utility Interface", correct: false },
    ],
  },
  {
    question: "Which of the following is not an operating system?",
    answer: [
      { text: "Windows", correct: false },
      { text: "Linux", correct: false },
      { text: "Google Chrome", correct: true },
      { text: "macOS", correct: false },
    ],
  },
  {
    question: "What type of memory is non-volatile?",
    answer: [
      { text: "RAM", correct: false },
      { text: "ROM", correct: true },
      { text: "Cache", correct: false },
      { text: "Register", correct: false },
    ],
  },
  {
    question: "What is the main purpose of a firewall?",
    answer: [
      { text: "To encrypt data", correct: false },
      { text: "To prevent unauthorized access", correct: true },
      { text: "To store files", correct: false },
      { text: "To speed up the computer", correct: false },
    ],
  },
];

function credentials() {
 
  userName = document.getElementById("name").value;
  userEmail = document.getElementById("email").value;
  localStorage.setItem("userName",userName);
  localStorage.setItem("userEmail",userEmail);

}

const questionElement = document.getElementById("question");
const questionNumber = document.getElementById("questions-number");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");




let currentQuestionIndex = 0;
let score = 0;


function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  showQuestion();
}

function showQuestion() {
  resetQuestion();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNumber = currentQuestionIndex + 1;

  questionElement.innerHTML = questionNumber + ". " + currentQuestion.question;

  currentQuestion.answer.forEach((ans) => {
    const button = document.createElement("button");
    button.innerHTML = ans.text;
    button.classList.add("btn");
    answerButtons.appendChild(button);

    if (ans.correct) {
      button.dataset.correct = ans.correct;
    }

    button.addEventListener("click", selectAnswer);
  });
}

function resetQuestion() {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectBtn = e.target;
  const isCorrect = selectBtn.dataset.correct === "true";
  if (isCorrect) {
    selectBtn.classList.add("correct");
    score++;
  } else {
    selectBtn.classList.add("incorrect");
  }

  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
    storeData();
  }
}

function showScore() {
  resetQuestion();
  questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
  nextButton.setAttribute("onclick", "startTimer();");
}






startQuiz();

// ================================== data storing to the hubspot======================================================

function storeData() {
  let userName = localStorage.getItem("userName");
  let userEmail = localStorage.getItem("userEmail");

  if (!userName || !userEmail) {
    console.log('Please enter both your name and email.');
    return; 
  }


  if (score === undefined) {
   console.log('Score is undefined. Please ensure the quiz is completed.');
    return;
  }

 
  const formData = new URLSearchParams();
  formData.append('firstname', userName);
  formData.append('email', userEmail);
  formData.append('mobilephone', score);

  fetch('https://forms.hubspot.com/uploads/form/v2/47775151/7e96484a-4c5c-436a-93a9-e83900d01538', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  })
  .then(response => {
    if (response.ok) {
      alert('Your data stored successfully!');
    } else {
      alert('Error storing data: ' + response.statusText);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error storing data: ' + error.message);
  });
}

