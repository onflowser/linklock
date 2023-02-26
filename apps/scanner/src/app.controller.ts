import { Controller, Get, Param } from '@nestjs/common';
import { MembershipService } from './services/membership.service';

@Controller()
export class AppController {
  constructor(private readonly eventService: MembershipService) {}

  @Get(':adminAddress')
  getMemberships(@Param('adminAddress') adminAddress: string) {
    return this.eventService.getMembersByAdmin(adminAddress);
  }
}
