let easy = "easy"
let medium = "medium"
let hard = "hard"
let dummyScore = [10, 10, 15, 15, 20, 20]
let player1Score = 0
let player2Score = 0
let count = 0;
let playedCategories = [];
let currentCategory = ""
let player1Name = ""
let player2Name = ""
let questionBank = []
let highScore = 0
let StartGameAgainIntervalID = ""

async function getData(category, difficulties) {
    const res = await fetch(`https://the-trivia-api.com/v2/questions?limit=1&categories=${category}&difficulties=${difficulties}`);
    const data = await res.json();
    currentCategory = category
    playedCategories.push(category);
    // console.log(data)
    bindData(data);
}

const formSubmitBtn = document.querySelector('#player-form');
formSubmitBtn.addEventListener('submit', (event) => {
    event.preventDefault();
    player1Name = document.querySelector('#player1').value;
    player2Name = document.querySelector('#player2').value;
    console.log(`Player 1: ${player1Name},Player 2: ${player2Name}`);

    formSubmitBtn.style.display = "none";
    const categorySelect = document.getElementById('category-select');
    categorySelect.style.display = "block";
});

const categorySelect = document.getElementById('categories');
categorySelect.addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    // console.log(`Selected category: ${selectedCategory}`);
    if (StartGameAgainIntervalID) {
        clearInterval(StartGameAgainIntervalID);
    }
    getData(selectedCategory,easy);
});

const questionContainer = document.getElementById('question-container');

function bindData(data) {
    questionContainer.innerHTML = "";
    // console.log(data,count)
    const player = document.createElement('h2')
    player.style.color = "yellow";
    player.style.fontSize = "2rem";

    if (count % 2 == 0) {
        player.innerText = `It's ${player1Name} your turn please select the correct answer.`
        questionContainer.prepend(player);
    }
    else {
        player.innerText = `It's ${player2Name} your turn please select the correct answer.`
        questionContainer.prepend(player);
    }

    const questionText = document.createElement('h2');
    questionText.innerHTML = `Question No ${count + 1}: ${data[0].question.text}`;
    questionContainer.appendChild(questionText);

    //  Question ke option ke liye 
    const options = [...data[0].incorrectAnswers, data[0].correctAnswer].sort(() => Math.random() - 0.5);
    const optionList = document.createElement('ol');
    options.forEach(option => {
        const list = document.createElement('li')
        list.innerText = option;
        optionList.appendChild(list);
        questionContainer.appendChild(optionList)

        // question par click karne ke baad ka behavior write or wrong answer
        list.addEventListener('click', () => {
            console.log(`Selected answer: ${option}`);
            // const correctAnswer = document.createElement('h2')
            // const incorrectAnswer = document.createElement('h2')

            if (count % 2 == 0) {
                if (option == data[0].correctAnswer) {
                    // console.log("Correct answer!");
                    player1Score += dummyScore[count]
                    player.innerText = `Weldone your Answer is correct and now your score is ${player1Score}`;
                    player.style.color = "green";

                    // questionContainer.prepend(correctAnswer)
                } else {
                    // console.log("Incorrect answer.");
                    player.innerText = `Your answer is incorrect and correct answer is ${data[0].correctAnswer}`;
                    player.style.color = "red";
                    // questionContainer.prepend(incorrectAnswer)
                }
            } else {
                if (option == data[0].correctAnswer) {
                    // console.log("Correct answer!");
                    player2Score += dummyScore[count]
                    // console.log(dummyScore)
                    // console.log(count)
                    player.innerText = `Weldone your Answer is correct and now your score is ${player2Score}`;
                    // questionContainer.prepend(correctAnswer)
                    player.style.color = "green";

                } else {
                    console.log("Incorrect answer.");
                    player.innerText = `Your answer is incorrect and correct answer is ${data[0].correctAnswer}`;
                    // questionContainer.prepend(incorrectAnswer)
                    player.style.color = "red";
                }
            }

            count++
            setTimeout(() => {
                if (count < 2) {
                    getData(currentCategory, easy);
                } else if (count >= 2 && count < 4) {
                    getData(currentCategory, medium);
                } else if (count >= 4 && count < 6) {
                    getData(currentCategory, hard);
                } else {
                    endGame()
                }
            }, 1000);
        });
    });
}

function showAgainQuestion() {
    const selectElement = document.getElementById('categories');
    for (let i =0; i<selectElement.options.length; i++) {
        for (let j = 0; j < playedCategories.length; j++) {
            if (selectElement.options[i].value == playedCategories[j]) {
                selectElement.remove(i)
            }
        }
    }
    if (selectElement.options.length > 0) {
        questionContainer.innerText = ""
        const h1 = document.createElement('h1')
        h1.innerText = "Select new category which you want to play next within 10 Second"
        h1.style.fontSize = "2rem"
        questionContainer.appendChild(h1)
        StartGameAgainIntervalID = setInterval(() => {
            alert("Time is over! Quickly Select new category which you want to play next!");
        },10000)

    } else {
        console.error("No categories is available to select here!");
    }
}
const finalScore = document.createElement('h2');

function endGame(){
    questionContainer.innerText = ""
    if (player1Score > player2Score) {
        highScore = player1Score
    } else {
        highScore = player2Score
    }
    finalScore.innerText = `Game Over! Player 1: ${player1Score}, Player 2: ${player2Score}, High Score: ${highScore}`;
    questionContainer.appendChild(finalScore);

    const gameContinue = document.createElement('button');
    const gameEnd = document.createElement('button');
    gameContinue.innerText = "Play Again";
    gameEnd.innerText = "End Game"
    questionContainer.appendChild(gameContinue);
    questionContainer.appendChild(gameEnd);

    // game ko dobara use karne ke liye ye use kiya he 
    gameContinue.addEventListener('click', () => {
        count = 0;
        player1Score = 0;
        player2Score = 0;
        showAgainQuestion()
    })
    // game ko end karne ke liye mene ye use kiya he 
    gameEnd.addEventListener('click', () => {
        reload();
    })
       
    }

function reload() {
    window.location.reload()
}
