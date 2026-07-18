// Game controller: renders the current worksheet question, collects each
// group's answer (auto-checked or facilitator-marked), scores, and steps
// through the sequence. Entirely client-side, single facilitator-led
// device — no backend state, nothing stored beyond this page load.

const GROUP_LABELS = Array.from({ length: GROUP_COUNT }, (_, i) => `Group ${i + 1}`);

let worksheetIndex = 0;
let questionIndex = 0;
let scores = Array(GROUP_COUNT).fill(0);
let manualVerdicts = Array(GROUP_COUNT).fill(null); // null | true | false, for "manual" questions
let graded = false;

function currentWorksheet() {
  return WORKSHEETS[worksheetIndex];
}
function currentQuestion() {
  return currentWorksheet().questions[questionIndex];
}

// ---------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------

function renderScorePanel(targetId) {
  const el = document.getElementById(targetId);
  el.innerHTML = "";
  for (let g = 0; g < GROUP_COUNT; g++) {
    const card = document.createElement("div");
    card.className = "score-card";
    card.innerHTML = `
      <div class="group-name">${GROUP_LABELS[g]}</div>
      <div class="group-score">${scores[g]}</div>
    `;
    el.appendChild(card);
  }
}

function checkerFor(type) {
  switch (type) {
    case "numberSet": return (input, expected) => checkNumberSet(input, expected);
    case "integer": return (input, expected) => checkInteger(input, expected);
    case "fraction": return (input, expected) => checkFraction(input, expected);
    case "pairSet": return (input, expected) => checkPairSet(input, expected);
    case "yesNo": return (input, expected) => checkYesNo(input, expected);
    default: return null;
  }
}

function renderQuestion() {
  graded = false;
  manualVerdicts = Array(GROUP_COUNT).fill(null);

  const ws = currentWorksheet();
  const q = currentQuestion();

  document.getElementById("worksheetProgress").textContent = `Worksheet ${worksheetIndex + 1} of ${WORKSHEETS.length}`;
  document.getElementById("worksheetTitle").textContent = ws.title;
  document.getElementById("worksheetSubtitle").textContent = ws.subtitle;
  document.getElementById("questionProgress").textContent = `Question ${questionIndex + 1} of ${ws.questions.length}`;
  document.getElementById("questionText").textContent = q.text;
  document.getElementById("questionHint").textContent = q.hint || "";

  const autoArea = document.getElementById("autoAnswerArea");
  const manualArea = document.getElementById("manualAnswerArea");
  const checkBtn = document.getElementById("checkBtn");
  const nextBtn = document.getElementById("nextBtn");
  const explanationBox = document.getElementById("explanationBox");

  explanationBox.classList.add("hidden");
  nextBtn.classList.add("hidden");
  autoArea.innerHTML = "";
  manualArea.innerHTML = "";

  if (q.type === "manual") {
    autoArea.classList.add("hidden");
    manualArea.classList.remove("hidden");
    checkBtn.classList.add("hidden");
    for (let g = 0; g < GROUP_COUNT; g++) {
      const row = document.createElement("div");
      row.className = "manual-row";
      row.innerHTML = `
        <span class="group-label">${GROUP_LABELS[g]}</span>
        <button type="button" class="manual-btn correct-btn" data-group="${g}" data-verdict="true">✓ Correct</button>
        <button type="button" class="manual-btn incorrect-btn" data-group="${g}" data-verdict="false">✗ Incorrect</button>
      `;
      manualArea.appendChild(row);
    }
    manualArea.querySelectorAll(".manual-btn").forEach((btn) => {
      btn.addEventListener("click", () => onManualVerdict(Number(btn.dataset.group), btn.dataset.verdict === "true"));
    });
  } else {
    autoArea.classList.remove("hidden");
    manualArea.classList.add("hidden");
    checkBtn.classList.remove("hidden");
    checkBtn.disabled = false;
    for (let g = 0; g < GROUP_COUNT; g++) {
      const row = document.createElement("div");
      row.className = "group-answer-row";
      row.innerHTML = `
        <span class="group-label">${GROUP_LABELS[g]}</span>
        <input type="text" id="answerInput${g}" autocomplete="off">
        <span class="verdict-icon" id="verdictIcon${g}"></span>
      `;
      autoArea.appendChild(row);
    }
  }
}

function onManualVerdict(groupIdx, isCorrect) {
  if (graded) return;
  manualVerdicts[groupIdx] = isCorrect;
  const rows = document.querySelectorAll("#manualAnswerArea .manual-row");
  const row = rows[groupIdx];
  row.querySelector(".correct-btn").classList.toggle("active", isCorrect === true);
  row.querySelector(".incorrect-btn").classList.toggle("active", isCorrect === false);

  if (manualVerdicts.every((v) => v !== null)) {
    gradeManual();
  }
}

function gradeManual() {
  graded = true;
  for (let g = 0; g < GROUP_COUNT; g++) {
    scores[g] += manualVerdicts[g] ? 1 : -1;
  }
  renderScorePanel("scorePanel");
  showExplanation();
}

document.getElementById("checkBtn").addEventListener("click", () => {
  if (graded) return;
  const q = currentQuestion();
  const checker = checkerFor(q.type);
  for (let g = 0; g < GROUP_COUNT; g++) {
    const input = document.getElementById(`answerInput${g}`);
    const correct = checker(input.value, q.expected);
    input.disabled = true;
    const icon = document.getElementById(`verdictIcon${g}`);
    icon.textContent = correct ? "✓" : "✗";
    icon.classList.add(correct ? "correct" : "incorrect");
    scores[g] += correct ? 1 : -1;
  }
  graded = true;
  document.getElementById("checkBtn").classList.add("hidden");
  renderScorePanel("scorePanel");
  showExplanation();
});

function showExplanation() {
  const q = currentQuestion();
  const box = document.getElementById("explanationBox");
  const expectedLine = q.expectedDisplay ? `<br>Correct answer: <strong>${q.expectedDisplay}</strong>` : "";
  box.innerHTML = `<span class="explanation-label">How we got there</span>${q.explanation}${expectedLine}`;
  box.classList.remove("hidden");
  document.getElementById("nextBtn").classList.remove("hidden");
}

document.getElementById("nextBtn").addEventListener("click", () => {
  const ws = currentWorksheet();
  if (questionIndex < ws.questions.length - 1) {
    questionIndex += 1;
    renderQuestion();
  } else if (worksheetIndex < WORKSHEETS.length - 1) {
    worksheetIndex += 1;
    questionIndex = 0;
    renderQuestion();
  } else {
    showFinal();
  }
});

function showFinal() {
  document.querySelector(".worksheet-header").classList.add("hidden");
  document.querySelector(".question-card").classList.add("hidden");
  document.getElementById("scorePanel").classList.add("hidden");
  document.getElementById("finalScreen").classList.remove("hidden");
  renderScorePanel("finalScorePanel");
}

document.getElementById("restartBtn").addEventListener("click", () => {
  if (!window.confirm("Restart the whole activity? This clears all 4 groups' scores.")) return;
  worksheetIndex = 0;
  questionIndex = 0;
  scores = Array(GROUP_COUNT).fill(0);
  document.querySelector(".worksheet-header").classList.remove("hidden");
  document.querySelector(".question-card").classList.remove("hidden");
  document.getElementById("scorePanel").classList.remove("hidden");
  document.getElementById("finalScreen").classList.add("hidden");
  renderScorePanel("scorePanel");
  renderQuestion();
});

// ---------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------

renderScorePanel("scorePanel");
renderQuestion();
