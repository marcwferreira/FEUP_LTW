const fs = require('fs');
const crypto = require('crypto');
const fsPromises = require('fs').promises;

let waitingGames = [];

module.exports = async function(data) {
    let answer = [];
    let tempData = [];

    //parse JSON data
    let aux = JSON.parse(data);

    let user;
    try{
        const hashedPassword = crypto
              .createHash('md5')
              .update(aux.password)
              .digest('hex');
        user = {nick : aux.nick, hashedPassword : hashedPassword};
    } catch{
        console.log("error?");
        answer.status = 500;;
        answer.message = {error : "Algo deu errado, desculpa."};
        return answer;
    }
    
    let accountsData = fs.readFileSync('./server/dataBase/accounts.json');

    let accountData;

    try{
        accountData = JSON.parse(accountsData.toString());
    } catch {
        accountData = [];
    }

    let userValidated = false;

    accountData.forEach(account => {
        //matched nick and password
        if (account.nick === user.nick && account.hashedPassword === user.hashedPassword) {
            userValidated = true;
        }
    })

    if(userValidated){

        if(waitingGames.length == 0){
            //try creating a hash code to gameID
            try{
                const gameID = crypto
                    .createHash('md5')
                    .update(aux.size.toString() + aux.initial.toString() + (new Date()).toString())
                    .digest('hex');
                console.log('HI');
                console.log(gameID);
                tempData.message = {game : gameID};
            } catch{
                console.log("hello");
                answer.status = 500;
                answer.message = {};
                return answer;
            }
            waitingGames.push({group: aux.group, aux: tempData.message.game});
    
            answer.status = 200;
            answer.message = tempData.message;
            return answer;
        }
        else {
            gamesOnHold.forEach(element => {
                console.log(element, element.game);
                if(element.group == aux.group){
                    answer.status = 200;
                    answer.message = {game: element.game};
                    console.log(answer);
                }
            })
        }       

        if(answer.status == 200) return answer; 
        else {
            //try creating a new game
            try{
                const gameID = crypto
                    .createHash('md5')
                    .update(aux.size.toString() + aux.initial.toString() + (new Date()).toString())
                    .digest('hex');
                tempData.message = {game : gameID};
            } catch{
                answer.status = 500;
                answer.message = {};
                return answer;
            }
        }
        answer.status = 200;
        answer.message = tempData.message;
        return answer;
    }else{
        answer.status = 400;
        answer.message = {error : "Algo deu errado, desculpa."};
        return answer;
    }
}

