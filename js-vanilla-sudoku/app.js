const easy = [
  "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
  "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
  "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
  "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
  "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
  "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

//vars
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;

window.onload = function (){
    //run startgame fucntion when button is clicked
    id("start-btn").addEventListener("click",startGame);
    //add event listner to everynumber
    for (let i = 0; i < id("number-container").children.length; i++){
        id("number-container").children[i].addEventListener("click",function(){
            if(!disableSelect){
                //if num is already selected
                if(this.classList.contains("selected")){
                    this.classList.remove("selected");
                    selectedNum = null;
                }else{
                    for(let i = 0; i < 9; i++){
                        id("number-container").children[i].classList.remove("selected");
                    }
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        })
    }
}

function startGame(){
    //choose difficulty
    if (id("diff-1").checked) board = easy[0];
    else if (id("diff-2").checked) board = medium[0];
    else board = hard[0];
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Lives Remaining: 3";
    //create board based on difficulty
    generateBoard(board);
    startTimer();
    //set theme
    if(id("theme-1").checked){
        qs("body").classList.remove("dark");
    }else{
        qs("body").classList.add("dark");
    }
    //show number container
    id("number-container").classList.remove('hidden');
}

function startTimer(){
    //set time remaining based on input
    if(id("time-1").checked) timeRemaining = 180;
    else if(id("time-2").checked) timeRemaining = 300;
    else timeRemaining = 600;
    //set timer for first second
    id("timer").textContent = timerConversion(timeRemaining);
    timer = setInterval(function(){
        timeRemaining --;
        //if no time remaining
        if (timeRemaining == 0) endGame();
        id("timer").textContent = timerConversion(timeRemaining);
    }, 1000);    
}

function timerConversion(time){
    let minutes = Math.floor(time / 60);
    if(minutes < 10) mintues = "0" + minutes;
    let seconds = time % 60;
    if(seconds < 10) seconds = "0" + seconds;
    return minutes + ": "+ seconds;
}
function generateBoard(board){
    //clear previous board
    clearPrevious();
    //let used to increment tile ids
    let idCount = 0;
    //Create 81 tiles
    for(let i = 0; i < 81; i++){
        //create a new paragraph element
        let tile = document.createElement("p");
        if(board.charAt(i) != "-"){
            //set tile text to correct num
            tile.textContent = board.charAt(i);
        }else{
            //add click even listner to tile
            tile.addEventListener("click",function(){
                //if selecting is not disabled
                if(!disableSelect){
                    if(tile.classList.contains("selected")){
                        //remove selection
                        tile.classList.remove("selected");
                        selectedTile = null;
                    }else{
                        for (let i = 0; i < 81; i++){
                            qsa(".tile")[i].classList.remove("selected")
                        }
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            });
        }
        //assign tile id
        tile.id = idCount;
        idCount ++;
        tile.classList.add("tile");
        if((tile.id > 17 && tile.id < 27) || (tile.id > 44 & tile.id < 54)){
            tile.classList.add("bottomBorder");
        }
        if((tile.id + 1)%9 == 3 || (tile.id + 1)%9 == 6 ){
            tile.classList.add("rightBorder");
        }
        id("board").appendChild(tile);
    }
}

function updateMove(){
    //tile and number both selected
    if(selectedTile && selectedNum){
        //set the tile to the correct num
        selectedTile.textContent = selectedNum.textContent;
        //if the num mathces the answer 
        if(checkCorrect(selectedTile)){
            //deselects the tile
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            //clear selected variable
            selectedNum = null;
            selectedTile = null;
            //check if board is completed
            if (checkDone()){
                endGame();
            }
            //If no matching the solution key
        }else{
            //disable selecteing new nums for one second
            disableSelect = true;
            selectedTile.classList.add("incorrect");
            setTimeout(function(){
                //subtract lives by one
                lives --
                // if no lives left end the game
                if (lives === 0){
                    endGame();
                }else{
                    //update lives text
                    id("lives").textContent = "Lives Remaining: " + lives;
                    //renable selecting nums
                    disableSelect = false;
                }
                //restore tile color
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                selectedTile.textContent = "";
                selectedNum = null;
                selectedTile = null;
            },1000);
        }
    }
}

function checkDone(){
    let tiles = qsa(".tile");
    for(let i = 0; i < tiles.length; i++){
        if(tiles[i].textContent === "")return false;
    }
    return true;
}

function endGame(){
    //disable move and timer
    disableSelect = true;
    clearTimeout(timer);
    if(lives === 0 || timeRemaining === 0){
        id("lives").textContent = "End of the game";
    }else{
        id("lives").textContent = "You won";
    }
}

function checkCorrect(tile){
    //set solutiopns based on difficulty
    if (id("diff-1").checked) solution = easy[1];
    else if(id("diff-2").checked) solution = medium[1];
    else solution = hard[1];
    //if tile's num is equal to solution's num
    if(solution.charAt(tile.id)===tile.textContent) return true;
    else return false;
}
function clearPrevious(){
    let tiles = qsa(".tile");
    //remove each tile
    for (let i = 0; i < tiles.length; i++){
        tiles[i].remove();
    }
    if(timer) clearTimeout(timer);
    //deselect any numbers
    for (let i =0; i < id("number-container").children.length; i++){
        id("number-container").children[i].classList.remove("selected");

    }
    //Clear selected variables
    selectedTile = null;
    selectedNum = null;
}

//Helper functions

function id(id){
    return document.getElementById(id);
}

function qs(selector){
    return document.querySelector(selector);
}

function qsa(selector){
    return document.querySelectorAll(selector);
}