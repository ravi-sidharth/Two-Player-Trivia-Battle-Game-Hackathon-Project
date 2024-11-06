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
let winner = ""

async function getData(category, difficulties) {
    const res = await fetch(`https://the-trivia-api.com/v2/questions?limit=1&categories=${category}&difficulties=${difficulties}`);
    const data = await res.json();
    currentCategory = category
    playedCategories.push(category);
    showQuestion(data);
}
const categorySelector = document.getElementById('category-select');
const formSubmitBtn = document.querySelector('#player-form')
formSubmitBtn.addEventListener('submit', (event) => {
    event.preventDefault();
    player1Name = document.querySelector('#player1').value;
    player2Name = document.querySelector('#player2').value;
    const playersName = document.createElement('p')
    playersName.className="text-xl text-white"
    playersName.innerHTML = `Player 1:${player1Name} Vs Player 2:${player2Name}`
    document.querySelector('#title').appendChild(playersName)

    formSubmitBtn.className = "hidden";
    categorySelector.className = "block";
});

const categorySelect = document.getElementById('categories');
categorySelect.addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    if (StartGameAgainIntervalID) {
        clearInterval(StartGameAgainIntervalID);
    }
    getData(selectedCategory, easy);
    categorySelector.className = "hidden";
});

const questionContainer = document.getElementById('question-container');
function showQuestion(data) {
    questionContainer.innerHTML = "";
    const player = document.createElement('h2')
    player.className = "text-2xl text-yellow-300 font-bold";
    
    if (count % 2 == 0) {
        player.innerText = `It's ${player1Name} your turn please select the correct answer.`
        questionContainer.prepend(player);
    }
    else {
        player.innerText = `It's ${player2Name} your turn please select the correct answer.`
        questionContainer.prepend(player);
    }

    const questionText = document.createElement('h2');
    questionText.className="text-2xl font-bold"
    questionText.innerHTML = `Question No ${count + 1}: ${data[0].question.text}`;
    questionContainer.appendChild(questionText);

    //For question option and suffling
    const options = [...data[0].incorrectAnswers, data[0].correctAnswer].sort(() => Math.random() - 0.5);
    const optionList = document.createElement('ol');
    let optionNumber =1
    options.forEach(option => {
        const list = document.createElement('li')
        list.innerHTML =` ${optionNumber}- ${option}`;
        
        optionNumber+=1
        optionList.appendChild(list);
        questionContainer.appendChild(optionList)

        // addEvent listener in option option is right or worng
        list.classList.add("hover:bg-blue-400", "mb-2","mt-2")
        list.addEventListener('click',()=> {
            if (count % 2 == 0) {
                if (option == data[0].correctAnswer) {
                    player1Score += dummyScore[count]
                    player.innerText = `Weldone your Answer is correct and now your score is ${player1Score}`;
                    player.classList.add("text-4xl", "font-bold", "text-green-400")
                    list.classList.add = ("text-2xl", "font-bold", "text-green-400")

                } else {
                    player.innerText =`Your answer is incorrect and correct answer is ${data[0].correctAnswer}`;
                    player.classList.add("text-4xl", "font-bold" ,"text-red-400")
                    list.classList.add("text-2xl", "font-bold" ,"text-red-400")
                    
                }
            } else {
                if (option == data[0].correctAnswer) {
                    player2Score += dummyScore[count]
                    player.innerText = `Weldone your Answer is correct and now your score is ${player2Score}`;
                    player.classList.add("text-4xl", "font-bold", "text-green-400")
                    list.classList.add("text-2xl", "font-bold", "text-green-400")

                } else {
                    player.innerText = `Your answer is incorrect and correct answer is ${data[0].correctAnswer}`;
                    player.classList.add("text-4xl", "font-bold" ,"text-red-400")
                    list.classList.add("text-2xl", "font-bold" ,"text-red-400")
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
            }, 2000);
        });
    });
}

const finalScore = document.createElement('h2');
function endGame() {
    questionContainer.innerText = ""
    if (player1Score > player2Score) {
        highScore = player1Score
        winner = player1Name
    } else if (player1Score==player2Score) {
        winner="No one, Because both score is same.Tied the game!"
    }
    else {
        highScore = player2Score
        winner = player2Name
    }
    finalScore.innerText = `Game Over! Player 1: ${player1Score}, Player 2: ${player2Score}, High Score: ${highScore} and Winner is ${winner}`;
    questionContainer.appendChild(finalScore);

    const gameContinue = document.createElement('button');
    const gameEnd = document.createElement('button');
    gameContinue.innerText = "Play Again";
    gameContinue.className ="border-2 border-black px-2 bg-green-400 rounded-lg"
    gameEnd.className = "border-2 border-black px-2 bg-rose-400 rounded-lg ml-2"
    gameEnd.innerText = "End Game"
    questionContainer.appendChild(gameContinue);
    questionContainer.appendChild(gameEnd);

    // if user wants to play again then he can play
    gameContinue.addEventListener('click', () => {
        categorySelector.style.display = "block";
        count = 0;
        player1Score = 0;
        player2Score = 0;
        winner = ""
        showAgainQuestion()
    })
    // user wants to end the game 
    gameEnd.addEventListener('click', () => {
        reload();
    })
}

function showAgainQuestion() {
    const selectElement = document.getElementById('categories');
    for (let i = 0; i < selectElement.options.length; i++) {
        for (let j = 0; j < playedCategories.length; j++) {
            if (selectElement.options[i].value == playedCategories[j]) {
                selectElement.remove(i)
            }
        }
    }

    if (selectElement.options.length > 1) {
        questionContainer.innerText = ""
        const h1 = document.createElement('h1')
        h1.innerText = "Select new category which you want to play next within 10 Second"
        h1.className= "text-4xl"
        questionContainer.appendChild(h1)
        StartGameAgainIntervalID = setInterval(() => {
            alert("Time is over!Please Select new category which you want to play next!");
        }, 10000)

    } else {
        alert("You already played all category option!, There is no more category to play this game");
        setTimeout(() => {
            alert("You have completed all the level")
            reload()
        }, 4000)
    }
}

function reload() {
    window.location.reload()
}
