
export class TicTacToeRepo{
        
        constructor(
            private board:any[9],
            private player1:string,
            private player2:string,
        ){}

        public getBoard(){
            return this.board;
        }
        
        public setBoard(board:any[9]){
            this.board = board;
           
        }

        public getPlayer1(){
            return this.player1;
        }
        public setPlayer1(player1:string){
            this.player1 = player1;
        }
        
        public getPlayer2(){
            return this.player2;
        }
        public setPlayer2(player2:string){
            this.player2 = player2;
        }

        public determineWinner(board:any[9],player:string,type:number){
            //row
            if(board[0]==type&&board[1]==type&&board[2]==type){
                return `winner ${player}`;
            }
            if(board[3]==type&&board[4]==type&&board[5]==type){
                return `winner ${player}`;
            }
            
            if(board[6]==type&&board[7]==type&&board[8]==type){
                return `winner ${player}`;
            }
            //columns
            if(board[0]==type&&board[3]==type&&board[6]==type){
                return `winner ${player}`;
            }
            if(board[1]==type&&board[4]==type&&board[7]==type){
                return `winner ${player}`;
            }
            if(board[2]==type&&board[5]==type&&board[8]==type){
                return `winner ${player}`;
            }
            //cruz
            if(board[0]==type&&board[4]==type&&board[8]==type){
                return `winner ${player}`;
            }
            if(board[2]==type&&board[4]==type&&board[6]==type){
                return `winner ${player}`;
            }
            return "nodody is winning";
        }
}