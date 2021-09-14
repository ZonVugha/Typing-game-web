let wordArr = [];
let showWordNum = 0;

let round = 1;
let val = 30;
let roundNum = val * round;
let ukSpeech = "";
let usSpeech = "";

const bookNameArr = [
    'book/gaozhongluan_2.json',
    'book/CET4luan_2.json',
    'book/CET6_2.json',
    'book/IELTSluan_2.json',
    'book/TOEFL_2.json'
]

let bookURL = bookNameArr[0];

if (localStorage.getItem('bookID')) {
    bookURL = bookNameArr[localStorage.getItem('bookID')];
}
this.onload = function () {
    const request = new XMLHttpRequest();
    request.open('get', bookURL, true);
    request.onload = function () {
        if (this.status == 200) {
            let obj = JSON.parse(this.responseText);
            for (let index = 0; index < obj.length; index++) {
                wordArr.push(obj[index]);
            }
            console.log(wordArr);
            showWord();
            showOption();
        }
    }
    request.send();
}
function showOption() {
    let optionEle = "";
    for (let index = 1; index < Math.ceil(wordArr.length / val) + 1; index++) {
        optionEle += `<option>${index}</option>`
    }
    roundProgress.innerHTML = optionEle;
}
function showRemaining() {
    if (wordArr.length - (roundProgress.value - 1) * val < val) {
        roundNum = val * (round - 1) + wordArr.length - (roundProgress.value - 1) * val;
    }
}
function showWord() {
    remaining.textContent = roundNum - showWordNum;
    ukSpeech = wordArr[showWordNum].content.word.content.ukspeech;
    usSpeech = wordArr[showWordNum].content.word.content.usspeech;
    ukPhone.textContent = wordArr[showWordNum].content.word.content.ukphone;
    usPhone.textContent = wordArr[showWordNum].content.word.content.usphone;

    document.querySelector('#headWord').textContent = wordArr[showWordNum].headWord;

    getAutoSpeech();
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
    if (e.key === 'Enter' || e.code === 'Enter') {
        if (inputWord.value.toLowerCase() == wordArr[showWordNum].headWord.toLowerCase()) {
            if (roundNum - showWordNum == 1) {
                if (wordArr.length - (roundProgress.value - 1) * val < val) {
                    document.querySelector('#nextBtn').classList.add('d-none');
                } else {
                    document.querySelector('#nextBtn').classList.remove('d-none');
                }
                btnBox.classList.remove('d-none');
                inputWord.disabled = true;
                remaining.textContent = roundNum - showWordNum - 1;
            } else {
                enterIsTrue();
            }
        } else {
            enterIsFalse();
        }
    }
})

const roundProgress = document.querySelector('#round');
const remaining = document.querySelector('#remaining');
roundProgress.value = round;
// enter is true
function enterIsTrue() {
    warning.classList.add('d-none');
    inputWord.value = "";
    showWordNum++;
    remaining.textContent = roundNum - showWordNum;
    showRemaining();
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
    if (wordArr.length - (roundProgress.value - 1) * val < val) {
        roundNum = val * (round - 1) + wordArr.length - (roundProgress.value - 1) * val;
        showWordNum = val * (round - 1);
    } else {
        showWordNum = roundNum - val;
    }
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
    roundProgress.value = round;
    inputWord.value = "";
    btnBox.classList.add('d-none');
    showRemaining()
    showWord();
}

function transform(x) {
    inputBox.style.transform = `translateX(${x}px)`
}

const ukPhone = document.querySelector('#ukPhone');
const usPhone = document.querySelector('#usPhone');

// UK Phone
ukPhone.addEventListener('click', function () {
    const youdaoURL = `https://dict.youdao.com/dictvoice?audio=${ukSpeech}`;
    const UKAudio = document.querySelector('#UKAudio');
    const youdaoUKPhone = document.querySelector('#youdaoUKPhone');

    youdaoUKPhone.setAttribute('src', youdaoURL);
    UKAudio.load();
    UKAudio.play();
});

//US phone
usPhone.addEventListener('click', function () {
    const youdaoURL = `https://dict.youdao.com/dictvoice?audio=${usSpeech}`;
    const USAudio = document.querySelector('#USAudio');
    const youdaoUSPhone = document.querySelector('#youdaoUSPhone');

    youdaoUSPhone.setAttribute('src', youdaoURL);
    USAudio.load();
    USAudio.play();
});

// autoSpeech
function autoSpeech(word) {
    const youdaoURL = `https://dict.youdao.com/dictvoice?audio=${word}`;

    return `
    <audio autoplay id="autoAudio" class="d-none" name="media">
        <source src="${youdaoURL}" type="audio/mpeg">
    </audio>
    `;
}
// open or close autoSpeech and speech style (UK and US default UK)
const switchAuto = document.querySelector('#switchAuto');
const switchStyle = document.querySelector('#switchStyle');
function getAutoSpeech() {
    if (switchAuto.checked) {
        if (switchStyle.checked) {
            document.querySelector('#autoAudioBox').innerHTML = autoSpeech(usSpeech);
        } else {
            document.querySelector('#autoAudioBox').innerHTML = autoSpeech(ukSpeech);
        }
    } else {
        document.querySelector('#autoAudioBox').innerHTML = ""
    }
}

// change bookListContainer icon
const bookListContainer = document.querySelector('#bookListContainer');
bookListContainer.addEventListener('click', function () {
    const iconElement = document.querySelector('#iconElement');
    iconElement.classList.toggle('touch');
})

// change vocabulary
const bookItem = document.querySelectorAll('.bookItem');
if (localStorage.getItem('bookID')) {
    bookItem[localStorage.getItem('bookID')].classList.add('active');
} else {
    bookItem[0].classList.add('active');
}

for (let index = 0; index < bookItem.length; index++) {
    const element = bookItem[index];
    element.addEventListener('click', function () {
        localStorage.setItem('bookID', element.dataset.id);
        location.reload();
    })
}
// choose round
roundProgress.addEventListener('change', chooseRound);
function chooseRound() {
    showWordNum = (roundProgress.value - 1) * val;
    round = roundProgress.value;
    roundNum = val * round;
    inputWord.disabled = false;
    inputWord.value = "";
    btnBox.classList.add('d-none');
    showRemaining();
    showWord();
}
