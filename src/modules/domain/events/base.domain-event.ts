import { Nanoid, Id } from '../value-object';
import { ArgumentNotProvidedError } from '../../../errors';
import { ValidateUtils } from '../../../utils';

export type DomainEventProps<T> = Omit<T, 'id' | 'correlationId' | 'dateOccurred'> &
  Omit<BaseDomainEvent, 'id' | 'correlationId' | 'dateOccurred'> & {
    correlationId?: string;
    dateOccurred?: number;
  };

/**
 * A domain event.
 *
 * Domain events can be published by entities.
 */
export abstract class BaseDomainEvent {
  /**
   * A name for the event for e.g. logging.
   */
  static eventName: string;

  /**
   * A unique id for the event.
   */
  public readonly id: string;

  /**
   * The id of the entity that published this event.
   */
  readonly aggregateId: Id;

  /**
   * The date when the event occurred.
   */
  readonly dateOccurred: number;

  /**
   * ID for correlation purposes (for UnitOfWork, integration events,
   * logs correlation etc).
   * This ID is set automatically in a publisher.
   */
  public correlationId: string;

  /**
   * Causation id to reconstruct execution ordering if needed
   */
  public causationId?: string;

  constructor(props: DomainEventProps<unknown>) {
    if (ValidateUtils.isEmpty(props)) {
      throw new ArgumentNotProvidedError('DomainEvent props should not be empty');
    }
    this.id = Nanoid.generate().unpack();
    this.aggregateId = props.aggregateId;
    this.dateOccurred = props.dateOccurred || Date.now();
    if (props.correlationId) {
      this.correlationId = props.correlationId;
    }
  }
}
