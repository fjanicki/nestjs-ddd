import { ArgumentInvalidError } from "../errors";

export class ValidateUtils {
  /**
   * Checks if value is empty.
   * Accepts strings, numbers, booleans, objects and arrays.
   */
  static isEmpty(value: unknown): boolean {
    if (typeof value === 'number' || typeof value === 'boolean') {
      return false;
    }
    if (typeof value === 'undefined' || value === null) {
      return true;
    }
    if (value instanceof Date) {
      return false;
    }
    if (value instanceof Object && !Object.keys(value).length) {
      return true;
    }
    if (Array.isArray(value) && value.every((item) => ValidateUtils.isEmpty(item))) {
      return true;
    }
    return value === '';
  }

  /**
   * Checks length range of a provided number/string/array.
   * Min and max are included.
   */
  static lengthIsBetween(value: number | string | Array<unknown>, min: number, max: number): boolean {
    if (ValidateUtils.isEmpty(value)) {
      throw new ArgumentInvalidError(`Cannot check length of "${value}". Provided value is empty`);
    }
    const valueLength = typeof value === 'number' ? Number(value).toString().length : value.length;
    return valueLength >= min && valueLength <= max;
  }
}
