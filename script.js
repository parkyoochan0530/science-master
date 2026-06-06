let todaySolved = 0;
let todayCorrect = 0;
let achievements =
JSON.parse(
localStorage.getItem("achievements")
) || [];
let favorites =
JSON.parse(
localStorage.getItem("favorites")
) || [];
let shuffledCards = [];
let cardIndex = 0;
let cardFront = true;

let xp = Number(localStorage.getItem("xp")) || 0;
let level = Number(localStorage.getItem("level")) || 1;
let solved = Number(localStorage.getItem("solved")) || 0;
let correct = Number(localStorage.getItem("correct")) || 0;

let wrongs =
JSON.parse(localStorage.getItem("wrongs")) || [];

const concepts = [


{title:"밀도",content:"밀도 = 질량 ÷ 부피"},
{title:"속력",content:"속력 = 거리 ÷ 시간"},
{title:"가속도",content:"가속도 = 속도 변화량 ÷ 시간"},
{title:"압력",content:"압력 = 힘 ÷ 면적"},
{title:"일",content:"일 = 힘 × 이동거리"},
{title:"일률",content:"일률 = 일 ÷ 시간"},
{title:"운동에너지",content:"1/2mv²"},
{title:"위치에너지",content:"mgh"},
{title:"전력",content:"전압 × 전류"},
{title:"옴의 법칙",content:"V = IR"},

{title:"원자",content:"물질을 이루는 기본 입자"},
{title:"양성자",content:"양전하"},
{title:"중성자",content:"전하 없음"},
{title:"전자",content:"음전하"},
{title:"이온",content:"전자를 잃거나 얻은 입자"},
{title:"주기율표",content:"원자번호 순 배열"},
{title:"산",content:"수소 이온 제공"},
{title:"염기",content:"수산화 이온 제공"},
{title:"중화반응",content:"산 + 염기 → 물"},
{title:"화학결합",content:"원자 간 결합"},

{title:"세포",content:"생물의 기본 단위"},
{title:"세포막",content:"물질 출입 조절"},
{title:"핵",content:"유전 정보 저장"},
{title:"미토콘드리아",content:"세포 호흡"},
{title:"엽록체",content:"광합성"},
{title:"광합성",content:"빛에너지를 화학에너지로 전환"},
{title:"세포호흡",content:"포도당 분해"},
{title:"DNA",content:"유전 정보"},
{title:"유전자",content:"형질 결정"},
{title:"생태계",content:"생물+환경"},

{title:"대류권",content:"기상 현상"},
{title:"성층권",content:"오존층 존재"},
{title:"오존층",content:"자외선 흡수"},
{title:"판구조론",content:"지각판 이동"},
{title:"화산",content:"마그마 분출"},
{title:"지진",content:"지각판 운동"},
{title:"태양",content:"태양계 중심"},
{title:"달",content:"지구의 위성"},
{title:"자전",content:"스스로 회전"},
{title:"공전",content:"다른 천체 주위를 돎"},

{title:"전자의 파동성",content:"전자도 파동"},
{title:"드브로이 파장",content:"모든 입자는 파동성"},
{title:"불확정성 원리",content:"위치와 운동량 동시 측정 불가"},
{title:"에너지 밴드",content:"전자 에너지 영역"},
{title:"가전자대",content:"전자 채워진 밴드"},
{title:"전도대",content:"전류 흐르는 밴드"},
{title:"밴드갭",content:"가전자대와 전도대 차이"},
{title:"페르마 준위",content:"전자 점유 기준 에너지"},
{title:"반도체",content:"도체와 부도체 중간"},
{title:"터널링 효과",content:"양자 장벽 통과"},
{title:"초전도체",content:"전기저항 0"},
{title:"쿠퍼쌍",content:"초전도 상태 전자쌍"}

];

