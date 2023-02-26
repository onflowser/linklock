import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventBroadcasterService } from './services/event-broadcaster.service';
import { ScannerService } from './services/scanner.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EventBroadcasterService, ScannerService],
})
export class AppModule {}
