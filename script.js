import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let level = 1;
let problems = [];
let randomIndexes = [];

fetch("problems_1000_full.json")
  .then((res) => res.json())
  .then((data) => {
    problems = data;
    randomIndexes = shuffle(Array.from({ length: problems.length }, (_, i) => i));
    showProblem();
    loadRanking();
  });

// Fisher-Yates シャッフルでランダム順を作成
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 出題表示
function showProblem() {
  if (level > problems.length) {
    document.getElementById("sequence").innerText = "🎉 全問クリア！";
    document.getElementById("level").innerText = "";
    return;
  }

  const currentIndex = randomIndexes[level - 1];
  const prob = problems[currentIndex];

  document.getElementById("level").innerText = `レベル ${level} / ${problems.length}`;
  document.getElementById("sequence").innerText = prob.question;
  document.getElementById("answer").value = "";
  document.getElementById("result").innerText = "";
}

// 回答チェック
function checkAnswer() {
  const userAnswer = Number(document.getElementById("answer").value);
  const currentIndex = randomIndexes[level - 1];
  const correct = problems[currentIndex].answer;
  const resultEl = document.getElementById("result");

  if (userAnswer === correct) {
    resultEl.innerText = "✅ 正解！";
    resultEl.style.color = "green";
    level++;
    setTimeout(showProblem, 1000);
  } else {
    resultEl.innerText = "❌ 不正解。もう一度！";
    resultEl.style.color = "red";
  }
}

// 通常のスコア送信
async function submitScore() {
  const name = document.getElementById("username").value || "名無し";
  const score = level - 1;
  await sendScore(name, score);
}

// 「やめる（スコア送信）」ボタン処理
async function quitGame() {
  const name = document.getElementById("username").value || "名無し";
  const score = level - 1;
  if (confirm(`現在のレベル ${score} を送信して終了しますか？`)) {
    await sendScore(name, score);
    alert("スコアを送信しました。ページをリロードすると再挑戦できます。");
  }
}

// Firestoreにスコアを記録
async function sendScore(name, score) {
  try {
    await addDoc(collection(db, "scores"), {
      name: name,
      score: score,
      timestamp: Date.now()
    });
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

  docs.forEach((doc) => {
    const d = doc.data();
    const li = document.createElement("li");
    li.textContent = `${rank++}位 ${d.name}：レベル ${d.score}`;
    list.appendChild(li);
  });
}