const quizzes = [

{
q:"밀도 공식은?",
a:["질량÷부피","부피÷질량","질량×부피","질량+부피"],
correct:0,
wrongCount:0
},

{
q:"속력의 단위는?",
a:["kg","m/s","N","Pa"],
correct:1,
wrongCount:0
},

{
q:"광합성이 일어나는 곳은?",
a:["핵","세포막","엽록체","미토콘드리아"],
correct:2,
wrongCount:0
},

{
q:"압력의 단위는?",
a:["Pa","kg","J","m"],
correct:0,
wrongCount:0
},

{
q:"지구 대기의 대부분은?",
a:["산소","질소","수소","헬륨"],
correct:1,
wrongCount:0
},

{
q:"옴의 법칙은?",
a:["V=IR","F=ma","PV=nRT","E=mc²"],
correct:0,
wrongCount:0
},

{
q:"전자의 파동성을 제안한 사람은?",
a:["뉴턴","드브로이","보어","패러데이"],
correct:1,
wrongCount:0
},

{
q:"초전도체 특징은?",
a:["고저항","무저항","절연체","반도체"],
correct:1,
wrongCount:0
}

];

let currentQuiz = 0;

let quizMode = "all";

shuffleCards();

let currentCard = 0;

function saveData(){

localStorage.setItem("xp",xp);
localStorage.setItem("level",level);
localStorage.setItem("solved",solved);
localStorage.setItem("correct",correct);

localStorage.setItem(
"wrongs",
JSON.stringify(wrongs)
);

}

function updateStats(){

document.getElementById("xp").innerText=xp;
document.getElementById("level").innerText=level;

let rate =
solved===0 ? 0 :
Math.round(correct/solved*100);

document.getElementById("accuracy")
.innerText=rate;

if(document.getElementById("correctCount")){
    document.getElementById("correctCount").innerText = correct;
}

if(document.getElementById("wrongCount")){
    document.getElementById("wrongCount").innerText = solved - correct;
}

renderWrongs();

document.getElementById("todaySolved")
.innerText = todaySolved;

document.getElementById("todayCorrect")
.innerText = todayCorrect;

let todayRate =
todaySolved === 0
? 0
: Math.round(
todayCorrect / todaySolved * 100
);

document.getElementById("todayAccuracy")
.innerText = todayRate;

}

function renderWrongs(){

 const list =
 document.getElementById("wrongList");

 list.innerHTML="";

 wrongs.forEach(item=>{

   const li =
   document.createElement("li");

   li.innerHTML = `
   <div style="margin-bottom:15px;">
     <strong>문제:</strong>
     ${item.question}
     <br>

     ❌ <strong>내 답:</strong>
     ${item.userAnswer}

     <br>

     ✅ <strong>정답:</strong>
     ${item.correctAnswer}
   </div>
   <hr>
   `;

   list.appendChild(li);

 });

}

function showTab(id){

document
.querySelectorAll("main section")
.forEach(sec=>{

sec.classList.add("hidden");

});

document
.getElementById(id)
.classList.remove("hidden");

}

function shuffleCards(){

    shuffledCards = [...concepts];

    for(let i = shuffledCards.length - 1; i > 0; i--){

        const j =
        Math.floor(Math.random() * (i + 1));

        [shuffledCards[i], shuffledCards[j]] =
        [shuffledCards[j], shuffledCards[i]];
    }

    cardIndex = 0;
}

function flipCard(){

    const card =
    document.getElementById("flashcard");

    if(cardFront){

        card.innerHTML =
        shuffledCards[cardIndex].content;

    }else{

        cardIndex++;

        if(cardIndex >= shuffledCards.length){

            shuffleCards();

        }

        card.innerHTML =
        shuffledCards[cardIndex].title;

    }

    cardFront = !cardFront;

}





