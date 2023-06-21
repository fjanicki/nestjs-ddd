import { BaseEntity } from './base.entity';
import { BaseDomainEvent } from '../events/base.domain-event';
import { DomainEventService } from '../../commands/publish-domain-events/domain-event.service';

export abstract class BaseAggregate<EntityProps> extends BaseEntity<EntityProps> {
  private _domainEvents: BaseDomainEvent[] = [];

  get domainEvents(): BaseDomainEvent[] {
    return this._domainEvents;
  }

  addEvent(domainEvent: BaseDomainEvent): void {
    this._domainEvents.push(domainEvent);
    DomainEventService.prepareForPublish(this);
  }

  clearEvents(): void {
    this._domainEvents = [];
  }
}
