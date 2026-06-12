

function searchFormula(){

    const keyword =
    document
    .getElementById("formulaSearch")
    .value
    .toLowerCase()
    .replace(/\s/g,"")
    .normalize("NFKC");

    const box =
    document
    .getElementById("formulaResults");

    box.innerHTML = "";

    formulas
    .filter(item => {

        const title =
        (item.title || "")
        .toLowerCase()
        .replace(/\s/g,"")
        .normalize("NFKC");

        const subject =
        (item.subject || "")
        .toLowerCase()
        .replace(/\s/g,"")
        .normalize("NFKC");

        const category =
        (item.category || "")
        .toLowerCase()
        .replace(/\s/g,"")
        .normalize("NFKC");

        const formula =
        (item.formula || "")
        .toLowerCase()
        .replace(/\s/g,"")
        .normalize("NFKC");

        return (

    keyword === "" ||

    title.includes(keyword) ||

    subject.includes(keyword) ||

    category.includes(keyword) ||

    formula.includes(keyword)

);

    })
    .forEach(item => {

        const div =
        document.createElement("div");

        div.className = "formula-card";
        
        div.innerHTML =

        "<h3>" + item.title + "</h3>" +

        "<p>📚 <b>과목:</b> " +
        item.subject +
        "</p>" +

        "<p>🧩 <b>카테고리:</b> " +
        item.category +
        "</p>" +

        "<p>📐 <b>공식:</b></p>" +

        "<p>" +
        item.formula +
        "</p><hr>";

        box.appendChild(div);

    });

}

function checkAchievements(){

    if(correct >= 1){
        unlockAchievement(
        "첫 정답"
        );
    }

    if(correct >= 10){
        unlockAchievement(
        "정답 10개 달성"
        );
    }
    if(correct >= 50){
        unlockAchievement(
        "정답 50개 달성"
        );
    }

    if(correct >= 100){
        unlockAchievement(
        "정답 100개 달성"
        );
    }

    if(level >= 5){
        unlockAchievement(
        "레벨 5 달성"
        );
    }

    if(level >= 10){
        unlockAchievement(
        "레벨 10 달성"
        );
    }

}

function renderAchievements(){

    const list =
    document.getElementById(
    "achievementList"
    );

    if(!list) return;

    list.innerHTML = "";

    achievements.forEach(a => {

        const li =
        document.createElement("li");

        li.innerText = a;

        list.appendChild(li);

    });

}

let quizMode = "all";
let currentQuiz = 0;
let xp =
Number(localStorage.getItem("xp")) || 0;

let level =
Number(localStorage.getItem("level")) || 1;

let solved =
Number(localStorage.getItem("solved")) || 0;

let correct =
Number(localStorage.getItem("correct")) || 0;

let wrongs =
JSON.parse(
localStorage.getItem("wrongs")
) || [];

let favorites =
JSON.parse(
localStorage.getItem("favorites")
) || [];

let achievements =
JSON.parse(
localStorage.getItem("achievements")
) || [];

let todaySolved =
Number(
localStorage.getItem("todaySolved")
) || 0;

let todayCorrect =
Number(
localStorage.getItem("todayCorrect")
) || 0;

let cardFront = true;
let cardIndex = 0;
let shuffledCards = [];



