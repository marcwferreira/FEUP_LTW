const { AssertionError } = require('assert');
const fs = require('fs');

module.exports = async function() {
  let answer = [];
  let data = fs.readFileSync('./server/dataBase/rankings.json');

  try{
    rankingData= JSON.parse(data.toString());
  } catch {
    rankingData = [];
  }

    if(rankingData.length === 0 || rankingData === null) {
      answer.status = 400;
      answer.message = {ranking : []};
    }
    else if(rankingData.length < 10){
        rankingData.sort(function(x,y){return y["victories"]-x["victories"]});
        var rankingList = {ranking : rankingData};
        answer.status = 200;
        answer.message = rankingList;
    }
    else{
        rankingData.sort(function(x,y){return y["victories"]-x["victories"]});
        var rankingList = {ranking : rankingData.slice(0,10)};
        answer.status = 200;
        answer.message = rankingList;
    }
    return answer;
}

