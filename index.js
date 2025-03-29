const WebSocket = require('ws');
const { GameManager } = require('./GameManager');
const { PORT } = require('./constants');
const server = new WebSocket.Server({port:PORT});

const players = {
    queue:[],
    isMatchable: function(){
        return this.queue.length >= 2;
    }
}

const games = {
    queue:[]
}

server.on('connection',(player)=>{
    players.queue.push(player);

    if(players.isMatchable()){
        console.log('Match Found! Starting Game...');
        
        const gm = new GameManager(
            players.queue.pop(),
            players.queue.pop()
        );

        gm.delet = function () { 
                games.queue = games.queue.filter(g => g !== this);
                

                this.p1 = null;
                this.p2 = null;
        
                console.log('Game deleted');
        };

        games.queue.push(gm);
    }

});
