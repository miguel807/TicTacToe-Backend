import { Module } from '@nestjs/common';
import {EventGateway} from './event.gateway'
import {TicTacToService} from './event.service'
@Module({
    providers:[EventGateway,TicTacToService]
})

export class EventsGatewayModule{}