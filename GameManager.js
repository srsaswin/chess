import { BLACK, INIT_GAME, MATCH_DONE, WHITE, GAME_START, GAME_END, READY_TO_MOVE, MOVE, UNDO } from "./constants.js";
import { Game } from "./Game.js";


export function GameManager(p1, p2) {
    //
    //
    // @
    
    const game = new Game();
    this.p1Ok = false;
    this.p2Ok = false;
    this.gameISLive = false;
    this.p1 = p1;  
    this.p2 = p2;
    
    const playerMoves = {
        currentPlayer:p1,
        inWaith:true
    }
    

    p1.send(JSON.stringify({
        type: MATCH_DONE,
        payLoad: {
            color: WHITE
        }
    }));

    p2.send(JSON.stringify({
        type: MATCH_DONE,
        payLoad: {
            color: BLACK
        }
    }));

    const checkIsClearToLive = () => {
        this.gameISLive = this.p1Ok && this.p2Ok;
        if (this.gameISLive) {
            startGame();
        }
    };

    p1.on('message', (rawMessage) => {
        const message = JSON.parse(rawMessage);
        if (message.type === INIT_GAME) {
            this.p1Ok = true;
            checkIsClearToLive();
        }
        if(message.type === MOVE && playerMoves.currentPlayer === p1){ 
            if(game.makeMove(message.payLoad)){
                const status = game.getStatus();
                if(status.isGameOver){
                    endGame(status.message);
                    return
                }
                playerMoves.currentPlayer = p2;
                sendMove(message.payLoad); 
            }else{
                p1.send(JSON.stringify({
                    type:UNDO
                }));
                readyToMove();
            }
        }
    });

    p2.on('message', (rawMessage) => {
        const message = JSON.parse(rawMessage);
        if (message.type === INIT_GAME) {
            this.p2Ok = true;
            checkIsClearToLive();
        }
        if(message.type === MOVE && playerMoves.currentPlayer === p2){ 
            if(game.makeMove(message.payLoad)){
                const status = game.getStatus();
                if(status.isGameOver){
                    endGame(status.message);
                    return
                }
                playerMoves.currentPlayer = p1;
                sendMove(message.payLoad); 
            }else{
                p2.send(JSON.stringify({
                    type:UNDO
                }));
                readyToMove();
            }
        }
    });

    p1.on('close',()=>{
        this.p1Ok = false;
        this.gameISLive = false;
        this.delet();
        p2.send(JSON.stringify({
            type:GAME_END,
            payLoad:{
                message:"opponent is disconnected"
            }
        }));
        p2.close();
    });

    p2.on('close',()=>{
        this.p2Ok = false;
        this.gameISLive = false;
        this.delet();
        p1.send(JSON.stringify({
            type:GAME_END,
            payLoad:{
                message:"opponent is disconnected"
            }
        }));
        p1.close();
    });

    const startGame = () => {
        p1.send(JSON.stringify({
            type: GAME_START
        }));
        p2.send(JSON.stringify({
            type: GAME_START
        }));
        readyToMove();
    };
 
    function readyToMove(){
        playerMoves.currentPlayer.send(JSON.stringify({
            type:READY_TO_MOVE
        }));
    }

    function endGame(message){
        this.p1Ok = false;
        this.p2Ok = false;
        this.gameISLive = false;
        this.delet();
        p1.send(JSON.stringify({
            type:GAME_END,
            payLoad:{
                message:message,
                isWon: p1 === playerMoves.currentPlayer
            }
        }));
        p2.send(JSON.stringify({
            type:GAME_END,
            payLoad:{
                message:message,
                isWon: p2 === playerMoves.currentPlayer
            }
        }));
        p1.close();
        p2.close();
    }

    function sendMove(move){
        playerMoves.currentPlayer.send(JSON.stringify(move));
        readyToMove();
    }
}
