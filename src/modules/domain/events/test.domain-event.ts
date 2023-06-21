import { BaseDomainEvent } from "./base.domain-event";

/**
 * TestDomainEvent is a domain event for testing purposes.
 */
export class TestDomainEvent extends BaseDomainEvent {
  static eventName = TestDomainEvent.name;
}
