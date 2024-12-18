let player1Name = "";
let player2Name = "";
let dummyScore=[10,10,15,15,20,20];
let player1Score = 0;
let player2Score = 0;
let count=0;
let usedCategories= [];
let currentCategory=[];
let questionSet = [];

async function Data(category) {
    try {
        const response = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}`);
        const data = await response.json();
        currentCategory = category;
        usedCategories.push(category);
        displayData(data);
    } catch (error) {
        console.error("failed to fetch questions:", error);
    }
}

// form submission
const submitBtn = document.querySelector(".player-info");
const categorySelector = document.getElementById("category-info");

submitBtn.addEventListener("submit", (event) => {
    event.preventDefault();
    player1Name = document.getElementById('player1').value;
    player2Name = document.getElementById('player2').value;

    const playersName = document.createElement("h2");
    playersName.innerHTML = `Player 1 : ${player1Name} VS Player 2: ${player2Name}`;
    document.querySelector("#heading").appendChild(playersName);

    submitBtn.style.display = "none";
    categorySelector.style.display = "block";
});

//categories selection 

const categorySelect = document.getElementById("categories");
categorySelect.addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    Data(selectedCategory);
    // console.log("category selected", selectedCategory)
    categorySelector.style.display = "none";
});

const questionContainer = document.getElementById("question-container");

function displayData (data) {
    displayQuestion(data);
}

function displayQuestion(data) {
    
    questionContainer.innerHTML = "";
    if (count >= 6) {
        const playAgainBtn = document.createElement('button');
        const exitGameBtn = document.createElement('button');
        playAgainBtn.innerHTML = "Play Again";
        exitGameBtn.innerHTML = "Exit Game";

        playAgainBtn.addEventListener('click', (event) => {
            restartGame();
        });

        exitGameBtn.addEventListener('click', () => {
            const result = document.createElement("h2");
            result.innerHTML = `Game Over ! Player 1: ${player1Score}, Player 2 : ${player2Score}.
             ${ player1Score == player2Score ? "Tie , Both player scores the same marks!" : player1Score > player2Score ? player1Name + "wins!" : player2Name + "wins!" }`
            questionContainer.innerHTML = "";
            questionContainer.appendChild(result);
        });
       questionContainer.appendChild(playAgainBtn);
       questionContainer.appendChild(exitGameBtn);
        return;
    }

// players turn
const playersTurn = document.createElement('h2') 
playersTurn.innerText = count % 2 == 0 ? `Its ${player1Name}'s turn!` : `Its ${player2Name}'s turn!`;
questionContainer.appendChild(playersTurn);


const difficulty = count < 2? "easy" : count < 4 ? "medium" : "hard";
 
const questionData = data.find((question) => {
    return question.difficulty === difficulty && !questionSet.includes(question.question.text);
});

if(!questionData) {
    Data(currentCategory) ;
    
}

questionSet.push(questionData.question.text);

//display question
const questionText = document.createElement('h2');
questionText.innerText = `Question ${count + 1}: ${questionData.question.text}`;
questionContainer.appendChild(questionText);

const options = [...questionData.incorrectAnswers , questionData.correctAnswer].sort( () => Math.random() - 0.5);
const optionList = document.createElement('ol');

options.forEach((option) => {
    const listItem = document.createElement("li");
    listItem.innerText = option;
    listItem.classList.add("option");

    listItem.addEventListener("click", () => {
        handleAnswer(option === questionData.correctAnswer);
    });
    optionList.appendChild(listItem);
});

questionContainer.appendChild(optionList);

}  

function handleAnswer(isCorrect) {
    const result = document.createElement("h2");
    //const currentPlayer = count % 2 === 0 ? "Player 1:" : "player 2";
    // const currentPlayer = count % 2 === 0 ? "Player 1" : "player 2";

    if(isCorrect) {
        result.innerText = `Correct Answer! :)`;
        if (count % 2 === 0) {
        player1Score += dummyScore[count];
        } else {
            player2Score += dummyScore[count];
        }
    } else {
        result.innerText = `Incorrect Answer :(`
    }

    questionContainer.appendChild(result);

    count++;
    setTimeout( () => {
        Data(currentCategory)
    },1000);
}

function restartGame () {
    count=0;
    player1Score =0;
    player2Score = 0;
    questionSet = [];
    categorySelector.style.display = "block";
    questionContainer.innerHTML = "";
}

