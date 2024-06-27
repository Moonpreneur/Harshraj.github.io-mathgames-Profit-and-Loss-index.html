

// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalScoreEl = document.querySelector('.final-score');
const correctAnswersEl = document.querySelector('.correct-answers');
const incorrectAnswersEl = document.querySelector('.incorrect-answers');
const playAgainBtn = document.querySelector('.play-again');

// Game Variables
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];
let correctAnswers = 0;
let incorrectAnswers = 0;

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// Scroll
let valueY = 0;

// Refresh Splash Page Best Scores
function bestScoresToDOM() {
    bestScores.forEach((bestScore, index) => {
        const bestScoreEl = bestScore;
        bestScoreEl.textContent = `${bestScoreArray[index].bestScore}`;
    });
}

// Check Local Storage for Best Scores, set bestScoreArray
function getSavedBestScores() {
    if (localStorage.getItem('bestScores')) {
        bestScoreArray = JSON.parse(localStorage.bestScores);
    } else {
        bestScoreArray = [
            { questions: 10, bestScore: finalTimeDisplay },
            { questions: 25, bestScore: finalTimeDisplay },
            { questions: 50, bestScore: finalTimeDisplay },
            { questions: 99, bestScore: finalTimeDisplay },
        ];
        localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
    }
    bestScoresToDOM();
}

// Update Best Score Array
function updateBestScore() {
    bestScoreArray.forEach((score, index) => {
        // Select correct Best Score to update
        if (questionAmount == score.questions) {
            const savedBestScore = Number(bestScoreArray[index].bestScore);
            // Update if the new final score is less or replacing zero
            if (savedBestScore === 0 || savedBestScore > finalTime) {
                bestScoreArray[index].bestScore = finalTimeDisplay;
            }
        }
    });
    // Update Splash Page
    bestScoresToDOM();
    // Save to Local Storage
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

// Reset Game
function playAgain() {
    gamePage.addEventListener('click', startTimer);
    scorePage.hidden = true;
    splashPage.hidden = false;
    equationsArray = [];
    playerGuessArray = [];
    valueY = 0;
    playAgainBtn.hidden = true;
}

// Show Score Page
function showScorePage() {
    // Show Play Again button after 1 second
    setTimeout(() => {
        playAgainBtn.hidden = false;
    }, 1000);
    gamePage.hidden = true;
    scorePage.hidden = false;
}

// Function to update scores in the DOM
function scoresToDOM() {
    // Calculate the final score based on correct and incorrect answers
    const finalScore = correctAnswers;
    // Display the final score and answers
    finalScoreEl.textContent = `Final Score: ${finalScore}`;
    correctAnswersEl.textContent = `Correct Answers: ${correctAnswers}`;
    // Display incorrect answers only if there are any
    if (incorrectAnswers > 0) {
        incorrectAnswersEl.textContent = `Incorrect Answers: -${incorrectAnswers}`;
    } else {
        incorrectAnswersEl.textContent = `Incorrect Answers: 0`; // or any other message if you prefer
    }
    updateBestScore();
    // Scroll to the top of the item container instantly
    itemContainer.scrollTo({ top: 0, behavior: 'instant' });
    // Show the score page
    showScorePage();
}


// Function to check time and process results
function checkTime() {
    if (playerGuessArray.length == questionAmount) {
        clearInterval(timer);
        // Check for correct and incorrect guesses
        equationsArray.forEach((equation, index) => {
            if (equation.evaluated === playerGuessArray[index]) {
                // Correct Guess
                correctAnswers++;
            } else {
                // Incorrect Guess
                incorrectAnswers++;
            }
        });
        // Call scoresToDOM to update scores in the DOM
        scoresToDOM();
    }
}


// Add a tenth of a second to timePlayed
function addTime() {
    timePlayed += 0.1;
    checkTime();
}

// Start timer when game page is clicked
function startTimer() {
    // Reset times
    timePlayed = 0;
    penaltyTime = 0;
    finalTime = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    timer = setInterval(addTime, 100);
    gamePage.removeEventListener('click', startTimer);
}

// Scroll, Store user selection in playerGuessArray
function select(guessedProfit) {
    // Scroll 80 pixels
    valueY += 80;
    itemContainer.scroll(0, valueY);
    // Add player guess to array
    return guessedProfit ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

// Displays 3, 2, 1 GO!
function countdownStart() {
    let count = 5;
    countdown.textContent = count;
    const timeCountDown = setInterval(() => {
        count--;
        if (count === 0) {
            countdown.textContent = 'GO!';
        } else if (count === -1) {
            showGamePage();
            clearInterval(timeCountDown);
        } else {
            countdown.textContent = count;
        }
    }, 1000);
}

// Navigate from Splash Page to Countdown Page to Game Page
function showGamePage() {
    countdownPage.hidden = true;
    gamePage.hidden = false;
}

// Navigate from Splash Page to Countdown Page to Game Page
function showCountdown() {
    countdownPage.hidden = false;
    splashPage.hidden = true;
    countdownStart();
    populateGamePage();
}

// Get the value from selected radio button
function getRadioValue() {
    let radioValue;
    radioInputs.forEach((radioInput) => {
        if (radioInput.checked) {
            radioValue = radioInput.value;
        }
    });
    return radioValue;
}

// Form that decides Amount of Questions
function selectQuestionAmount(e) {
    e.preventDefault();
    questionAmount = getRadioValue();
    if (questionAmount) {
        showCountdown();
    }
}

// Event Listeners
startForm.addEventListener('click', () => {
    radioContainers.forEach((radioEl) => {
        // Remove Selected Label Styling
        radioEl.classList.remove('selected-label');
        // Add it back if radio input is checked
        if (radioEl.children[1].checked) {
            radioEl.classList.add('selected-label');
        }
    });
});

// Event Listener
startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);

// On Load
getSavedBestScores();