const concepts = [

{title:"스칼라량",subject:"물리",category:"역학",content:"크기만 가지고 방향은 가지지 않는 물리량이다. 질량, 시간, 거리, 에너지 등이 대표적인 예이다."},

{title:"벡터량",subject:"물리",category:"역학",content:"크기와 방향을 모두 가지는 물리량이다. 힘, 속도, 가속도 등이 대표적인 예이다."},

{title:"이동 거리",subject:"물리",category:"역학",content:"물체가 실제로 이동한 경로의 전체 길이이다. 스칼라량이다."},

{title:"변위",subject:"물리",category:"역학",content:"출발점에서 도착점까지의 위치 변화이다. 방향을 가지므로 벡터량이다."},

{title:"속력",subject:"물리",category:"역학",content:"이동거리를 이동한 시간으로 나눈 값이다. 속력 = 이동거리 ÷ 시간으로 계산하고,스칼라량이다."},

{title:"속도",subject:"물리",category:"역학",content:"변위를 이동한 시간으로 나눈 값이다. 속도 = 변위 ÷ 시간으로 계산하고,벡터량이다."},

{title:"상대 속도",subject:"물리",category:"역학",content:"한 물체를 기준으로 보았을 때 다른 물체의 속도이다. 두 물체의 속도 차이로 구한다."},

{title:"가속도",subject:"물리",category:"역학",content:"단위 시간 동안 속도가 변하는 정도이다. 단위는 a, m/s²이다."},

{title:"힘",subject:"물리",category:"역학",content:"물체의 운동 상태를 변화시키거나 물체를 변형시키는 원인이다. 단위는 N(뉴턴)이다."},

{title:"만유인력",subject:"물리",category:"역학",content:"질량을 가진 모든 물체 사이에 작용하는 인력이다. 뉴턴이 발견하였다."},

{title:"중력",subject:"물리",category:"역학",content:"지구가 물체를 중심 방향으로 끌어당기는 힘이다."},

{title:"탄성력",subject:"물리",category:"역학",content:"변형된 물체가 원래 상태로 돌아가려는 힘이다. F = -kx로 구한다."},

{title:"탄성",subject:"물리",category:"역학",content:"힘을 받아 변형된 물체가 힘이 제거되면 원래 모양으로 돌아가는 성질이다."},

{title:"탄성 한계",subject:"물리",category:"역학",content:"물체가 탄성을 유지할 수 있는 최대 한계이다. 이를 넘으면 영구 변형이 남는다."},

{title:"탄성력의 방향",subject:"물리",category:"역학",content:"항상 물체를 원래 상태로 되돌리려는 방향으로 작용한다."},

{title:"탄성 계수",subject:"물리",category:"역학",content:"물체가 변형에 저항하는 정도를 나타내는 값이다."},

{title:"장력",subject:"물리",category:"역학",content:"줄이나 실이 당겨질 때 발생하는 힘이다."},

{title:"수직 항력",subject:"물리",category:"역학",content:"접촉면이 물체를 수직 방향으로 밀어주는 힘이다."},

{title:"마찰력",subject:"물리",category:"역학",content:"접촉한 두 물체의 상대 운동을 방해하는 힘이다."},

{title:"정지 마찰력",subject:"물리",category:"역학",content:"물체가 움직이지 않도록 작용하는 마찰력이다."},

{title:"최대 정지 마찰력",subject:"물리",category:"역학",content:"정지마찰력이 가질 수 있는 최대값이다."},

{title:"운동 마찰력",subject:"물리",category:"역학",content:"물체가 실제로 움직일 때 작용하는 마찰력이다."},

{title:"유체",subject:"물리",category:"역학",content:"흐를 수 있는 물질로 액체와 기체를 포함한다."},

{title:"압력",subject:"물리",category:"역학",content:"단위 면적당 작용하는 힘이다. 압력 = 힘 ÷ 면적이다."},

{title:"밀도",subject:"물리",category:"역학",content:"단위 부피당 질량이다. 밀도 = 질량 ÷ 부피이다."},

{title:"부력",subject:"물리",category:"역학",content:"유체가 밀어내는 물체의 무게이다.부력 = 물체의 밀도 x 중력 가속도 x 물체의 부피이다."},

{title:"관성",subject:"물리",category:"역학",content:"물체가 현재 운동 상태를 유지하려는 성질이다."},

{title:"무게",subject:"물리",category:"역학",content:"중력에 의해 물체가 받는 힘이다."},

{title:"질량",subject:"물리",category:"역학",content:"물체가 가진 물질의 양이다. 장소가 바뀌어도 변하지 않는다."},

{title:"작용, 반작용",subject:"물리",category:"역학",content:"한 물체가 다른 물체에 힘을 가하면 크기가 같고 방향이 반대인 힘이 동시에 작용한다."},

{title:"운동 방정식",subject:"물리",category:"역학",content:"힘과 가속도의 관계를 나타내는 식이다. F=ma로 표현된다."},

{title:"등속 원운동",subject:"물리",category:"역학",content:"속력은 일정하지만 운동 방향이 계속 변하는 원운동이다."},

{title:"각속도",subject:"물리",category:"역학",content:"단위 시간 동안 회전한 각도이다. 단위는 rad/s이다."},

{title:"선속도",subject:"물리",category:"역학",content:"원운동하는 물체의 실제 이동 속도이다."},

{title:"주기",subject:"물리",category:"역학",content:"한 번의 운동이나 진동을 완료하는 데 걸리는 시간이다."},

{title:"진동수",subject:"물리",category:"역학",content:"1초 동안 반복되는 진동 횟수이다. 단위는 Hz이다."},

{title:"구심 가속도",subject:"물리",category:"역학",content:"원운동하는 물체가 중심 방향으로 가지는 가속도이다. a = v² / r으로 구한다."},

{title:"구심력",subject:"물리",category:"역학",content:"원운동을 유지하기 위해 중심 방향으로 작용하는 힘이다.F = ma = mv² / r으로 구한다."},

{title:"관성력",subject:"물리",category:"역학",content:"가속하는 기준계에서 관찰되는 가상의 힘이다."},

{title:"원심력",subject:"물리",category:"역학",content:"회전하는 기준계에서 바깥쪽으로 작용하는 것처럼 보이는 관성력이다."},

{title:"지레",subject:"물리",category:"역학",content:"받침점을 중심으로 회전하여 힘을 전달하는 단순 기계이다."},

{title:"돌림힘(토크)",subject:"물리",category:"역학",content:"물체를 회전시키는 효과를 나타내는 힘이다."},

{title:"1종 지레",subject:"물리",category:"역학",content:"받침점이 힘점과 작용점 사이에 있는 지레이다."},

{title:"2종 지레",subject:"물리",category:"역학",content:"작용점이 받침점과 힘점 사이에 있는 지레이다."},

{title:"3종 지레",subject:"물리",category:"역학",content:"힘점이 받침점과 작용점 사이에 있는 지레이다."},

{title:"운동량",subject:"물리",category:"역학",content:"질량과 속도의 곱으로 정의되는 물리량이다.p = mv로 나타낸다."},

{title:"충격량",subject:"물리",category:"역학",content:"힘이 일정 시간 동안 작용한 효과이다.I = Ft로 나타낸다."},

{title:"운동량 보존 법칙",subject:"물리",category:"역학",content:"외력이 없으면 계의 전체 운동량은 일정하게 유지된다."},

{title:"반발 계수",subject:"물리",category:"역학",content:"충돌 후 속도차 ÷ 충돌 전 속도차로 나타낸다."},

{title:"탄성충돌",subject:"물리",category:"역학",content:"운동량과 운동에너지가 모두 보존되는 충돌이다."},

{title:"비탄성 충돌",subject:"물리",category:"역학",content:"운동량은 보존되지만 운동에너지 일부가 손실되는 충돌이다."},

{title:"완전 비탄성 충돌",subject:"물리",category:"역학",content:"충돌 후 물체가 붙어서 함께 움직이는 충돌이다."},

{title:"일",subject:"물리",category:"역학",content:"힘이 물체를 이동시켰을 때 전달된 에너지이다."},

{title:"줄",subject:"물리",category:"역학",content:"일과 에너지의 SI 단위이다. 기호는 J이다."},

{title:"일률",subject:"물리",category:"역학",content:"단위 시간 동안 한 일의 양이다."},

{title:"에너지",subject:"물리",category:"역학",content:"일을 할 수 있는 능력이다."},

{title:"운동 에너지",subject:"물리",category:"역학",content:"운동하는 물체가 가지는 에너지이다."},

{title:"위치 에너지",subject:"물리",category:"역학",content:"물체의 위치에 의해 저장되는 에너지이다."},

{title:"열 에너지",subject:"물리",category:"역학",content:"입자의 운동과 관련된 에너지이다."},

{title:"화학 에너지",subject:"물리",category:"역학",content:"화학 결합에 저장된 에너지이다."},

{title:"빛 에너지",subject:"물리",category:"역학",content:"전자기파 형태로 전달되는 에너지이다."},

{title:"핵 에너지",subject:"물리",category:"역학",content:"원자핵 내부에 저장된 매우 큰 에너지이다."},

{title:"일, 운동 에너지 정리",subject:"물리",category:"역학",content:"물체에 가해진 일은 운동에너지 변화량과 같다."},

{title:"역학적 에너지",subject:"물리",category:"역학",content:"운동에너지와 위치에너지의 합이다."},

{title:"역학적 에너지 보존 법칙",subject:"물리",category:"역학",content:"마찰이 없을 때 역학적에너지 총합은 일정하다."},

{title:"열",subject:"물리",category:"역학",content:"온도 차이에 의해 이동하는 에너지이다."},

{title:"열량",subject:"물리",category:"역학",content:"물체가 흡수하거나 방출한 열의 양이다."},

{title:"비열",subject:"물리",category:"역학",content:"물질 1g의 온도를 1℃ 높이는 데 필요한 열량이다."},

{title:"열평형",subject:"물리",category:"역학",content:"두 물체의 온도가 같아져 열 이동이 멈춘 상태이다."},

{title:"열량 보존 법칙",subject:"물리",category:"역학",content:"외부와 열 교환이 없을 때 잃은 열량과 얻은 열량은 같다."},

{title:"전도",subject:"물리",category:"역학",content:"물질을 따라 열이 전달되는 현상이다."},

{title:"대류",subject:"물리",category:"역학",content:"유체의 이동에 의해 열이 전달되는 현상이다."},

{title:"복사",subject:"물리",category:"역학",content:"전자기파를 통해 열이 전달되는 현상이다."},

{title:"열팽창",subject:"물리",category:"역학",content:"온도가 올라갈 때 물체의 부피나 길이가 증가하는 현상이다."},

{title:"바이메탈",subject:"물리",category:"역학",content:"열팽창률이 다른 두 금속을 붙인 장치로 온도 조절에 사용된다."},

{title:"마찰전기",subject:"물리",category:"전자기학",content:"두 물체를 마찰할 때 전자가 이동하며 발생하는 전기이다."},

{title:"대전",subject:"물리",category:"전자기학",content:"물체가 전하를 띠게 되는 현상이다."},

{title:"전하량 보존 법칙",subject:"물리",category:"전자기학",content:"전하는 생성되거나 소멸되지 않고 총량이 보존된다."},

{title:"전기력",subject:"물리",category:"전자기학",content:"전하 사이에 작용하는 힘이다."},

{title:"도체",subject:"물리",category:"전자기학",content:"전류가 잘 흐르는 물질이다."},

{title:"부도체",subject:"물리",category:"전자기학",content:"전류가 거의 흐르지 않는 물질이다."},

{title:"반도체",subject:"물리",category:"전자기학",content:"도체와 부도체의 중간 성질을 가진 물질이다."},

{title:"초전도체",subject:"물리",category:"전자기학",content:"특정 온도 이하에서 전기저항이 0이 되는 물질이다."},

{title:"정전기 유도",subject:"물리",category:"전자기학",content:"접촉 없이 전하 재배치가 일어나는 현상이다."},

{title:"유전 분극",subject:"물리",category:"전자기학",content:"절연체 내부 전하 분포가 한쪽으로 치우치는 현상이다."},

{title:"쿨롱의 법칙",subject:"물리",category:"전자기학",content:"전기력은 전하량의 곱에 비례하고 거리의 제곱에 반비례한다."},

{title:"전하",subject:"물리",category:"전자기학",content:"전기적 성질의 근원이며 양전하와 음전하가 있다."},

{title:"전하량",subject:"물리",category:"전자기학",content:"전하의 양을 나타내는 물리량이다. 단위는 C이다."},

{title:"전류",subject:"물리",category:"전자기학",content:"전하가 일정한 방향으로 이동하는 현상이다."},

{title:"전류의 방향",subject:"물리",category:"전자기학",content:"양전하가 이동하는 방향으로 정의한다. 실제 전자 이동 방향과 반대이다."},

{title:"전류의 세기",subject:"물리",category:"전자기학",content:"단위 시간 동안 흐르는 전하량이다. I로 표현하고, 단위는 A이다."},

{title:"전압(전위차)",subject:"물리",category:"전자기학",content:"전하를 이동시키는 전기적 위치에너지 차이이다.V로 표현하고, 단위는 V이다."},

{title:"전기 저항",subject:"물리",category:"전자기학",content:"전류의 흐름을 방해하는 정도이다. 단위는 Ω이다."},

{title:"옴의 법칙",subject:"물리",category:"전자기학",content:"전압은 전류와 저항의 곱과 같다. V=IR로 표현한다."},

{title:"전압계",subject:"물리",category:"전자기학",content:"전압을 측정하는 기구로, 회로에 병렬로 연결한다."},

{title:"전류계",subject:"물리",category:"전자기학",content:"전류의 세기를 측정하는 기구로, 회로에 직렬로 연결한다."},

{title:"기전력",subject:"물리",category:"전자기학",content:"전류를 흐르게 하는 전원의 능력이다.V로 표현하고, 단위는 V이다."},

{title:"키르히호프 제1법칙",subject:"물리",category:"전자기학",content:"한 점으로 들어오는 전류의 합은 나가는 전류의 합과 같다."},

{title:"키르히호프 제2법칙",subject:"물리",category:"전자기학",content:"폐회로를 따라 한 바퀴 도는 동안 전위의 변화를 더한 값은 0이다"},

{title:"휘트스톤 브리지",subject:"물리",category:"전자기학",content:"저항값을 정밀하게 측정하는 회로이다."},

{title:"줄열",subject:"물리",category:"전자기학",content:"전류가 흐를 때 저항에서 발생하는 열에너지이다."},

{title:"전기 에너지",subject:"물리",category:"전자기학",content:"전하의 이동이나 전기적 상태에 의해 저장된 에너지로, 전기 에너지 = 전력 x 시간(E=Pt)으로 계산한다. 예를 들어 100W 전구를 10초 동안 사용하면 전기에너지는 1000J이다."},

{title:"전력",subject:"물리",category:"전자기학",content:"단위 시간 동안 사용되는 전기에너지이다. 단위는 J/s = W(와트)이고, 소비 전력 P = VI로 계산한다."},

{title:"전력량",subject:"물리",category:"전자기학",content:"일정 시간 동안 소비된 전기에너지의 총량이다. 단위는 J이지만 주로 Wh 또는 kWh를 사용한다.W = Pt이고, 1Wh = 3600J이다."},

{title:"자기장",subject:"물리",category:"전자기학",content:"자석이나 전류 주위에 형성되는 자기적 공간이다."},

{title:"자기력선",subject:"물리",category:"전자기학",content:"자기장의 방향과 세기를 나타내는 가상의 선이다."},

{title:"자속",subject:"물리",category:"전자기학",content:"특정 면을 통과하는 자기장의 양이다."},

{title:"자기장의 방향",subject:"물리",category:"전자기학",content:"N극에서 나와 S극으로 들어가는 방향으로 정의한다."},

{title:"자기장의 세기",subject:"물리",category:"전자기학",content:"자기장이 얼마나 강한지를 나타내는 값이다."},
 
{title:"직선 전류 자기장 방향",subject:"물리",category:"전자기학",content:"오른손 엄지 방향을 전류로 할 때 나머지 손가락으로 도선을 감아쥐면 들어가는 방향으로 생긴다."},

{title:"직선 전류 자기장 세기",subject:"물리",category:"전자기학",content:"B직선 = k(상수)I ÷ r으로 계산한다."},

{title:"원형 전류 자기장 방향",subject:"물리",category:"전자기학",content:"오른손 네 손가락을 전류 방향으로 감을 때 엄지 방향이다."},

{title:"원형 전류 자기장 세기",subject:"물리",category:"전자기학",content:"B원형 = kπ(상수)I ÷ r으로 계산한다."},

{title:"솔레노이드 방향",subject:"물리",category:"전자기학",content:"오른손 네 손가락을 전류 방향으로 감을 때 엄지가 N극 방향이다."},

{title:"솔레노이드 세기",subject:"물리",category:"전자기학",content:"B솔레노이드 = 2kπ(상수)nI으로 계산한다. n은 코일을 감은 수다."},

{title:"전자석",subject:"물리",category:"전자기학",content:"전류가 흐를 때만 자기력을 가지는 자석이다."},

{title:"자기력",subject:"물리",category:"전자기학",content:"자기장 속 전하나 전류가 받는 힘이다."},

{title:"전류, 자기장, 자기력방향",subject:"물리",category:"전자기학",content:"플레밍 왼손법칙으로 결정한다."},

{title:"전자기 유도 현상",subject:"물리",category:"전자기학",content:"자기장의 변화에 의해 전류가 발생하는 현상이다."},

{title:"유도기전력",subject:"물리",category:"전자기학",content:"전자기 유도에 의해 발생하는 전압이다."},

{title:"유도전류",subject:"물리",category:"전자기학",content:"유도기전력에 의해 흐르는 전류이다."},

{title:"패러데이의 법칙",subject:"물리",category:"전자기학",content:"유도기전력은 자속 변화율에 비례한다."},

{title:"전자기 유도",subject:"물리",category:"전자기학",content:"자기장 변화로 전기가 발생하는 원리이다."},

{title:"전자기력",subject:"물리",category:"전자기학",content:"전기력과 자기력을 통틀어 이르는 말이다."},

{title:"변압기",subject:"물리",category:"전자기학",content:"전자기 유도를 이용해 교류 전압을 높이거나 낮추는 장치이다."},

{title:"파동",subject:"물리",category:"파동",content:"에너지가 공간을 통해 전달되는 현상이다."},

{title:"매질",subject:"물리",category:"파동",content:"파동이 전달되는 물질이다."},

{title:"횡파",subject:"물리",category:"파동",content:"진동 방향과 진행 방향이 서로 수직인 파동이다."},

{title:"종파",subject:"물리",category:"파동",content:"진동 방향과 진행 방향이 같은 파동이다."},

{title:"구면파",subject:"물리",category:"파동",content:"점파원에서 구 모양으로 퍼지는 파동이다."},

{title:"평면파",subject:"물리",category:"파동",content:"파면이 평면인 파동이다."},

{title:"하위헌스의 원리",subject:"물리",category:"파동",content:"파면의 모든 점이 새로운 파원의 역할을 한다는 원리이다."},

{title:"파장",subject:"물리",category:"파동",content:"같은 위상의 두 점 사이 거리이다."},

{title:"진폭",subject:"물리",category:"파동",content:"평형 위치에서 최대 변위이다."},

{title:"주기",subject:"물리",category:"파동",content:"한 번 진동하는 데 걸리는 시간이다."},

{title:"골",subject:"물리",category:"파동",content:"횡파에서 가장 낮은 부분이다."},

{title:"마루",subject:"물리",category:"파동",content:"횡파에서 가장 높은 부분이다."},

{title:"전파 속도",subject:"물리",category:"파동",content:"파동이 진행하는 속도이다."},

{title:"전파 속력",subject:"물리",category:"파동",content:"파동의 이동 속도를 의미한다."},

{title:"평면파의 반사",subject:"물리",category:"파동",content:"평면파가 경계면에 부딪혀 되돌아오는 현상이다. 입사각과 반사각은 항상 같다."},

{title:"구면파의 반사",subject:"물리",category:"파동",content:"구면파가 경계면에서 반사되어 진행 방향을 바꾸는 현상이다."},

{title:"파동의 굴절",subject:"물리",category:"파동",content:"파동이 다른 매질로 들어가며 속력이 변해 진행 방향이 바뀌는 현상이다."},

{title:"굴절률",subject:"물리",category:"파동",content:"빛이 매질에서 얼마나 느려지는지를 나타내는 값이다."},

{title:"절대 굴절률",subject:"물리",category:"파동",content:"진공에서의 빛의 속도를 매질 속 빛의 속도로 나눈 값이다."},

{title:"상대 굴절률",subject:"물리",category:"파동",content:"한 매질에 대한 다른 매질의 굴절 정도를 나타내는 값이다."},

{title:"전반사",subject:"물리",category:"파동",content:"굴절 대신 모든 빛이 반사되는 현상이다."},

{title:"겉보기 깊이",subject:"물리",category:"파동",content:"굴절 때문에 실제보다 얕거나 깊게 보이는 깊이이다."},

{title:"소리",subject:"물리",category:"파동",content:"물체의 진동에 의해 발생하는 종파 형태의 파동이다."},

{title:"소리의 3요소",subject:"물리",category:"파동",content:"높낮이, 크기, 음색을 말한다."},

{title:"소리의 굴절",subject:"물리",category:"파동",content:"온도나 밀도 차이로 인해 소리의 진행 방향이 바뀌는 현상이다."},

{title:"소리의 회절",subject:"물리",category:"파동",content:"소리가 장애물 뒤쪽으로 휘어 전달되는 현상이다."},

{title:"주파수",subject:"물리",category:"파동",content:"1초 동안 반복되는 진동 횟수이다. 단위는 Hz이다."},

{title:"초음파",subject:"물리",category:"파동",content:"사람이 들을 수 없는 높은 진동수의 소리이다."},

{title:"상쇄 간섭",subject:"물리",category:"파동",content:"두 파동이 만나 진폭이 줄어드는 간섭 현상이다."},

{title:"보강 간섭",subject:"물리",category:"파동",content:"두 파동이 만나 진폭이 커지는 간섭 현상이다."},

{title:"정상파",subject:"물리",category:"파동",content:"반대 방향으로 진행하는 두 파동이 만나 형성되는 파동이다."},

{title:"맥놀이 수",subject:"물리",category:"파동",content:"진동수가 다른 두 파동이 겹칠 때 소리가 커졌다 작아졌다 하는 현상이 1초에 몇 번 반복되는지를 나타내는 수."},

{title:"실상",subject:"물리",category:"광학",content:"빛이 실제로 모여 형성되는 상이다. 스크린에 나타낼 수 있다."},

{title:"허상",subject:"물리",category:"광학",content:"빛이 실제로 모이지 않고 모이는 것처럼 보이는 상이다."},

{title:"도립",subject:"물리",category:"광학",content:"상이 원래 물체와 비교하여 거꾸로 뒤집혀 있는 상태이다."},

{title:"정립",subject:"물리",category:"광학",content:"상이 원래 물체와 같은 방향으로 서 있는 상태이다."},

{title:"오목 거울",subject:"물리",category:"광학",content:"안쪽으로 굽은 거울이다. 빛을 한 점으로 모을 수 있다."},

{title:"볼록 거울",subject:"물리",category:"광학",content:"바깥쪽으로 굽은 거울이다. 넓은 범위를 볼 수 있다."},
 
{title:"초점 거리",subject:"물리",category:"광학",content:"렌즈나 거울의 중심에서 초점까지의 거리이다."},

{title:"상의 배율",subject:"물리",category:"광학",content:"상의 크기를 물체의 크기로 나눈 값이다."},

{title:"볼록 렌즈",subject:"물리",category:"광학",content:"가운데가 두껍고 빛을 모으는 렌즈이다."},

{title:"오목 렌즈",subject:"물리",category:"광학",content:"가운데가 얇고 빛을 퍼뜨리는 렌즈이다."},

{title:"빛의 합성",subject:"물리",category:"광학",content:"여러 색의 빛이 섞여 새로운 색을 만드는 현상이다."},

{title:"물체의 색",subject:"물리",category:"광학",content:"물체가 반사하는 빛의 색을 우리 눈이 인식한 결과이다."},

{title:"빛의 분산",subject:"물리",category:"광학",content:"빛이 파장에 따라 다른 각도로 굴절되어 색이 나뉘는 현상이다."},

{title:"빛의 산란",subject:"물리",category:"광학",content:"빛이 작은 입자에 의해 여러 방향으로 퍼지는 현상이다."}


];