function loadQuiz(){

    let quizList =
    quizMode === "wrong"
    ? quizzes.filter(q => q.wrongCount > 0)
    : quizzes;

    if(quizList.length === 0){

        document
        .getElementById("question")
        .innerText =
        "오답 문제가 없습니다 🎉";

        document
        .getElementById("answers")
        .innerHTML = "";

        return;

    }

    if(currentQuiz >= quizList.length){

        currentQuiz = 0;

    }

    const q =
    quizList[currentQuiz];

    document
    .getElementById("question")
    .innerText = q.q;

    const box =
    document.getElementById("answers");

    box.innerHTML = "";

    q.a.forEach((answer,index)=>{

        const btn =
        document.createElement("button");

        btn.className = "answer-btn";

        btn.innerText = answer;

        btn.onclick = () =>
        checkAnswer(index);

        box.appendChild(btn);

    });

}



function getNextQuiz(){

    let weighted = [];

    quizzes.forEach(q=>{

        let weight =
        q.wrongCount + 1;

        for(let i=0;i<weight;i++){

            weighted.push(q);

        }

    });

    return weighted[
    Math.floor(
    Math.random()*weighted.length
    )];

}

function checkAnswer(choice){

    let quizList =
quizMode === "wrong"
? quizzes.filter(q => q.wrongCount > 0)
: quizzes;

const q =
quizList[currentQuiz];

    solved++;

    todaySolved++;

    if(choice===q.correct){

        correct++;

        todayCorrect++;

        if(correct === 1){
    unlockAchievement("첫 정답");
}

if(correct === 10){
    unlockAchievement("정답 10개 달성");
}

if(correct === 50){
    unlockAchievement("정답 50개 달성");
}

        xp += 10;

        document
        .getElementById("result")
        .innerHTML =
        "<span style='color:limegreen'>정답! ✅</span>";

        if(xp >= level * 100){

            level++;

            alert(
            "레벨업! LV." + level
            );

            if(level === 5){
    unlockAchievement("레벨 5 달성");
}

        }

    }else{

        if(q.wrongCount !== undefined){
            q.wrongCount++;
        }

        wrongs.push({
            question: q.q,
            userAnswer: q.a[choice],
            correctAnswer: q.a[q.correct]
        });

        document
        .getElementById("result")
        .innerHTML =
        "<span style='color:red'>오답! ❌</span>";

    }

    currentQuiz++;

    saveData();

    updateStats();

    loadQuiz();

}

updateStats();
loadQuiz();
searchConcept();

document.getElementById("flashcard")
.innerHTML =
shuffledCards[0].title;

function searchConcept(){

    const keyword =
    document
    .getElementById("searchInput")
    .value
    .toLowerCase();

    const box =
    document
    .getElementById("conceptResults");

    box.innerHTML = "";

    concepts
    .filter(item =>
        item.title
        .toLowerCase()
        .includes(keyword)
    )
    .forEach(item => {

        const div =
        document.createElement("div");

        div.innerHTML =
        "<h3>" + item.title +
        "</h3><p>" +
        item.content +
        "</p><hr>";

        box.appendChild(div);

    });

}

updateStats();
loadQuiz();
searchConcept();

document.getElementById("flashcard")
.innerHTML =
shuffledCards[0].title;

function toggleFavorite(title){

    if(favorites.includes(title)){

        favorites =
        favorites.filter(
        item => item !== title
        );

    }else{

        favorites.push(title);

    }

    localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
    );

    searchConcept();

}

function unlockAchievement(name){

    if(!achievements.includes(name)){

        achievements.push(name);

        localStorage.setItem(
        "achievements",
        JSON.stringify(achievements)
        );

        alert("🏆 업적 달성!\n" + name);

        renderAchievements();
    }
}

function renderAchievements(){

    const list =
    document.getElementById(
    "achievementList"
    );

    list.innerHTML = "";

    achievements.forEach(a => {

        const li =
        document.createElement("li");

        li.innerText = a;

        list.appendChild(li);

    });

}

function nextCard(){

    cardFront = true;

    cardIndex++;

    if(cardIndex >= shuffledCards.length){
        shuffleCards();
    }

    document.getElementById("flashcard")
    .innerHTML =
    shuffledCards[cardIndex].title;

}

function toggleDarkMode(){

    document.body
    .classList.toggle("dark");

}
