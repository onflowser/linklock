import { EventBroadcasterInterface } from '@rayvin-flow/flow-scanner-lib/lib/broadcaster/event-broadcaster';
import { FlowEvent } from '@rayvin-flow/flow-scanner-lib/lib/flow/models/flow-event';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EventBroadcasterService implements EventBroadcasterInterface {
  private logger = new Logger(EventBroadcasterService.name);

  async broadcastEvents(
    blockHeight: number,
    events: FlowEvent[],
  ): Promise<void> {
    const redeemEvents = [];
    const claimEvents = [];
    for (const event of events) {
      if (event.type.match(/Membership\.Claim/)) {
        claimEvents.push(event);
      }
      if (event.type.match(/Membership\.Redeem/)) {
        redeemEvents.push(event);
      }
    }

    await this.processEvents({ claimEvents, redeemEvents });
  }

  private async processEvents(options: {
    redeemEvents: FlowEvent[];
    claimEvents: FlowEvent[];
  }) {
    const { claimEvents, redeemEvents } = options;
    this.logger.debug(
      `Received ${claimEvents.length} claim and ${redeemEvents.length} redeem events`,
      JSON.stringify(redeemEvents, null, 2),
    );
  }
}
