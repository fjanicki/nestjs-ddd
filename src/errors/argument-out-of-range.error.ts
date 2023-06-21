import { ErrorTypes } from './error.types';
import { BaseError } from './base.error';

/**
 * Used to indicate that an argument is out of range
 */
export class ArgumentOutOfRangeError extends BaseError {
  readonly name = ErrorTypes.ArgumentInvalid;
}
