class PlayerCavities{
    constructor(playerID, numCavitiesChosen, numSeedsChosen, cavityWidth) {
        this.player = playerID;
        this.cavityList = [];

        //create html
        this.cavities = document.createElement('div');
        this.cavities.className= "cavidades_player";
        this.cavities.id = "cavities" + playerID;
        //add the cavities itself
        for(var j=0; j<numCavitiesChosen; j++){
            var cavityAdd = new Cavity(playerID,j, cavityWidth, numSeedsChosen);
            this.cavityList.push(cavityAdd); //add to cavity list
            this.cavities.appendChild(cavityAdd.cavity);
        }
    }

    checkEmpty(){
        let listSize = this.cavityList.length;
        let emptyCount = 0;
        for (let i = 0; i < listSize; i++) {
            if(this.cavityList[i].returnSeeds() == 0){
                emptyCount++;
            }
        }
        if(emptyCount == listSize){
            return true;
        }
    }

    emptyCavites(storage){
        let listSize = this.cavityList.length;
        for (let i = 0; i < listSize; i++) {
           this.cavityList[i].seedEmpty(storage);
        }
    }

}