class Storage {
    constructor(playerSt) {
        this.playerID = playerSt;
        this.cavityID = "Storage";
        this.numSeeds = 0;

        //creating HTML
        this.storage = document.createElement("div");
        this.storage.className = "armazen";
        this.storage.id = "storage"+playerSt;
        //add HTML show counter
        this.storageCounter = document.createElement("h3");
        this.storageCounter.innerHTML = 0;
        this.storageCounter.id = "storage"+playerSt+"count";
        this.storageCounter.style.left = "47.5%";
        this.storageCounter.style.top = "90%";
        this.storage.appendChild(this.storageCounter);
        //add to main HTML
        document.getElementById("boardPlace").appendChild(this.storage);
    }

    addSeed() {
        //create the seed
        var beans = document.createElement('div');
        beans.className = "sementeArmazen";
        beans.id = "storage"+this.playerID+"bean"+this.numSeedsSt;
        beans.style.left = randomNumber(35,60)+"%";
        beans.style.top = randomNumber(30,60)+"%";
        beans.style.transform = "rotate("+randomNumber(0,360)+"deg)";
        //add seed to storage
        this.storage.appendChild(beans);
        //atualize seed counter for the cavity
        this.numSeeds++;
        this.storageCounter.innerHTML = this.numSeeds;       
    }
}