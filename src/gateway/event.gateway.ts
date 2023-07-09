import { WebSocketGateway,SubscribeMessage,MessageBody, WebSocketServer,ConnectedSocket, OnGatewayInit, OnGatewayConnection } from "@nestjs/websockets";
import {Server,Socket} from 'socket.io'
import { TicTacToeRepo } from "./event.repository";
import { Injectable } from "@nestjs/common";


@WebSocketGateway({cross:'*'})
@Injectable()
export class EventGateway implements OnGatewayInit,OnGatewayConnection{
    static newGame:TicTacToeRepo;
    private cantPlayer:number = 0;
    private players = []
    private lastPlayer:string
   

    constructor(){
        const board:number[]=[9,9,9,9,9,9,9,9,9]
        const player1 = ""
        const player2 = ""
        EventGateway.newGame = new TicTacToeRepo(board, player1, player2);
    }

    @WebSocketServer()
    server:Server

    afterInit(server: Server) {
        console.log("game inicialized,waiting for players...")
    }

    handleConnection(client: Socket, ...args: any[]) {
        if(this.cantPlayer == 0){
            EventGateway.newGame.setPlayer1(client.id )        
    }
        if(this.cantPlayer==1){
            EventGateway.newGame.setPlayer2(client.id)   
        }
        if(this.cantPlayer==1)console.log("the game is ready to start")
        this.cantPlayer=this.cantPlayer+1
        this.players.push(client.id)
        this.lastPlayer = EventGateway.newGame.getPlayer1();
    }

    @SubscribeMessage('move')
    onNewMessage(@MessageBody() body:any, @ConnectedSocket() client: Socket){
        
        if(this.lastPlayer == client.id){
            EventGateway.newGame.setBoard(body.board);
            const board = EventGateway.newGame.getBoard();
            this.server.emit('play',{
                "board":board,
                "turn played by client with id ": this.lastPlayer,
                "turn to be played for client with id: ": this.players.filter((player)=>player!=this.lastPlayer)
            })
            
            if(this.lastPlayer == EventGateway.newGame.getPlayer1()){
                this.server.emit('play', EventGateway.newGame.determineWinner(board,this.lastPlayer,0));
                this.lastPlayer = EventGateway.newGame.getPlayer2();
            }else{
                this.server.emit('play', EventGateway.newGame.determineWinner(board,this.lastPlayer,1));
                this.lastPlayer = EventGateway.newGame.getPlayer1(); 
            }
        }else{
            client.emit('play',"its not your turn");
        }
        
        
    }

}