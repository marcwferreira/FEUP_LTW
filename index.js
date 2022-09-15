const http = require('http');
const url = require('url');
const fs = require('fs');
const crypto = require('crypto');

//modules
const register = require('./server/register.js');
const ranking = require('./server/ranking.js');
const joinFunc = require('./server/join.js');

const hostname = 'twserver.alunos.dcc.fc.up.pt';
const port = 9096;

const server = http.createServer(function (request, response) {
   switch (request.method) {
      case 'POST':
        switch (request.url) {

          case '/register':

            let data = '';
            request.on('data', chunk => {
              data += chunk;
            })
            request.on('end', async () => {
              //reading accounts file
              let p = register(data);
              console.log(p);
              p.then( (messages) => {
                response.writeHead(messages.status,{"Access-Control-Allow-Origin": "*"},{"Content-Type":"application/json"});
                response.write(JSON.stringify(messages.message));
                response.end();
              })
            })

            break;

          case '/ranking':

            let ranks = '';
            request.on('data', chunk => {
              ranks += chunk;
            })
            request.on('end', () => {
              let p = ranking();
              console.log(p);
              p.then( (messages) => {
                response.writeHead(messages.status, {"Access-Control-Allow-Origin":"*"});
                response.write(JSON.stringify(messages.message));
                response.end();
              })
            }) 
            break;
        
          case '/join':

            let join = '';
            request.on('data', chunk => {
              join += chunk;
            })
            request.on('end', () => {
              let p = joinFunc(join);
              p.then( (messages) => {
                console.log(messages);
                response.writeHead(messages.status, {"Access-Control-Allow-Origin":"*"},{"Content-Type":"application/json"});
                response.write(JSON.stringify(messages.message));
                response.end();
              })
            })
            break;

          default:
            response.writeHead(404);
            response.end();
            break;

        }

        break;

      default:
        response.writeHead(500);
        response.end();
        break;
    }
});

server.listen(port,hostname, (err) => {
  if(err) {
    console.log("Something went wrong", err);}
    else{
      console.log(`Server running at http://${hostname}:${port}`);
    }
});