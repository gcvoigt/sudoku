
var filledBoard = []; // a 9x9 array that will contain solved board 
var numToFill = []; // it will just store shufflered 1 to 9
var checkWinner = []; // an array to store correct answers from user and check if win the game

/*difficulty levels */
const easy = 38;
const medium = 32;
const hard = 22;
const vhard = 12;

var levelAtNow = medium; //store level

// about timer things

var hour = 0;
var minute = 0;
var seconds = 0;
var totalSeconds = 0;


// some initial stuffs to do

document.addEventListener("DOMContentLoaded",function(){

    runningTimer = null;

    initialNumbers(levelAtNow);

    // difficulty selector

    [...document.querySelectorAll('.button')].forEach(function(item) {
        item.addEventListener('click', function() {

            stopTimer();

            // calls fill initial numbers function depending level chosen
            switch(item.id){
                case 'easy':
                    levelAtNow = easy;
                    initialNumbers(levelAtNow);
                    break;
                case 'medium':
                    levelAtNow = medium;
                    initialNumbers(levelAtNow);
                    break;
                case 'hard':
                    levelAtNow = hard;
                    initialNumbers(levelAtNow);
                    break;
                case 'vhard':
                    levelAtNow = vhard;
                    initialNumbers(levelAtNow);
                    break;
                case 'giveup':
                    console.log('give up');
                    break;
                default:
                    console.log('defaut');
            }

          
        });
    });

});

// this function fill board with initial numbers

function initialNumbers(level){


    // clean board before input new numbers
    
    cleanBoard();

    //fill an array with 1 to 9 numbers

    for(let n = 1; n <= 9; n++) numToFill[n - 1] = n;


    //shuffle numbers

    shuffle(numToFill);


    /* fill an array 9x9, first line filled with shufflered numbers
    to keep board most shufflered */

    for(let x = 0; x < 9; x++){
        filledBoard[x] = [];
        checkWinner[x] = [];
        for(let y = 0; y < 9; y++){
            if(x == 0){
                filledBoard[x][y] = ""+numToFill[y];
            }else{
                filledBoard[x][y] = '.';
            }
            checkWinner[x][y] = "e";
        }
    }

    // solve the board

    autoSolver(filledBoard);

    //console.table(filledBoard);
    
    // get some random numbers to position that amount of numbers in the board

    var arrPositions =[];

    for(let k = 0; k < level; k++){
        let randomNumber = Math.floor(Math.random() * 80);

        // avoid repeted numbers
        while(arrPositions.includes(randomNumber)){
            randomNumber = Math.floor(Math.random() * 80);
        }
        arrPositions[k] = randomNumber;
    }

    // sort random position numbers previously gotten

    arrPositions.sort((a, b) => a - b);


    // take the inputs from board

    var listCells = document.querySelector('.board').childNodes;
    var listArray = Array.from(listCells);


    // fill board with initial numbers

    for(let w = 0; w < 81; w++){

        if(arrPositions.includes(w)){

            let target = document.getElementById(listArray[w].id).firstChild.id;
            let num = filledBoard[parseInt(target.charAt(1))][parseInt(target.charAt(0))];
            checkWinner[parseInt(target.charAt(1))][parseInt(target.charAt(0))] = "c";
            document.getElementById(target).value = num;

            //avoid editing filled cell
            document.getElementById(target).setAttribute('readonly','readonly');
        }
    }

    //starts to count the time

    runningTimer = setInterval(startTimer, 1000);
}

// function to clear the board

function cleanBoard(){
    [...document.querySelectorAll('.cell')].forEach(function(item) {
        let id = item.firstChild.id;

        document.getElementById(id).value = '';
        document.getElementById(id).removeAttribute('readonly');
        //console.log(id);
    });
}


// this function detach x / y axes lines and 3 x 3 area of a focused cell

