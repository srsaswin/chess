import { Chess } from "chess.js";
import { BLACK, INIT_GAME, MATCH_DONE, WHITE, GAME_START, GAME_END } from "./constants.js";


export function Game(p1, p2) {
    this.p1Ok = false;
    this.p2Ok = false;
    this.gameISLive = false;
    this.p1 = p1;  
    this.p2 = p2;
    

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
    });

    p2.on('message', (rawMessage) => {
        const message = JSON.parse(rawMessage);
        if (message.type === INIT_GAME) {
            this.p2Ok = true;
            checkIsClearToLive();
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
        let chess = new Chess();
        p1.send(JSON.stringify({
            type: GAME_START
        }));
        p2.send(JSON.stringify({
            type: GAME_START
        }));
    };


 

    
}