const formulas = [

{
title:"무게",
subject:"물리",
category:"역학",
formula:"W = mg"
},

{
title:"속도와 시간의 관계식",
subject:"물리",
category:"역학",
formula:"v = v₀ + at"
},

{
title:"변위와 시간의 관계식",
subject:"물리",
category:"역학",
formula:"s = v₀t + ½at²"
},

{
title:"변위와 속도의 관계식",
subject:"물리",
category:"역학",
formula:"2as = v² - v₀²"
},

{
title:"최고점 도달 시간",
subject:"물리",
category:"역학",
formula:"t = v₀/g"
},

{
title:"최고점 높이",
subject:"물리",
category:"역학",
formula:"h = v₀²/(2g)"
},

{
title:"만유인력",
subject:"물리",
category:"역학",
formula:"F = G(상수)m₁m₂/r²"
},

{
title:"용수철 직렬 연결시 용수철 상수",
subject:"물리",
category:"역학",
formula:"1/k = 1/k₁ + 1/k₂"
},

{
title:"용수철 병렬 연결시 용수철 상수",
subject:"물리",
category:"역학",
formula:"k = k₁ + k₂"
},

{
title:"탄성력",
subject:"물리",
category:"역학",
formula:"F = -kx"
},

{
title:"탄성에너지",
subject:"물리",
category:"역학",
formula:"E = ½kx²"
},

{
title:"위치에너지",
subject:"물리",
category:"역학",
formula:"Ep = mgh"
},

{
title:"운동에너지",
subject:"물리",
category:"역학",
formula:"Ek = ½mv²"
},

{
title:"역학적 에너지",
subject:"물리",
category:"역학",
formula:"E = Ek + Ep"
},

{
title:"정지 마찰력",
subject:"물리",
category:"역학",
formula:"Fs ≤ μsmgcosθ"
},

{
title:"운동 마찰력",
subject:"물리",
category:"역학",
formula:"Fk = μkmgcosθ"
},

{
title:"부력",
subject:"물리",
category:"역학",
formula:"F = ρgV"
},

{
title:"뉴턴 제2법칙",
subject:"물리",
category:"역학",
formula:"F = ma"
},

{
title:"구심가속도",
subject:"물리",
category:"역학",
formula:"a = v²/r"
},

{
title:"구심력",
subject:"물리",
category:"역학",
formula:"F = mv²/r"
},

{
title:"옴의 법칙",
subject:"물리",
category:"전자기학",
formula:"V = IR"
},

{
title:"줄열",
subject:"물리",
category:"전자기학",
formula:"Q = VIt"
},

{
title:"전하량이 한 일",
subject:"물리",
category:"전자기학",
formula:"W = VIt"
},

{
title:"전력",
subject:"물리",
category:"전자기학",
formula:"P = VI"
},

{
title:"자기장의 세기",
subject:"물리",
category:"전자기학",
formula:"B = 자속/S(표면적)"
},

{
title:"직선 전류 자기장",
subject:"물리",
category:"전자기학",
formula:"B = kI/r"
},

{
title:"자기력",
subject:"물리",
category:"전자기학",
formula:"F = BIlsinθ"
},

{
title:"전자가 받는 힘",
subject:"물리",
category:"전자기학",
formula:"F = Bqvsinθ"
},

{
title:"회전 반경",
subject:"물리",
category:"전자기학",
formula:"r = mv/(Bq)"
},

{
title:"패러데이 법칙",
subject:"물리",
category:"전자기학",
formula:"ε = -N(감은 수)ΔΦ/Δt"
},

{
title:"전파속도",
subject:"물리",
category:"파동",
formula:"v = fλ"
},

{
title:"스넬의 법칙",
subject:"물리",
category:"파동",
formula:"n₁sinθ₁ = n₂sinθ₂"
},

{
title:"도플러 효과",
subject:"물리",
category:"파동",
formula:"f' = f(v±vo)/(v∓vs)"
},

{
title:"맥놀이 수",
subject:"물리",
category:"파동",
formula:"맥놀이수 = |f₁ - f₂|"
},

{
title:"렌즈 제작자의 공식",
subject:"물리",
category:"광학",
formula:"a:물체와 거울 혹은 렌즈 중심 사이의 거리, b:상과 거울 혹은 렌즈 중심 사이의 거리, f:초점 거리, m:상의 배율, 1/a + 1/b = 1/f, m = -b/a"
}

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

const savedQuizzes =
JSON.parse(
localStorage.getItem("quizzes")
);

if(savedQuizzes){

    quizzes.forEach((q,i)=>{

        if(savedQuizzes[i]){

            q.wrongCount =
            savedQuizzes[i].wrongCount || 0;

        }

    });

}

    



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

localStorage.setItem(
"quizzes",
JSON.stringify(quizzes)
);

localStorage.setItem(
"todaySolved",
todaySolved
);

localStorage.setItem(
"todayCorrect",
todayCorrect
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

    document
    .getElementById("formulaResults")
    .classList.add("hidden-formula");

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

    const today =
new Date().toLocaleDateString();

const lastDate =
localStorage.getItem("lastDate");

if(lastDate !== today){

    todaySolved = 0;
    todayCorrect = 0;

    localStorage.setItem("todaySolved",0);
    localStorage.setItem("todayCorrect",0);
    localStorage.setItem("lastDate",today);

}

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

if(correct === 100){
    unlockAchievement("정답 100개 달성");
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

 if(level === 10){
    unlockAchievement("레벨 10 달성");
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


function searchConcept(){

    const keyword =
    document
    .getElementById("searchInput")
    .value
.toLowerCase()
.replace(/\s/g, "");

    const box =
    document
    .getElementById("conceptResults");

    box.innerHTML = "";

    
    concepts
    .filter(item => {

    const title =
    (item.title || "")
    .toLowerCase()
    .replace(/\s/g,"");

    const subject =
    (item.subject || "")
    .toLowerCase()
    .replace(/\s/g,"");

    const category =
    (item.category || "")
    .toLowerCase()
    .replace(/\s/g,"");

    const content =
    (item.content || "")
    .toLowerCase()
    .replace(/\s/g,"");

    return (
        title.includes(keyword) ||
        subject.includes(keyword) ||
        category.includes(keyword) ||
        content.includes(keyword)
    );

})
    .forEach(item => {

        const div =
        document.createElement("div");

 div.innerHTML =
"<h3>" + item.title + "</h3>" +

"<p>📚 <b>과목:</b> " +
(item.subject || "미분류") +
"</p>" +

"<p>🧩 <b>카테고리:</b> " +
(item.category || "미분류") +
"</p>" +

"<p>📖 <b>설명</b></p>" +

"<p>" +
item.content +
"</p><hr>";

        box.appendChild(div);

    });

}


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

function setQuizMode(mode){

    quizMode = mode;

    currentQuiz = 0;

    loadQuiz();

}

shuffleCards();

updateStats();

loadQuiz();

searchConcept();

checkAchievements();

renderAchievements();

showTab("formulas")

searchFormula();
