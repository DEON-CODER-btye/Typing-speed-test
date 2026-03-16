const timer = document.getElementById("timer");
const paragraph = document.getElementById("paragraph");
const input = document.getElementById("input");
const showAccuray = document.getElementById("accuracy");
const wordPerMinute = document.getElementById("WPM");
const level = document.querySelectorAll(".levels");
const passage = document.querySelector("#Passage");
const changeTime = document.querySelector("#changerTimer");
const showBestSpeed = document.querySelector('#bestSpeed')


let savedSpeed = Number(localStorage.getItem('bestSpeeds')) || 0;
let bestSpeed = savedSpeed;
if (bestSpeed) {
  showBestSpeed.innerHTML = `<i class="fa-solid fa-trophy text-amber-300"></i> Personal Best: ${bestSpeed.toFixed(0)} WPM`
}

let startTime = null;
let endTime = null;
let interval = null;
let count = 60;
function startTimer() {
  interval = setInterval(() => {
    let minute = Math.floor(count / 60);
    let seconds = count % 60;
    timer.innerHTML = `${minute}:${seconds < 10 ? "0" + seconds : seconds}`;
    if (count === 0) {
      clearInterval(interval);
      calculatePart();
      input.value = "Well Played 👍";
      return;
    }
    count--;
  }, 1000);
}

let arr = [
  "Programming is a skill that improves with regular practice and patience. Many beginners feel confused when they first start learning code, but mistakes are a natural part of the process."
  ,
  "Learning to code requires patience, focus, and daily practice. Mistakes are normal, and debugging builds real skill. Every small improvement adds up over time. Consistency matters more than speed, and understanding logic deeply creates confidence that lasts much longer than temporary motivation ever could",
  "Technology is changing the way people learn, work, and communicate every single day. From smartphones to powerful computers, tools are becoming faster and smarter. However, real growth still depends on discipline and strong fundamentals. Writing clean code, understanding logic clearly, and practicing regularly remain timeless skills. Trends may change, frameworks may update, and new languages may appear, but the foundation always stays the same. Progress happens when effort meets consistency.",
];

let currentText = "";
function loadParagraph() {
  currentText = '<< Select The Mode >>'
  if (currentText === '<< Select The Mode >>') {
    input.disabled = true;
  } else {
    input.disabled = false;
  }
  renderParagraph(currentText);

  input.addEventListener("input", () => {
    let typed = input.value;
    if (typed.length > currentText.length) return;
    let lastCharIndex = typed.length - 1;
    if (!startTime) {
      startTime = Date.now();
      startTimer();
      changeTime.disabled = true;
    }

    if (typed.length === 0) {
      return;
    }
    const chars = document.querySelectorAll(".char");
    if (!chars[lastCharIndex]) return;
    let currentSpan = chars[lastCharIndex];

    if (typed[lastCharIndex] === currentText[lastCharIndex]) {
      currentSpan.classList.add("green");
      currentSpan.classList.remove("red");
    } else {
      currentSpan.classList.add("red");
      currentSpan.classList.remove("green");
    }

    if (
      typed.length === currentText.length
    ) {
      clearInterval(interval);
      calculatePart();
      input.value = "<< Congratulation 😊>>";
    }
  });

  level.forEach((el) => {
    el.addEventListener("click", (e) => {
      let id = e.target.id.replace("level", "") - 1;
      currentText = arr[id];
      input.value = "";
      renderParagraph(currentText);
      clearInterval(interval);
      startTime = null;
      count = 60;
      timer.innerHTML = "1:00";
      changeTime.innerHTML = `Time(60s)`;
      showAccuray.innerHTML = `0%`;
      wordPerMinute.innerHTML = `0`
      input.disabled = false;
      changeTime.disabled = false;
      input.classList.remove("inputClass");
    });
  });
}

loadParagraph();

function renderParagraph(text) {
  paragraph.innerHTML = text
    .split("")
    .map(
      (char) => `<span class="char">${char === " " ? "&nbsp;" : char}</span>`,
    )
    .join("");
}

function calculatePart() {
  let typed = input.value;
  let totalType = typed.length;
  let correct = 0;
  let minLength = Math.min(totalType, currentText.length);
  for (let i = 0; i < minLength; i++) {
    if (typed[i] === currentText[i]) correct++;
  }
  let accuracy = totalType === 0 ? 0 : (correct / totalType) * 100;
  showAccuray.innerHTML = `${accuracy.toFixed(0)}%`;
  endTime = Date.now();
  let seconds = (endTime - startTime) / 1000;
  let WPM = (correct / 5) * (60 / seconds);
  wordPerMinute.innerHTML = WPM.toFixed(0);
  clearInterval(interval);
  input.disabled = true;
  input.classList.add("inputClass");


  if (WPM > bestSpeed && WPM > 0) {
    bestSpeed = Math.ceil(WPM)
    localStorage.setItem('bestSpeeds', bestSpeed);
    showBestSpeed.innerHTML = `<i class="fa-solid fa-trophy text-amber-300"></i> Personal Best: ${bestSpeed} WPM`

  }
}

function changeLevel() {
  const level = document.querySelectorAll(".levels span");

  level.forEach((pr) => {
    pr.addEventListener("click", () => {
      passage.classList.remove('add-border')
      level.forEach((i) => i.classList.remove("add-border"));
      pr.classList.add("add-border");
    });
  });
}

changeLevel();

let counts = 0;
function changeTimer() {
  changeTime.addEventListener("click", () => {
    if (counts === 0) {
      changeTime.innerHTML = `Time(120s)`;
      counts++;
      count = 120;
      timer.innerHTML = `2:00`;
    } else if (counts === 1) {
      changeTime.innerHTML = `Time(60s)`;
      counts--;
      count = 60;
      timer.innerHTML = `1:00`;
    }
  });
}
changeTimer();

let passageText = [`Technology is changing the way people learn and work every day. Many beginners start their journey feeling confused and overwhelmed. With regular practice and patience the concepts slowly become clearer. Small improvements each day build real confidence and strong skills. Consistency and focus always lead to long term success.Technology is changing the way people learn and work every day. Many beginners start their journey feeling confused and overwhelmed. With regular practice and patience the concepts slowly become clearer. Small improvements each day build real confidence and strong skills. Consistency and focus always lead to long term success.
`];
function changeParagraph() {
  passage.addEventListener("click", () => {
    clearInterval(interval);
    startTime = null;
    endTime = null;
    count = 60;
    timer.innerHTML = `1:00`
    input.value = "";
    currentText = passageText[0];
    renderParagraph(currentText);
    input.disabled = false;
    input.classList.remove('inputClass')
    passage.classList.add('add-border')
    changeTime.disabled = false



  });
}

changeParagraph();

