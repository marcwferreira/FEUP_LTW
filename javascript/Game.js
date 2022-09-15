class Game{
    constructor(starterPlayer, numCavities, numSeeds, player, oponent, difficulty, computerGame) {
        this.player1 = player;
        this.player2 = oponent;
        this.computerGame = computerGame;
        this.difficulty = difficulty;
        this.currentPlayer = starterPlayer;
        this.numCavitiesChosen = numCavities;
        this.numSeedsChosen = numSeeds;
        this.gameEnded = false;
        this.gameBoard = new Board(this.player1,this.player2,this.numCavitiesChosen,this.numSeedsChosen);

        console.log(starterPlayer);
        console.log(this.player2);
        console.log(this.computerGame);
        if(starterPlayer == this.player2 && this.computerGame){
            console.log(starterPlayer);
            console.log(this.computerGame);
            this.computerMove();
        }

    }

    //check if move if valid, if it is call function to move
    validMove(cavitySelectedID, playerClicked){

        var cavitySelected;
        if(this.computerGame && this.currentPlayer == this.player2){
            cavitySelected = cavitySelectedID;
        }
        else{     
            cavitySelected = this.gameBoard.getCavity(cavitySelectedID.id);
        }


        if(playerClicked != this.currentPlayer){
            document.getElementById("roundInfo").innerHTML = "Jogada do jogador "+this.currentPlayer;
            document.getElementById('roundInfo').style.color = "red";
        }
        else if(playerClicked != cavitySelected.playerID){
            
            document.getElementById("roundInfo").innerHTML = "Jogada do jogador "+this.currentPlayer+" - Só podes escolher das tuas cavidades";
            document.getElementById('roundInfo').style.color = "red";
        }
        else if(cavitySelected.seedCount == 0){
            document.getElementById("roundInfo").innerHTML = "Jogada do jogador "+this.currentPlayer+" - Escolha uma cavidade que não esteja vazia!";
            document.getElementById('roundInfo').style.color = "red";
        }
        else{
            var landingPlace = this.playerMovement(playerClicked,cavitySelected); //realize the movement and return the place the last seed went into

            this.checkEmptyLanding(playerClicked, landingPlace);

            this.checkGameEnd();

            //move to next round if game is not finished
            if(!this.gameEnded){
                if(landingPlace.cavityID != "Storage"){ //if landinPlace is storage don't update current player
                    if(this.currentPlayer == this.player1){
                        
                        this.currentPlayer = this.player2;
                    }
                    else if(this.currentPlayer == this.player2){
                        this.currentPlayer = this.player1;
                    }
                }
                document.getElementById("roundInfo").innerHTML = "Jogada do jogador "+this.currentPlayer;
                document.getElementById('roundInfo').style.color = "black";


                if(this.computerGame && this.currentPlayer == this.player2){
                    this.computerMove();
                }
            }
        }
        
        this.checkGameEnd();

    }

    //function to realize function move
    playerMovement(playerID,cavitySelected){

        let NextToStorage1 = this.numCavitiesChosen -1;
        let NextToStorage2 = 0;
        
        var cPlayerID = cavitySelected.playerID;
        var cCavityID = cavitySelected.cavityID;
        var placeAdd = this.gameBoard.getCavityByAtt(cPlayerID,cCavityID);

        while(cavitySelected.seedCount != 0){

            if(cPlayerID == this.player1){
                if( cCavityID < NextToStorage1 ){
                    cCavityID++;
                    placeAdd = this.gameBoard.getCavityByAtt(cPlayerID,cCavityID);
                    placeAdd.addSeed();
                    cavitySelected.removeSeed();
                }
                else if( cCavityID == NextToStorage1){
                    cCavityID++;
                    cPlayerID = this.player2;
                    placeAdd = this.gameBoard.storage1;
                    if(playerID == this.gameBoard.storage1.playerID){
                        placeAdd.addSeed();
                        cavitySelected.removeSeed();
                    }

                }
            }
            else if(cPlayerID == this.player2){
                if( cCavityID > NextToStorage2){
                    cCavityID--;
                    placeAdd = this.gameBoard.getCavityByAtt(cPlayerID,cCavityID);
                    placeAdd.addSeed();
                    cavitySelected.removeSeed();
                }
                else if( cCavityID == NextToStorage2){
                    cCavityID--;
                    cPlayerID = this.player1;
                    placeAdd = this.gameBoard.storage2;
                    if(playerID == this.gameBoard.storage2.playerID){
                        placeAdd.addSeed();
                        cavitySelected.removeSeed();
                    }
                }
            }
        }
        return placeAdd;
    }

    //If player is playing alone it realizes the movement of the oponent
    computerMove(){
        var cavityChosen =false;
        var cavityTest = this.gameBoard.getCavityByAtt(this.player2,0);
        if(this.difficulty == "hard"){
            for(var i=0; i<this.numCavitiesChosen; i++){
                cavityTest = this.gameBoard.getCavityByAtt(this.player2,i);
                if(cavityTest.cavityID-cavityTest.seedCount == -1 ){
                    cavityChosen = true;
                    break;
                }
            }
    
        }
        if(cavityChosen == false){
            var maxSeeds = 0;
            cavityTest = this.gameBoard.getCavityByAtt(this.player2,0);
            for(var i=0; i<this.numCavitiesChosen; i++){
                var cavityTest2 = this.gameBoard.getCavityByAtt(this.player2,i);
                if(cavityTest2.seedCount>maxSeeds ){
                    maxSeeds = cavityTest.seedCount;
                    cavityTest = cavityTest2;
                }
            }
        }

        this.validMove(cavityTest,this.player2);

    }

    //function to gather seeds from other player if criteria is met
    checkEmptyLanding(playerID, landingPlace){ 
        if(playerID == landingPlace.playerID && landingPlace.cavityID != "Storage"){
            if(landingPlace.seedCount == 1){

                let placeAdd;
                let oponentRemove;
                let oponentCavityID = landingPlace.cavityID;

                if(playerID == this.player1){ 
                    placeAdd = this.gameBoard.storage1;
                    oponentRemove = this.gameBoard.getCavityByAtt(this.player2,oponentCavityID);  
                 }
                else if(playerID == this.player2){ 
                    placeAdd = this.gameBoard.storage2;
                    oponentRemove = this.gameBoard.getCavityByAtt(this.player1,oponentCavityID); 
                }

                if(oponentRemove.seedCount != 0 && landingPlace.seedCount==1){
                    oponentRemove.seedEmpty(placeAdd); //remove seeds from oponent cavity and add to your storage
                    landingPlace.removeSeed(); //remove seed from your cavity
                    placeAdd.addSeed(); //add seed to your storage
                }
                
            }
        }      
    }


    checkGameEnd(){
        if(this.gameBoard.playercavities1.checkEmpty() || this.gameBoard.playercavities2.checkEmpty()){
            this.gameEnded = true;
            var winner = this.checkWinner();
            this.gameEnd(winner, false);
        }
    }

    checkWinner(){
        //emptying cavities to player who moved last
        if(this.gameBoard.playercavities2.checkEmpty()){
            this.gameBoard.playercavities1.emptyCavites(this.gameBoard.storage2);
        }
        else if(this.gameBoard.playercavities2.checkEmpty()){
            this.gameBoard.playercavities2.emptyCavites(this.gameBoard.storage1);
        }
        //verify who won
        if(this.gameBoard.storage2.numSeeds>this.gameBoard.storage1.numSeeds){
            return this.player2;
        }
        else if(this.gameBoard.storage1.numSeeds>this.gameBoard.storage2.numSeeds){
            return this.player1;
        }
        else{
            return "Draw";
        }
    }

    winnerTitle(winner){
        //checks if player on the classification board
        
        //display message on the screen of the game end
        var msg;
        if(winner != "Draw"){ msg = "O vencedor é " + winner;}
        else { msg = "Empate!";}
        document.getElementById("roundInfo").innerHTML = msg;
    }

    gameEnd(winner, quit){

        gamebuttonBegin();

        if(!quit){
            this.winnerTitle(winner);
        }
    }

}