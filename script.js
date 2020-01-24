const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer')

var start = 0;
var timerControl;

quoteInputElement.addEventListener('input', ()=> {
    if(start==0)
    {
        timerElement.innerText=1;
        startTimer();
    }
    start=start+1;
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');
    let correct = true;
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if(character == null)
        {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct=false;
        }
        else if(character === characterSpan.innerText)
        {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        }
        else
        {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct=false;
        }
    })

    if(correct){
        renderNewQuote();
        start=0;
        clearInterval(timerControl);
        timerElement.innerText=0;       
    }
})

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
    .then(response=> response.json())
    .then(data => data.content)
}

async function renderNewQuote(){
    const quote = await getRandomQuote();
    quoteDisplayElement.innerText = '';
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerHTML = character;
        quoteDisplayElement.appendChild(characterSpan);
    })
    quoteInputElement.value = null;
}

let startTime;

function startTimer()
{
    startTime = new Date();
    timerControl=setInterval(()=> {
        timerElement.innerText=getTimerTime();
    },1000)
}

function getTimerTime() {
    const time=Math.floor((new Date() - startTime)/1000);
    return time+1;
}

renderNewQuote();