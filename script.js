let wordArr = [];
let showWordNum = 0;

let round = 1;
const val = 30;
let roundNum = val * round;
let ukSpeech = "";
let usSpeech = "";

this.onload = function () {
    const url = "GaoZhongluan_2.json";
    const request = new XMLHttpRequest();
    request.open('get', url, true);
    request.onload = function () {
        if (this.status == 200) {
            let obj = JSON.parse(this.responseText);
            for (let index = 0; index < obj.length; index++) {
                wordArr.push(obj[index]);
            }
            console.log(wordArr);
            showWord();
        }

    }
    request.send();
}
function showWord() {
    remaining.textContent = roundNum - showWordNum;
    ukSpeech = wordArr[showWordNum].content.word.content.ukspeech;
    usSpeech = wordArr[showWordNum].content.word.content.usspeech;

    ukPhone.textContent = wordArr[showWordNum].content.word.content.ukphone;
    usPhone.textContent = wordArr[showWordNum].content.word.content.usphone;

    document.querySelector('#headWord').textContent = wordArr[showWordNum].headWord;
    let msg = "";
    for (let index = 0; index < wordArr[showWordNum].content.word.content.trans.length; index++) {
        msg += `${wordArr[showWordNum].content.word.content.trans[index].pos}: ${wordArr[showWordNum].content.word.content.trans[index].tranCn} <br>`;
    }
    document.querySelector('#translation').innerHTML = msg;
    const sentenceFather = document.querySelector("#sentenceFather");

    if (wordArr[showWordNum].content.word.content.sentence != undefined) {
        let sentencesMSG = "";
        for (let index = 0; index < wordArr[showWordNum].content.word.content.sentence.sentences.length; index++) {
            sentencesMSG += `${wordArr[showWordNum].content.word.content.sentence.sentences[index].sContent} <br>
            ${wordArr[showWordNum].content.word.content.sentence.sentences[index].sCn} <br>`;
        }
        sentenceFather.classList.remove('d-none');
        document.querySelector('#sentence').innerHTML = sentencesMSG;
    } else {
        sentenceFather.classList.add('d-none');
    }
}

const inputWord = document.querySelector('#inputWord');
const btnBox = document.querySelector('#btnBox');
const warning = document.querySelector('#warning');
const inputBox = document.querySelector('#inputBox');

inputWord.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (inputWord.value == wordArr[showWordNum].headWord) {
            if (roundNum - showWordNum == 1) {
                btnBox.classList.remove('d-none');
                inputWord.disabled = true;
                remaining.textContent = roundNum - showWordNum - 1;
            } else {
                console.log("yes");
                enterIsTrue();
            }
        } else {
            console.log("no");
            enterIsFalse();
        }
    }
})

const roundProgress = document.querySelector('#round');
const remaining = document.querySelector('#remaining');
roundProgress.textContent = round;

// enter is true
function enterIsTrue() {
    warning.classList.add('d-none');
    inputWord.value = "";
    showWordNum++;
    remaining.textContent = roundNum - showWordNum;
    showWord();
}
// enter is false
function enterIsFalse() {
    warning.classList.remove('d-none');
    for (let index = 0; index < + 6; index++) {
        setTimeout(transform, 100 * index, ((index % 2) * 2 - 1) * 20);
        setTimeout(transform, 100 * 6, 0, 0);
    }
}

// restart and next button
const restartBtn = btnBox.querySelectorAll('button')[0];
const nextBtn = btnBox.querySelectorAll('button')[1];
restartBtn.addEventListener('click', function () {
    restart();
})
nextBtn.addEventListener('click', function () {
    next();
})
function restart() {
    showWordNum = roundNum - val;
    showWord();
    btnBox.classList.add('d-none');
    inputWord.disabled = false;
    inputWord.value = "";
}
function next() {
    inputWord.disabled = false;
    round++;
    showWordNum++;
    roundNum = val * round;
    roundProgress.textContent = round;
    inputWord.value = "";
    btnBox.classList.add('d-none');
    showWord();
}

function transform(x) {
    inputBox.style.transform = `translateX(${x}px)`
}

const ukPhone = document.querySelector('#ukPhone');
const usPhone = document.querySelector('#usPhone');

// UK Phone
ukPhone.addEventListener('click', function () {
    console.log(ukSpeech);

    const youdaoURL = `https://dict.youdao.com/dictvoice?audio=${ukSpeech}`;
    const UKAudio = document.querySelector('#UKAudio');
    const youdaoUKPhone = document.querySelector('#youdaoUKPhone');

    youdaoUKPhone.setAttribute('src', youdaoURL);
    UKAudio.load();
    UKAudio.play();
});

//US phone
usPhone.addEventListener('click', function () {
    console.log(usSpeech);

    const youdaoURL = `https://dict.youdao.com/dictvoice?audio=${usSpeech}`;
    const USAudio = document.querySelector('#USAudio');
    const youdaoUSPhone = document.querySelector('#youdaoUSPhone');
    
    youdaoUSPhone.setAttribute('src', youdaoURL);
    USAudio.load();
    USAudio.play();
});