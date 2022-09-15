const URL = 'http://twserver.alunos.dcc.fc.up.pt:8008/'; // URL do servidor
const ourURL = 'http://twserver.alunos.dcc.fc.up.pt:9096/'

const group = 96; // Número do grupo para emparelhamento para debugging (usem o vosso)

let nick     = null; // Nick do jogador
let password = null; // Pass do jogador
let game     = null; // Id do jogo
let loggedIn = false;
let sse = null; 
let gameStarted = false;

//const nickInput = document.getElementById('nick');
const nickInput = document.getElementById('nick');
nickInput.addEventListener('change', (evt) => nick = evt.target.value);

const passwordInput = document.getElementById('password');
passwordInput.addEventListener('change', (evt) => password = evt.target.value);

const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', login);

function showMessages(message) {
  document.getElementById("roundInfo").innerHTML = message;
}

//register
function login() {
  const credentials = {nick, password};
  fetch(ourURL + 'register', {
    'method': 'POST',
		'body': JSON.stringify(credentials)
  })
  .then(response => response.json())
  .then(jsonData => {
    if('error' in jsonData) {
        showMessages(jsonData.error);
    } else {
        showMessages('Login bem-sucedido!');
        loggedIn = true;
        changeLoggedIn();
    }
  })
  .catch(error => console.log(error));
}

//join
function joinGame() {
  if(loggedIn){
    const config = {group, nick, password, size:numDeCavidadesEscolhidas, initial:numDeSementesEscolhidas};
    fetch(ourURL + 'join', {
      'method': 'POST',
      'body': JSON.stringify(config)
    })
    .then(response => response.json())
    .then(jsonData => {
      if('error' in jsonData) {
        showMessages(jsonData.error);
      } else {
          gameCreate();
          document.getElementsByClassName("cavidades")[0].style.visibility = "hidden";
          document.getElementsByClassName('armazen')[0].style.visibility = 'hidden';
          document.getElementsByClassName('armazen')[1].style.visibility = 'hidden';
          game = jsonData.game;
          StartOnlineGame();
      }
    })
    .catch(error => console.log(error));
  }
}

//start online game
function StartOnlineGame() {
  if(sse != null && sse.readyState !=2) sse.close();

  sse = new EventSource(URL + 'update?nick=' + nick+ '&game=' + game);
  sse.onmessage = receivedUpdate;
  showMessages("Esperando por adversario...");
}

//notify
function notifyRound(cav){
  const config = {nick, password, game, move: cav.cavityID};
  console.log(cav.cavityID);

  fetch(URL + 'notify', {
      'method': 'POST',
      'body': JSON.stringify(config)
    })
    .then(response => response.json())
    .then(json=>{
      console.log(json);
    })
    .catch(error => console.log(error));
}

//game functions
function receivedUpdate(msg) {
  const message = JSON.parse(msg.data);

  //starting game
  if(!gameStarted){
    console.log(message);
    document.getElementsByClassName("cavidades")[0].style.visibility = "visible";
    document.getElementsByClassName('armazen')[0].style.visibility = "visible";
    document.getElementsByClassName('armazen')[1].style.visibility = "visible";

    currentGame.gameBoard.playercavities1.cavityList.forEach(cav => {
      console.log(cav);

      var cavityHTML = document.getElementById(cav.playerID+"cavity"+cav.cavityID);
      cavityHTML.addEventListener('click',notifyRound.bind(this,cav));
    })

    showMessages("jogo iniciado");
    gameStarted = true;
  }
  
  //update game
  if('board' in message){
    const message = JSON.parse(msg.data);
    console.log(message);
    showMessages(message);

    //update message
    if('turn' in message.board){
      currentGame.currentPlayer = message.board.turn;
      showMessages("Jogada de " + currentGame.currentPlayer);
    }

    //update board
    if('pit' in message){
      const players = Object.keys(message.board.sides);
      let oponent = '';

      for(let i = 0; i < players.length; i++){
        if(nick != players.at(i)) oponent = players.at(i);
      }
      
      let i = 0;
      currentGame.gameBoard.playercavities1.cavityList.forEach(cav => {
        if(cav.seedCount > message.board.sides[nick].pits[i]){
          while(cav.seedCount > message.board.sides[nick].pits[i]){
            cav.removeSeed();
          }
        }
        else if(cav.seedCount < message.board.sides[nick].pits[i]){
          while(cav.seedCount < message.board.sides[nick].pits[i]){
            cav.addSeed();
          }
        }
        i++;
      })
      while(currentGame.gameBoard.storage1.numSeeds < message.stores[nick]){
        currentGame.gameBoard.storage1.addSeed()
      }

      i = numDeCavidadesEscolhidas-1;
      currentGame.gameBoard.playercavities2.cavityList.forEach(cav => {
        if(cav.seedCount > message.board.sides[oponent].pits[i]){
          while(cav.seedCount > message.board.sides[oponent].pits[i]){
            cav.removeSeed();
          }
        }
        else if(cav.seedCount < message.board.sides[oponent].pits[i]){
          while(cav.seedCount < message.board.sides[oponent].pits[i]){
            cav.addSeed();
          }
        }
        i--;
      })
      while(currentGame.gameBoard.storage2.numSeeds < message.stores[oponent]){
        currentGame.gameBoard.storage2.addSeed()
      }
    }
  }

  if('winner' in message){
    showMessages(message.winner + " ganhou o jogo!");
      currentGame = null;
      document.getElementById("boardPlace").innerHTML= "";
      gamebuttonBegin();
      gameStarted = false;
  }

}

function leaveGame(){
    const config = {nick, password, game};
    fetch(URL + 'leave', {
      'method': 'POST',
          'body': JSON.stringify(config)
    })
    .then(response => response.json())
    .then(jsonData => {
      if('error' in jsonData) {
        showMessages(jsonData.error);
      } else {
        currentGame = null;
        document.getElementById("boardPlace").innerHTML= "";
        gamebuttonBegin();
        gameStarted = false;
      }
    })
    .catch(error => console.log(error));
  }

//ranking  
function getRankings(){

    const ranking_url = ourURL + "ranking";
    const data = {};
    
    fetch(ranking_url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {

        console.log('Success:', data);
        // console.log(data.ranking[0].games);
        var rankingTable = document.createElement("table");
        rankingTable.className = "rankingTable";

        let tab = 
          `<tr>
            <th>Nick</th>
            <th>Victories</th>
            <th>Games</th>
          </tr>`;

          for (let r of data.ranking) {
            tab += `<tr> 
              <td>${r.nick} </td>
              <td>${r.victories}</td>
              <td>${r.games}</td>          
              </tr>`;
        }

        rankingTable.innerHTML = tab;
        document.getElementById("rankingShow").innerHTML = "";
        document.getElementById("rankingShow").appendChild(rankingTable);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}