function lightCells(celula){
    let cell = document.getElementById(celula);
    let cellClass = cell.className.substr(17,2);
    let x = celula.charAt(1);
    let y = celula.charAt(2);


    for(let r = 0; r < 9; r++){
        for(let c = 0; c < 9; c++){
            let thisCell = document.getElementById("d"+r+c);
            let thisCellClass = thisCell.className.substr(17,2);
            thisCell.classList.remove("detach");
            thisCell.classList.remove("cell-detach");
            if((r == x) || (c == y)) thisCell.classList.add("detach");
            if(cellClass == thisCellClass) thisCell.classList.add("detach");
        }
    }

    cell.classList.add("cell-detach");
}

/* this funtion check if the inputed number already exists in x / y axes lines and
in 3 x 3 area */

function checkNumber(input){
    let inputNum = document.getElementById(input);
    let inputParent = document.getElementById(input).parentElement.className.substr(17,2);
    let num = inputNum.value;
    
    let x = input.charAt(0);
    let y = input.charAt(1);
    let arr = [];

    // put all numbers in x / y axes and 3 x 3 area in an array

    for(let r = 0; r < 9; r++){
        for(let c = 0; c < 9; c++){

            let valueCell = document.getElementById(""+r+c).value;

            let divParent = document.getElementById(""+r+c).parentElement.className.substr(17,2);
            
            if(((r == x) || (c == y) || (inputParent == divParent)) && ((""+r+c) != input)){
                if(valueCell != "") arr.push(valueCell);
            }
        }
    }

    // if inputed number is invalid, shows it in red color

    if(arr.includes(num)) {
        inputNum.style.color = "#f5426f"
        checkWinner[y][x] = "e";
    }else{
        inputNum.style.color = "#5c2094"
        checkWinner[y][x] = "c";
        haveWeAWinner();
    }
}

// generic function to check if there are 'e' in array

function exists(arr, search) {
    return arr.some(row => row.includes(search));
}

// check if win the board

function haveWeAWinner(){
   
    if(exists(checkWinner,'e')){
        return false;
    }else{
        weHaveAWinner();
        return true;
    }
}

// shows up message for the winner

function weHaveAWinner(){

    //stops timer
    stopTimer();

    //select message
    var message;
    switch(levelAtNow){
        case easy:
            //levelAtNow = easy;
            message = 'You did it!! At easy level at least...';
            break;
        case medium:
            //levelAtNow = medium;
            message = 'You did it!! You rocks!';
            break;
        case hard:
            levelAtNow = hard;
            message = 'You did it!! We have a big brain here.';
            break;
        case vhard:
            levelAtNow = vhard;
            message = "I can't belive! You are freak...";
            break;
        default:
            console.log('defaut');
    }

    document.getElementById('levelMessage').innerHTML = message;

    document.getElementById('result').style.display = 'grid';
    document.getElementById('result-bg').style.display = 'block';
}

//close winner message

function closeMessage(){
    document.getElementById('result').style.display = 'none';
    document.getElementById('result-bg').style.display = 'none';
}

// function to count the time

function startTimer() {
    ++totalSeconds;
    hour = Math.floor(totalSeconds /3600);
    minute = Math.floor((totalSeconds - hour*3600)/60);
    seconds = totalSeconds - (hour*3600 + minute*60);

    document.getElementById("hour").innerHTML =pad(hour);
    document.getElementById("minutes").innerHTML =pad(minute);
    document.getElementById("seconds").innerHTML =pad(seconds);
  }

// add 0 to the left of timer numbers
function pad(val){ return val > 9 ? val : "0" + val;}

// stops timer
function stopTimer(){
    if (runningTimer){
        clearInterval(runningTimer);
        totalSeconds = 0;
    }
}

// shuffle arrays function

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function isValid(board, row, col, k) {
    for (let i = 0; i < 9; i++) {
        const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const n = 3 * Math.floor(col / 3) + i % 3;
        if (board[row][i] == k || board[i][col] == k || board[m][n] == k) {
          return false;
        }
    }
    return true;
}


function autoSolver(data) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (data[i][j] == '.') {
        for (let k = 1; k <= 9; k++) {
          if (isValid(data, i, j, k)) {
            data[i][j] = `${k}`;
          if (autoSolver(data)) {
           return true;
          } else {
           data[i][j] = '.';
          }
         }
       }
       return false;
     }
   }
 }
 return true;
}

