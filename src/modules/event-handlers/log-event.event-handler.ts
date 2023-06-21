import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseEventHandler } from "./base.event-handler";
import { AllEventsDomainEvent } from "../domain";

@Injectable()
export class LogEventEventHandler extends BaseEventHandler<AllEventsDomainEvent> {
  private readonly logger = new Logger(LogEventEventHandler.name);

  @OnEvent(AllEventsDomainEvent.eventName)
  async handleEvent(event: AllEventsDomainEvent): Promise<void> {
    this.logger.debug(`[Domain Event published]: ${event.constructor?.name} ${event.aggregateId?.value}`);
  }
}
