let wordArr = [];
let showWordNum = 0;

let round = 1;
const val = 3;
let roundNum = val * round;

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

    document.querySelector('#headWord').textContent = wordArr[showWordNum].headWord;
    let msg = "";
    for (let index = 0; index < wordArr[showWordNum].content.word.content.trans.length; index++) {
        msg += `${wordArr[showWordNum].content.word.content.trans[index].pos}: ${wordArr[showWordNum].content.word.content.trans[index].tranCn} <br>`;
    }
    document.querySelector('#translation').innerHTML = msg;
}

const inputWord = document.querySelector('#inputWord');
const btnBox = document.querySelector('#btnBox');
inputWord.addEventListener('keydown', function (e) {
    if (e.code === 'Enter') {
        if (inputWord.value == wordArr[showWordNum].headWord) {
            if (roundNum - showWordNum == 1) {
                btnBox.classList.remove('d-none');
                inputWord.disabled = true;
                remaining.textContent = roundNum - showWordNum - 1;
            } else {
                console.log("yes");
                inputWord.value = "";

                showWordNum++;
                remaining.textContent = roundNum - showWordNum;
                showWord();
            }
        } else {
            console.log("you fuck up");
        }
    }
})

const roundProgress = document.querySelector('#round');
const remaining = document.querySelector('#remaining');
roundProgress.textContent = round;

const restartBtn = btnBox.querySelectorAll('button')[0];
const nextBtn = btnBox.querySelectorAll('button')[1];

restartBtn.addEventListener('click', function () {
    showWordNum = roundNum - val;
    showWord();
    btnBox.classList.add('d-none');
    inputWord.disabled = false;
    inputWord.value = "";
})
nextBtn.addEventListener('click', function () {
    inputWord.disabled = false;
    round++;
    showWordNum++;
    roundNum = val * round;
    roundProgress.textContent = round;
    inputWord.value = "";
    btnBox.classList.add('d-none');
    showWord();
})