const WebSocket = require('ws');
const { Game } = require('./Game');
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
        
        const game = new Game(
            players.queue.pop(),
            players.queue.pop()
        );

        game.delet = function () { 
                games.queue = games.queue.filter(g => g !== this);
                

                this.p1 = null;
                this.p2 = null;
        
                console.log('Game deleted');
        };

        games.queue.push(game);
    }

});