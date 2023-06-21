/**
 * Base class for custom exceptions.
 */
export abstract class BaseError extends Error {
  /**
   * Uniquely identifies the error
   */
  abstract readonly name: string;

  constructor(readonly message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
