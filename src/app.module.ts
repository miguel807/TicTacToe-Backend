import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGatewayModule } from './gateway/event.gateway.module';

@Module({
  imports: [EventsGatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
