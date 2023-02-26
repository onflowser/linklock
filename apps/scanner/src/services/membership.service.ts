import { EventBroadcasterInterface } from '@rayvin-flow/flow-scanner-lib/lib/broadcaster/event-broadcaster';
import { FlowEvent } from '@rayvin-flow/flow-scanner-lib/lib/flow/models/flow-event';
import { Injectable, Logger } from '@nestjs/common';

type ClaimEventData = {
  adminAddress: string;
  membershipDefinitionId: number;
  member: string;
};

export type ClaimEvent = Omit<FlowEvent, 'data'> & {
  data: ClaimEventData;
};

@Injectable()
export class MembershipService implements EventBroadcasterInterface {
  private logger = new Logger(MembershipService.name);
  private events: ClaimEvent[] = [];

  async broadcastEvents(
    blockHeight: number,
    newEvents: FlowEvent[],
  ): Promise<void> {
    this.events.push(...newEvents);
  }

  public async getMembersByAdmin(adminAddress: string) {
    return this.events.filter(
      (event) => event.data.adminAddress === adminAddress,
    );
  }
}
