import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase構成
const firebaseConfig = {
  apiKey: "AIzaSyDbiY1GR3kBT00qAgV0iMQ5meYCdYck1NU",
  authDomain: "suuletu.firebaseapp.com",
  projectId: "suuletu",
  storageBucket: "suuletu.firebasestorage.app",
  messagingSenderId: "192274376713",
  appId: "1:192274376713:web:46fbc945502b4a510770d8",
  measurementId: "G-8LVCYVGWQZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ゲームロジック
let level = 1;
let problems = [];

fetch("problems.json")
  .then(res => res.json())
  .then(data => {
    problems = data;
    showProblem();
    loadRanking();
  });

function showProblem() {
  if (level > problems.length) {
    document.getElementById("sequence").innerText = "🎉 全問クリア！";
    document.getElementById("level").innerText = "";
    return;
  }

  const prob = problems[level - 1];
  document.getElementById("level").innerText = `レベル ${level}`;
  document.getElementById("sequence").innerText = prob.question;
  document.getElementById("answer").value = "";
  document.getElementById("result").innerText = "";
}

function checkAnswer() {
  const userAnswer = Number(document.getElementById("answer").value);
  const correct = problems[level - 1].answer;
  const resultEl = document.getElementById("result");

  if (userAnswer === correct) {
    resultEl.innerText = "✅ 正解！次のレベルへ";
    resultEl.style.color = "green";
    level++;
    setTimeout(showProblem, 1000);
  } else {
    resultEl.innerText = "❌ 不正解。もう一度！";
    resultEl.style.color = "red";
  }
}

// スコア送信
async function submitScore() {
  const name = document.getElementById("username").value || "名無し";
  try {
    await addDoc(collection(db, "scores"), {
      name: name,
      score: level - 1,
      timestamp: Date.now()
    });
    alert("スコア送信完了！");
    loadRanking();
  } catch (e) {
    alert("送信失敗：" + e);
  }
}

// ランキング表示
async function loadRanking() {
  const list = document.getElementById("rankingList");
  list.innerHTML = "";

  const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(10));
  const docs = await getDocs(q);
  let rank = 1;

  docs.forEach(doc => {
    const d = doc.data();
    const li = document.createElement("li");
    li.textContent = `${rank++}位 ${d.name}：レベル ${d.score}`;
    list.appendChild(li);
  });
}

