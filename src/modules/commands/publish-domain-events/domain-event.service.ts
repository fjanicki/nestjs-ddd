import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BaseAggregate, BaseDomainEvent, Id } from "../../domain";

@Injectable()
export class DomainEventService {
  /**
   * The aggregates that have events to publish.
   * @private
   */
  private static readonly aggregates: BaseAggregate<unknown>[] = [];

  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * Adds the aggregate to the aggregates to be published.
   * @param aggregate
   */
  static prepareForPublish(aggregate: BaseAggregate<unknown>): void {
    const aggregateFound = !!this.findAggregate(aggregate.id);
    !aggregateFound && this.aggregates.push(aggregate);
  }

  private static findAggregate(id: Id): BaseAggregate<unknown> | undefined {
    return this.aggregates.find((aggregate) => aggregate.id.value === id.value);
  }

  /**
   * Publishes the events of the aggregate with the given id.
   * @param id
   * @param correlationId
   */
  async publishEvents(id: Id, correlationId?: string): Promise<void> {
    const aggregate = DomainEventService.findAggregate(id);
    if (!aggregate) {
      return;
    }

    await Promise.all(
      aggregate.domainEvents.map((domainEvent: BaseDomainEvent) => {
        if (correlationId && !domainEvent.correlationId) {
          domainEvent.correlationId = correlationId;
        }
        return this.eventEmitter.emit(domainEvent.constructor.name, domainEvent);
      }),
    );
  }
}
