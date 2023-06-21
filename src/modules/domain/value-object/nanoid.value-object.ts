import { Id } from './id.value-object';
import { customAlphabet } from 'nanoid';
import { DomainPrimitive } from './base.value-object';
import { ArgumentInvalidError } from '../../../errors';

export class Nanoid extends Id {
  /**
   * Returns new id instance with randomly generated id value
   */
  alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  alphaNumericRegexMatcher = /^[a-z0-9]+$/i;

  static generate(): Nanoid {
    const nanoid = customAlphabet(Nanoid.prototype.alphabet, 15);

    return new Nanoid(nanoid());
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    if (value.length !== 15) {
      throw new ArgumentInvalidError('Incorrect nanoid format');
    }

    if (value.match(this.alphaNumericRegexMatcher)) {
      throw new ArgumentInvalidError('Incorrect nanoid format. Contains illegal characters.');
    }
  }
}
