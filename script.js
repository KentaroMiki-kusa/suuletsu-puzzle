let level = 1;
let problems = [];

fetch("problems.json")
  .then(res => res.json())
  .then(data => {
    problems = data;
    showProblem();
  });

function showProblem() {
  if (level > problems.length) {
    document.getElementById("sequence").innerText = "🎉 全問クリア！";
    document.getElementById("level").innerText = "";
    return;
  }

  const current = problems[level - 1];
  document.getElementById("level").innerText = `レベル ${level}`;
  document.getElementById("sequence").innerText = current.question;
  document.getElementById("answer").value = "";
  document.getElementById("result").innerText = "";
}

function checkAnswer() {
  const input = Number(document.getElementById("answer").value);
  const correct = problems[level - 1].answer;
  const resultEl = document.getElementById("result");

  if (input === correct) {
    resultEl.innerText = "✅ 正解！次のレベルへ";
    resultEl.style.color = "green";
    level++;
    setTimeout(showProblem, 1000);
  } else {
    resultEl.innerText = "❌ 不正解。もう一度！";
    resultEl.style.color = "red";
  }
}
