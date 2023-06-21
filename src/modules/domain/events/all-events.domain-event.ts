import { BaseDomainEvent } from './base.domain-event';

export class AllEventsDomainEvent extends BaseDomainEvent {
  static eventName = '**';
}
