const { AssertionError } = require('assert');
const crypto = require('crypto');
const fs = require('fs');

module.exports = async function(data) {
  let answer = [];

  ///////
  //parse JSON data
  let aux = JSON.parse(data);
  //testing if nick is valid
  console.log(aux.nick + ' this is the nick');
  //testing if nick or password is undefined
  if(aux.nick === null || aux.password === null || aux.nick.length === 0 || aux.password.length === 0 || aux.nick === undefined || aux.password === undefined ){
    answer.status = 400;
    answer.message = {error:"Username ou password não pode ser vazio."};
    return answer;
  }
  //create var to store user with hashed Password
  let user;
  //getting user and hashing password
  try{
    const hashedPassword = crypto
          .createHash('md5')
          .update(aux.password)
          .digest('hex');
    user = {nick : aux.nick, hashedPassword : hashedPassword};
  } catch{
    answer.status = 500;;
    answer.message = {error : "Algo deu errado, desculpa."};
    return answer;
  }
  //////

  let accountsData = fs.readFileSync('./server/dataBase/accounts.json');

  let accountData;

  try{
    accountData = JSON.parse(accountsData.toString());
  } catch {
    accountData = [];
  }

  console.log("logging account data");
  console.log(accountData);

  let foundAccount =false; //found account is set to false
  accountData.forEach(account => {
    //matched nick and password
    if (account.nick === user.nick && account.hashedPassword === user.hashedPassword) {
      foundAccount = true;
      answer.status = 200;
      answer.message = {};
      return answer;
    }
    //found account but password is wrong
    else if(account.nick === user.nick && account.hashedPassword !== user.hashedPassword) {
      foundAccount = true;
      answer.status = 401;
      answer.message = {error:"Login Invalido"};
      return answer;
    }
  })
  //create a new account
  if(!foundAccount){
    accountData.push(user);
    fs.writeFile("./server/dataBase/accounts.json",JSON.stringify(accountData),function(err,data){
      if(err) return console.log(err);
    })
    answer.status = 200;
    answer.message = {};
    return answer;
  }

  return answer;
}

