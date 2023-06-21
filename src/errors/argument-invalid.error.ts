import { ErrorTypes } from './error.types';
import { BaseError } from './base.error';

/**
 * Used to indicate that an incorrect argument
 * was provided to a method/function/class.
 */
export class ArgumentInvalidError extends BaseError {
  readonly name = ErrorTypes.ArgumentInvalid;
}
