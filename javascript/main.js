//variables to get player selections
let numDeCavidadesEscolhidas = 6;
let numDeSementesEscolhidas = 4;
let oponent = "computer";
let gameStarter = "player1";
let gameDifficulty = "easy";

//functions to get the information the player have selected (it is done at selection, dont need confirmation)
function changeCavidadeNum() {
    numDeCavidadesEscolhidas = document.getElementById("select_cavidades").value;
}

function changeSementeNum() {
    numDeSementesEscolhidas = document.getElementById("select_sementes").value;
}

function changeOponent(input){
    oponent = input.value;
}

function changeBegin(input){
    if(input.value == 1){
        gameStarter = "player1";
    }
    else{
        gameStarter = oponent;
    }
}

function changeDifficulty(input){
    gameDifficulty = input.value;
}

//function to show game page
function shownPage(pagina) {
    switch (pagina) {
        case 1:
            document.getElementById("jogo").style.display = "flex";
            document.getElementById("instructions").style.display = "none";
            document.getElementById("config").style.display = "none";
            document.getElementById("classification").style.display = "none";
            break;
        case 2:
            document.getElementById("jogo").style.display = "none";
            document.getElementById("instructions").style.display = "flex";
            document.getElementById("config").style.display = "none";
            document.getElementById("classification").style.display = "none";
            break;
        case 3:
            document.getElementById("jogo").style.display = "none";
            document.getElementById("instructions").style.display = "none";
            document.getElementById("config").style.display = "flex";
            document.getElementById("classification").style.display = "none";
            break;
        case 4:
            document.getElementById("jogo").style.display = "none";
            document.getElementById("instructions").style.display = "none";
            document.getElementById("config").style.display = "none";
            document.getElementById("classification").style.display = "flex";
            break;
        default:
            break;
    }
    return;
}

function changeLoggedIn(){
    console.log("hello");
    var title = document.createElement("p");
    title.innerHTML = "Bem vindo, " + nick +'!';
    var button = document.createElement('input');
    button.type = "submit";
    button.id = "loginButton";
    button.className="login_button_it";
    button.style.backgroundColor = "rgb(255,71,71)";
    button.value = "Logout";
    button.onclick = function(){window.location.reload();}

    document.getElementById("loginSpace").innerHTML = "";
    document.getElementById("loginSpace").appendChild(title);
    document.getElementById("loginSpace").appendChild(button);
}

//function to place the bean in random place
function randomNumber(min, max) { 
    return Math.random() * (max - min) + min;
}

function startGame(){

    if(oponent == "computer"){
        gameCreate();
    }
    else if(!loggedIn){
        document.getElementById("roundInfo").innerHTML = "Tens de estar logado para jogar online.";
    }
    else if(loggedIn){
        this.joinGame();
    }
}

var currentGame;

function gameCreate(){
    var computerGame = false;
    if(oponent == "computer"){computerGame=true;}
    if(loggedIn){
        if(gameStarter == "player1") gameStarter = nick;
        currentGame = new Game(gameStarter,numDeCavidadesEscolhidas,numDeSementesEscolhidas,nick,oponent,gameDifficulty,computerGame);
    }
    else{
        if(gameStarter=="player1") {gameStarter="player";}
        currentGame = new Game(gameStarter,numDeCavidadesEscolhidas,numDeSementesEscolhidas,"player",oponent,gameDifficulty,computerGame);
    }
    if(computerGame){
        document.getElementById("roundInfo").innerHTML = "Jogada do jogador "+ currentGame.currentPlayer;
        document.getElementById('roundInfo').style.color = "black";
    }

    var buttonChange = document.getElementById("game_button_it");
    buttonChange.style.backgroundColor = "rgb(255,71,71)";
    buttonChange.value = "Desistir";
    if(computerGame==true){
        console.log("hello");
        buttonChange.setAttribute('onclick','currentGame.gameEnd(0,true)');
    }
    else{
        buttonChange.setAttribute('onclick','leaveGame()');
    }
}

function gamebuttonBegin(){
    currentGame = null;
    document.getElementById("boardPlace").innerHTML= "";
        var buttonChange = document.getElementById("game_button_it");
        buttonChange.style.backgroundColor = "rgb(110, 206, 110)";
        buttonChange.value = "Começar Jogo";
        buttonChange.setAttribute('onclick','startGame()');
        if(oponent=="computer"){
        document.getElementById("roundInfo").innerHTML = "Não há um jogo ativo!";
        }
}