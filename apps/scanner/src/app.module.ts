import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembershipService } from './services/membership.service';
import { ScannerService } from './services/scanner.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MembershipService, ScannerService],
})
export class AppModule {}
