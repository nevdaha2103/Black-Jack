let blackJackGame = {
    "you": { "scoreSpan": "#yourResult", "div": "#yourBox", "score": 0 },
    "dealer": { "scoreSpan": "#dealerResult", "div": "#dealerBox", "score": 0 },
    "cards": [
        { value: "2", type: "heart" }, { value: "3", type: "heart" }, { value: "4", type: "heart" }, { value: "5", type: "heart" },
        { value: "6", type: "heart" }, { value: "7", type: "heart" }, { value: "8", type: "heart" }, { value: "9", type: "heart" },
        { value: "10", type: "heart" }, { value: "K", type: "heart" }, { value: "Q", type: "heart" }, { value: "J", type: "heart" },
        { value: "A", type: "heart" },
        { value: "2", type: "bub" }, { value: "3", type: "bub" }, { value: "4", type: "bub" }, { value: "5", type: "bub" },
        { value: "6", type: "bub" }, { value: "7", type: "bub" }, { value: "8", type: "bub" }, { value: "9", type: "bub" },
        { value: "10", type: "bub" }, { value: "K", type: "bub" }, { value: "Q", type: "bub" }, { value: "J", type: "bub" },
        { value: "A", type: "bub" },
        { value: "2", type: "cross" }, { value: "3", type: "cross" }, { value: "4", type: "cross" }, { value: "5", type: "cross" },
        { value: "6", type: "cross" }, { value: "7", type: "cross" }, { value: "8", type: "cross" }, { value: "9", type: "cross" },
        { value: "10", type: "cross" }, { value: "K", type: "cross" }, { value: "Q", type: "cross" }, { value: "J", type: "cross" },
        { value: "A", type: "cross" },
        { value: "2", type: "spades" }, { value: "3", type: "spades" }, { value: "4", type: "spades" }, { value: "5", type: "spades" },
        { value: "6", type: "spades" }, { value: "7", type: "spades" }, { value: "8", type: "spades" }, { value: "9", type: "spades" },
        { value: "10", type: "spades" }, { value: "K", type: "spades" }, { value: "Q", type: "spades" }, { value: "J", type: "spades" },
        { value: "A", type: "spades" }
    ],
    "cardsMap": { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "K": 10, "Q": 10, "J": 10, "A": [1, 11] },
    "wins": 0,
    "losses": 0,
    "draws": 0,
};

const YOU = blackJackGame['you'];
const DEALER = blackJackGame['dealer'];
let hitPressed = false;
let standPressed = false;
const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const loseSound = new Audio('sounds/aww.mp3');

document.querySelector('#hit').addEventListener('click', hitbtn);
document.querySelector('#stand').addEventListener('click', dealerLogic);
document.querySelector('#deal').addEventListener('click', dealbtn);


function hitbtn() {
    if (!standPressed) {
        hitPressed = true;
        let cardObject = randomCard();
        showCard(YOU, cardObject);
        updateScore(YOU, cardObject);
    }
}

function dealerLogic() {
    if (hitPressed && !standPressed) {
        standPressed = true;

        flipDealerCard();

        let timer = setInterval(() => {
            let card = randomCard();
            showCard(DEALER, card);
            updateScore(DEALER, card);

            if (DEALER['score'] > 16) {
                showResult(computWinner());
                clearInterval(timer);
            }
        }, 750);
    }
}

function dealbtn() {
    if (standPressed) {
        hitPressed = false;
        standPressed = false;

        let yourimages = document.querySelector('#yourBox').querySelectorAll('img');
        let dealerimages = document.querySelector('#dealerBox').querySelectorAll('img');

        for (let i = 0; i < yourimages.length; i++) yourimages[i].remove();
        for (i = 0; i < dealerimages.length; i++) dealerimages[i].remove();

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#yourResult').textContent = 0;
        document.querySelector('#yourResult').style.color = 'white';
        document.querySelector('#dealerResult').textContent = 0;
        document.querySelector('#dealerResult').style.color = 'white';

        document.querySelector('#status').textContent = "Let's Play!";
        document.querySelector('#status').style.color = 'black';
    }
}


function showCard(activePlayer, cardObject, isFaceDown = false) {
    if (activePlayer['score'] <= 21) {
        hitSound.play();
        let cardImage = document.createElement('img');
        if (isFaceDown) {
            cardImage.src = `images/cardImages/back.png`; 
            cardImage.setAttribute('data-type', cardObject.type);
            cardImage.setAttribute('data-value', cardObject.value);
            cardImage.classList.add('face-down');
        } else {
            cardImage.src = `images/cardImages/${cardObject.type}-${cardObject.value}.png`;
        }
        document.querySelector(activePlayer["div"]).appendChild(cardImage);
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * blackJackGame["cards"].length);
    return blackJackGame["cards"][randomIndex];
}

function updateScore(activePlayer, card) {
    if (card.value === 'A') {
        if (activePlayer['score'] + blackJackGame['cardsMap'][card.value][1] <= 21) activePlayer['score'] += 11;
        else activePlayer['score'] += 1;
    } else {
        activePlayer['score'] += blackJackGame['cardsMap'][card.value];
    }
    document.querySelector(activePlayer["scoreSpan"]).innerHTML = activePlayer['score'];
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
}

function computWinner() {
    let winner;
    let y = YOU['score'];
    let d = DEALER['score'];
    if (y <= 21) {
        if (y > d || d > 21) {
            winner = YOU;
            blackJackGame['wins']++;
        } else if (y < d) {
            winner = DEALER;
            blackJackGame['losses']++;
        } else if (y === d) blackJackGame['draws']++;
    } else if (y > 21 && d <= 21) {
        winner = DEALER;
        blackJackGame['losses']++;
    } else if (y > 21 && d > 21) blackJackGame['draws']++;
    return winner;
}

function showResult(winner) {
    let message, messageColor;
    if (winner === YOU) {
        message = 'You Won!';
        messageColor = 'green';
        winSound.play();
    } else if (winner === DEALER) {
        message = 'You Lost!';
        messageColor = 'red';
        loseSound.play();
    } else {
        message = 'You Drew';
        messageColor = 'black';
    }

    document.querySelector('#status').textContent = message;
    document.querySelector('#status').style.color = messageColor;
    document.querySelector('#wins').textContent = blackJackGame['wins'];
document.querySelector('#losses').textContent = blackJackGame['losses'];
document.querySelector('#draws').textContent = blackJackGame['draws'];
}

function flipDealerCard() {
    let faceDownCard = document.querySelector('#dealerBox .face-down');
    if (faceDownCard) {
        let type = faceDownCard.getAttribute('data-type');
        let value = faceDownCard.getAttribute('data-value');
        faceDownCard.src = `images/cardImages/${type}-${value}.png`;
        faceDownCard.classList.remove('face-down');
    }
}
