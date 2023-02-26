import { Injectable, Logger } from '@nestjs/common';
import { FlowScanner } from '@rayvin-flow/flow-scanner-lib';
import { ConfigProvider } from '@rayvin-flow/flow-scanner-lib/lib/providers/config-provider';
import { EventBroadcasterService } from './event-broadcaster.service';
import { LoggerInterface } from '@rayvin-flow/flow-scanner-lib/lib/providers/log-provider';
import { MemorySettingsService } from '@rayvin-flow/flow-scanner-lib/lib/settings/memory-settings-service';
import { wait } from '../utils';

@Injectable()
export class ScannerService {
  private logger = new Logger(ScannerService.name);
  private flowScanner: FlowScanner;
  private maxRetries = 100;
  private retries = 0;

  constructor(private readonly eventService: EventBroadcasterService) {
    const address = '0xf3fcd2c1a78f5eee';
    this.init([
      `A.${address}.Membership.Claim`,
      `A.${address}.Membership.Redeem`,
    ]);
    this.start();
  }

  init(monitorEvents: string[]) {
    this.logger.debug('Listening for events: ', monitorEvents);
    const configProvider: ConfigProvider = () => ({
      defaultStartBlockHeight: undefined, // Start at the latest block.
      flowAccessNode: 'http://localhost:8080',
      maxFlowRequestsPerSecond: 10, // maximum number of requests to make to the Flow API per second
    });

    const memorySettingsService = new MemorySettingsService();
    this.flowScanner = new FlowScanner(monitorEvents, {
      configProvider: configProvider,
      logProvider: (): LoggerInterface => ({
        info: () => null,
        debug: () => null,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        warn: (...args) => this.logger.warn(...args),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        error: (...args) => this.logger.error(...args),
      }),
      eventBroadcasterProvider: async () => this.eventService,
      settingsServiceProvider: async () => memorySettingsService,
    });
  }

  async start(): Promise<void> {
    if (!this.flowScanner) {
      throw new Error('Flow service not initialised');
    }
    this.logger.debug('Starting');
    try {
      await this.flowScanner.start();
    } catch (e) {
      this.logger.error(e);
      await this.stop();
      this.retries++;
      if (this.retries < this.maxRetries) {
        this.logger.debug('Retrying...');
        await wait(5000);
        return this.start();
      }
    }
  }

  async stop() {
    // when you are ready to stop the scanner, you can call the stop() method
    this.logger.debug('Stopping scanner');
    await this.flowScanner.stop();
  }
}
