import { WebSocketGateway,SubscribeMessage,MessageBody, WebSocketServer,ConnectedSocket, OnGatewayInit, OnGatewayConnection } from "@nestjs/websockets";
import {Server,Socket} from 'socket.io'
import { TicTacToService } from "./event.service";
import { Injectable } from "@nestjs/common";


@WebSocketGateway({cross:'*'})
@Injectable()
export class EventGateway implements OnGatewayInit,OnGatewayConnection{
    private cantPlayer:number = 0;
    private players = []
    private lastPlayer:string
   

    constructor( private readonly tictactoService:TicTacToService){}

    @WebSocketServer()
    server:Server

    afterInit(server: Server) {
        const board:number[]=[9,9,9,9,9,9,9,9,9]
        const player1 = ""
        const player2 = ""
        this.tictactoService.setBoard(board);
        this.tictactoService.setPlayer1(player1);
        this.tictactoService.setPlayer2(player2);
        console.log("game inicialized,waiting for players...")
    }

    handleConnection(client: Socket, ...args: any[]) {
        if(this.cantPlayer == 0){
            this.tictactoService.setPlayer1(client.id )        
    }
        if(this.cantPlayer==1){
            this.tictactoService.setPlayer2(client.id)   
        }
        if(this.cantPlayer==1)console.log("the game is ready to start")
        this.cantPlayer+=1
        this.players.push(client.id)
        this.lastPlayer = this.tictactoService.getPlayer1();
    }

    @SubscribeMessage('move')
    onNewMessage(@MessageBody() body:any, @ConnectedSocket() client: Socket){
        
        if(this.lastPlayer == client.id){
            this.tictactoService.setBoard(body.board);
            const board = this.tictactoService.getBoard();
            this.server.emit('play',{
                "board":board,
            })
            this.server.emit('turn',{
                "turn played by client with id ": this.lastPlayer,
                "turn to be played for client with id: ": this.players.filter((player)=>player!=this.lastPlayer)
            })
            
            if(this.lastPlayer == this.tictactoService.getPlayer1()){
                this.server.emit('play', this.tictactoService.determineWinner(board,this.lastPlayer,0));
                this.lastPlayer = this.tictactoService.getPlayer2();
            }else{
                this.server.emit('play', this.tictactoService.determineWinner(board,this.lastPlayer,1));
                this.lastPlayer = this.tictactoService.getPlayer1(); 
            }
        }else{
            client.emit('turn',"its not your turn");
        }
        
        
    }

}