import { BaseDomainEvent } from '../domain';

/**
 * A handler for a domain event.
 */
export abstract class BaseEventHandler<Event extends BaseDomainEvent> {
  /**
   * Handles the published domain event.
   * @param event
   */
  abstract handleEvent(event: Event): Promise<void>;
}
