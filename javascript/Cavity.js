class Cavity{
    constructor(playerID,cavityID, widthCavity, numSeeds){
        this.playerID = playerID;
        this.cavityID = cavityID;
        this.seedCount = 0;

        //create html
        this.cavity = document.createElement('div');
        this.cavity.className = "cavidade_player";
        this.cavity.id = playerID + "cavity" + cavityID;
        this.cavity.style.width = widthCavity+"%";
        //add seed counter
        this.seedCounter = document.createElement("h3");
        this.seedCounter.innerHTML = this.seedCount;
        this.seedCounter.id = playerID+"cavity"+cavityID+"count";
        this.seedCounter.style.left = "47.5%";
        this.seedCounter.style.top = "80%";
        this.cavity.appendChild(this.seedCounter);
        //set onClick function
        if(oponent=="computer"){
            this.cavity.setAttribute('onclick', 'currentGame.validMove(this,currentGame.currentPlayer)');
        }

        //add seeds to start game
        while(this.seedCount!=numSeeds){
            this.addSeed();
        }

    }

    addSeed(){
        //create the seed
        var beans = document.createElement('div');
        beans.className = "semente";
        beans.id = this.playerID+"cavity"+this.cavityID+"bean"+this.seedCount;
        beans.style.left = randomNumber(35,60)+"%";
        beans.style.top = randomNumber(30,60)+"%";
        beans.style.transform = "rotate("+randomNumber(0,360)+"deg)";
        //add seed to cavity
        this.cavity.appendChild(beans);
        //atualize seed counter for the cavity
        this.seedCount++;
        this.seedCounter.innerHTML = this.seedCount;
    }

    removeSeed(){
        //removing the seed
        var removedSeed = document.getElementById(this.playerID+"cavity"+this.cavityID+"bean"+(this.seedCount-1));
        this.cavity.removeChild(removedSeed);
        //atualize seed counter for the cavity
        this.seedCount--;
        this.seedCounter.innerHTML = this.seedCount;
    }

    seedEmpty(destination){
        while(this.seedCount>0){
            destination.addSeed();
            this.removeSeed();
        }
    }

    returnSeeds(){
        return this.seedCount;
    }

}