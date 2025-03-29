import { Chess } from "chess.js";

export function Game(){
    const chess = new Chess();

    this.makeMove = function(move){
        try {
            chess.move(move);
        } catch (error) {
            return false;
        }
        return true;
    }

    this.getStatus = function(){
        if(chess.isCheckmate()) return{
            isGameOver:true,
            message:"check_mate"
        }

        if(chess.isDraw()) return{
            isGameOver:true,
            message:"draw"
        }

        return {isGameOver:false}
    }
}
