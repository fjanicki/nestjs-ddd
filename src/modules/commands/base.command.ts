import { nanoid } from 'nanoid';
import { Uuid } from '../domain';
import { ArgumentNotProvidedError } from '../../errors';
import { ValidateUtils } from '../../utils';

export type CommandProps<T> = Omit<T, 'correlationId' | 'id'> & Partial<BaseCommand>;

/**
 * A command is used to create, update or delete a resource.
 * See https://en.wikipedia.org/wiki/Command_pattern.
 *
 * Every attribute should be readonly.
 */
export abstract class BaseCommand {
  /**
   * Command id, in case if we want to save it
   * for auditing purposes and create a correlation/causation chain
   */
  public readonly id: string;

  /**
   * ID for correlation purposes (for UnitOfWork, for commands that
   * arrive from other microservices,logs correlation etc).
   */
  public readonly correlationId: string;

  /**
   * Causation id to reconstruct execution ordering if needed
   */
  public readonly causationId?: string;

  protected constructor(props: CommandProps<unknown>) {
    if (ValidateUtils.isEmpty(props)) {
      throw new ArgumentNotProvidedError('Command props should not be empty');
    }
    this.correlationId = props.correlationId || nanoid(8);
    this.id = props.id || Uuid.generate().value;
  }
}
