import { v4 as uuidV4, validate } from 'uuid';
import { Id } from './id.value-object';
import { DomainPrimitive } from './base.value-object';
import { ArgumentInvalidError } from '../../../errors';

export class Uuid extends Id {
  /**
   * Returns new id instance with randomly generated id value
   */
  static generate(): Uuid {
    return new Uuid(uuidV4());
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    if (!validate(value)) {
      throw new ArgumentInvalidError('Incorrect UUID format');
    }
  }
}
