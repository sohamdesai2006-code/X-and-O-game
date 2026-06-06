console.log("Hello Baccho....\n\n");
let boxes = document.querySelectorAll(".box");
let reset_btn = document.querySelector("#reset_btn");
let newGameBtn = document.querySelector("#new_btn");
let msgContainer =document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let msgHomeBtn = document.querySelector("#msg_home_btn");

let modeSelection = document.querySelector("#mode-selection");
let gameScreen = document.querySelector("#game-screen");
let btn2Player = document.querySelector("#btn_2player");
let btnComputer = document.querySelector("#btn_computer");
let homeBtn = document.querySelector("#home_btn");
let btnNormal = document.querySelector("#btn_normal");
let btnHard = document.querySelector("#btn_hard");
let difficultyPanel = document.querySelector("#difficulty-panel");
let firstMovePanel = document.querySelector("#first-move-panel");
let btnStartO = document.querySelector("#btn_start_o");
let btnStartX = document.querySelector("#btn_start_x");

let turnO = true; // playerO & playerX
let count =0; // to track draw
let isVsComputer = false;
let isHardMode = false;
let playerSymbol = "O";

// let arr = ["apple","banana","litchi"];
// // 2d array
// let arr2 = [["apple","litchi"],["potato","mushroom"],["pants","shirts"]];
// console.log(arr2);
// console.log(arr2[0][1]);// litchi

// pattens : [0,1,2] [3,4,5] [6,7,8] [0,3,6] [1,4,7]       [2,5,8] [0,4,8] [2,4,6]
const winPatterns = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8]
];

const resetGame = () => {
    // Determine who starts based on the active button
    turnO = btnStartO.classList.contains("active");
    playerSymbol = turnO ? "O" : "X";
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
    
    if (isVsComputer) {
        difficultyPanel.classList.remove("hide");
        firstMovePanel.classList.remove("hide");
    } else {
        firstMovePanel.classList.remove("hide");
    }
};

boxes.forEach((box) => {   // remember forEach(val,idx,arr)
    box.addEventListener("click", () => {
     if (isVsComputer) {
         let isPlayerTurn = (playerSymbol === "O" && turnO) || (playerSymbol === "X" && !turnO);
         if (!isPlayerTurn) return;
     }

     if(turnO){
        // playerO
        box.innerHTML="<p style ='color: blue;'>O</p>";
        turnO=false;
     } else{
        //playerX
        box.innerText="X";
        turnO=true;
     }
     box.disabled =true;
     count++;
     
     // Hide side panels on first move
     if (isVsComputer) {
         difficultyPanel.classList.add("hide");
         firstMovePanel.classList.add("hide");
     } else {
         firstMovePanel.classList.add("hide");
     }

     let isWinner = checkWinner();
     
     if(count===9 && !isWinner){
        gameDraw();
     }

     if (isVsComputer) {
         let isComputerTurn = (playerSymbol === "O" && !turnO) || (playerSymbol === "X" && turnO);
         if (isComputerTurn && !isWinner && count < 9) {
             setTimeout(computerMove, 500);
         }
     }
    });
});

const computerMove = () => {
    let emptyBoxes = [];
    for(let i = 0; i < boxes.length; i++) {
        if(boxes[i].innerText === "") {
            emptyBoxes.push(boxes[i]);
        }
    }
    
    if(emptyBoxes.length > 0) {
        let selectedBox = null;
        let computerSymbol = (playerSymbol === "O") ? "X" : "O";

        if (isHardMode) {
            // 1. Try to win
            selectedBox = findBestMove(computerSymbol);
            // 2. Try to block player
            if (!selectedBox) selectedBox = findBestMove(playerSymbol);
            // 3. Take center if available
            if (!selectedBox && boxes[4].innerText === "") selectedBox = boxes[4];
        }

        // Fallback to random if normal mode or no strategic move found
        if (!selectedBox) {
            let randomIdx = Math.floor(Math.random() * emptyBoxes.length);
            selectedBox = emptyBoxes[randomIdx];
        }
        
        if (computerSymbol === "O") {
            selectedBox.innerHTML = "<p style ='color: blue;'>O</p>";
            turnO = false;
        } else {
            selectedBox.innerText = "X";
            turnO = true;
        }
        
        selectedBox.disabled = true;
        count++;
        
        let isWinner = checkWinner();
        if(count === 9 && !isWinner){
            gameDraw();
        }
    }
};

const findBestMove = (playerText) => {
    for(let pattern of winPatterns){
        let pos1 = boxes[pattern[0]];
        let pos2 = boxes[pattern[1]];
        let pos3 = boxes[pattern[2]];
        
        // Count how many times the playerText appears in this winning pattern
        let vals = [pos1.innerText, pos2.innerText, pos3.innerText];
        let playerCount = vals.filter(v => v === playerText).length;
        let emptyCount = vals.filter(v => v === "").length;
        
        // If there are 2 of the same symbol and 1 empty spot, it's a winning/blocking move!
        if (playerCount === 2 && emptyCount === 1) {
            if (pos1.innerText === "") return pos1;
            if (pos2.innerText === "") return pos2;
            if (pos3.innerText === "") return pos3;
        }
    }
    return null;
};

const gameDraw = () => {
    msg.innerText ="Game was a Draw.";
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const disableBoxes = () => {
    for(let box of boxes){
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for(let box of boxes){
        box.disabled=false;
        box.innerText="";
    }
}; 

const showWinner = (winner) => {
    msg.innerText=`Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const checkWinner = () => {
    for(let pattern of winPatterns){
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if(pos1Val !=="" && pos2Val !=="" && pos3Val !==""){
            if(pos1Val===pos2Val && pos2Val===pos3Val){
                showWinner(pos1Val);
                return true;
            }
        }
    }
};

newGameBtn.addEventListener("click",resetGame);
reset_btn.addEventListener("click",resetGame);

btn2Player.addEventListener("click", () => {
    isVsComputer = false;
    btnStartO.innerText = "Player O";
    btnStartX.innerText = "Player X";
    modeSelection.classList.add("hide");
    gameScreen.classList.remove("hide");
    difficultyPanel.classList.add("hide");
    firstMovePanel.classList.remove("hide");
    resetGame();
});

btnComputer.addEventListener("click", () => {
    isVsComputer = true;
    btnStartO.innerText = "Play as O";
    btnStartX.innerText = "Play as X";
    modeSelection.classList.add("hide");
    gameScreen.classList.remove("hide");
    difficultyPanel.classList.remove("hide");
    firstMovePanel.classList.remove("hide");
    resetGame();
});

homeBtn.addEventListener("click", () => {
    gameScreen.classList.add("hide");
    modeSelection.classList.remove("hide");
});

msgHomeBtn.addEventListener("click", () => {
    gameScreen.classList.add("hide");
    msgContainer.classList.add("hide");
    modeSelection.classList.remove("hide");
});

btnNormal.addEventListener("click", () => {
    isHardMode = false;
    btnNormal.classList.add("active");
    btnHard.classList.remove("active");
});

btnHard.addEventListener("click", () => {
    isHardMode = true;
    btnHard.classList.add("active");
    btnNormal.classList.remove("active");
});

btnStartO.addEventListener("click", () => {
    turnO = true;
    playerSymbol = "O";
    btnStartO.classList.add("active");
    btnStartX.classList.remove("active");
});

btnStartX.addEventListener("click", () => {
    turnO = false;
    playerSymbol = "X";
    btnStartX.classList.add("active");
    btnStartO.classList.remove("active");
});