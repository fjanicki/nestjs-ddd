import { ErrorTypes } from './error.types';
import { BaseError } from './base.error';

/**
 * Used to indicate that an argument was not provided (is empty object/array, null of undefined).
 */
export class ArgumentNotProvidedError extends BaseError {
  readonly name = ErrorTypes.ArgumentNotProvided;
}
