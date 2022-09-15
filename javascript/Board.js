class Board{
    constructor(player1,player2,numCavities,numSeeds){
        this.player2 = player2;
        this.player1 = player1;
        this.numCavities = numCavities;

        //clear previous board
        document.getElementById("boardPlace").innerHTML= "";
        //definiyng the width of the cavity depending on the number of it
        const cavityWidth = 100/numCavities;

        //player2 storage
        this.storage2 = new Storage(player2);

        //cavities HTML
        this.cavities = document.createElement('div');
        this.cavities.className= "cavidades";
        this.playercavities2 = new PlayerCavities(player2,numCavities,numSeeds, cavityWidth);
        this.cavities.appendChild(this.playercavities2.cavities);
        this.playercavities1 = new PlayerCavities(player1,numCavities,numSeeds, cavityWidth);
        this.cavities.appendChild(this.playercavities1.cavities);
        document.getElementById("boardPlace").appendChild(this.cavities);

        //player1 storage
        this.storage1 = new Storage(player1);
    }

    getCavity(cavityID){
        //searching cavities from player 1
        for(let i=0;i<this.numCavities;i++){
            let cavitySearchingID = this.playercavities1.cavityList[i].playerID+"cavity"+this.playercavities1.cavityList[i].cavityID;
            if( cavitySearchingID == cavityID){ return this.playercavities1.cavityList[i]; }
        }
        //searching cavities from player 2
        for(let i=0;i<this.numCavities;i++){
            let cavitySearchingID = this.playercavities2.cavityList[i].playerID+"cavity"+this.playercavities2.cavityList[i].cavityID;
            if( cavitySearchingID == cavityID){ return this.playercavities2.cavityList[i]; }
        }
    }

    getCavityByAtt(playerID,cavityID){
         //searching cavities from player 1
         for(let i=0;i<this.numCavities;i++){
            let cavitySearchingID = this.playercavities1.cavityList[i];
            if( playerID == cavitySearchingID.playerID && cavityID == cavitySearchingID.cavityID){ return this.playercavities1.cavityList[i]; }
        }
        //searching cavities from player 2
        for(let i=0;i<this.numCavities;i++){
            let cavitySearchingID = this.playercavities2.cavityList[i];
            if( playerID == cavitySearchingID.playerID && cavityID == cavitySearchingID.cavityID){ return this.playercavities2.cavityList[i]; }
        }
    }

}