/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import { BaseEntity } from '../modules/domain/entities/base.entity';
import { BaseValueObject } from '../modules/domain/value-object/base.value-object';

export class ConvertUtils {
  static isEntity(obj: unknown): obj is BaseEntity<unknown> {
    /**
     * 'instanceof Entity' causes error here for some reason.
     */
    return (
      Object.prototype.hasOwnProperty.call(obj, 'toObject') &&
      Object.prototype.hasOwnProperty.call(obj, 'id') &&
      BaseValueObject.isValueObject((obj as BaseEntity<unknown>).id)
    );
  }

  static convertToPlainObject(item: any): any {
    if (BaseValueObject.isValueObject(item)) {
      return item.unpack();
    }
    if (ConvertUtils.isEntity(item)) {
      return item.toObject();
    }
    return item;
  }

  /**
   * Converts Entity/Value Objects props to a plain object.
   * Useful for testing and debugging.
   * @param props
   */
  static convertPropsToObject(props: any): any {
    const propsCopy = { ...props };

    // eslint-disable-next-line guard-for-in
    for (const prop in propsCopy) {
      if (Array.isArray(propsCopy[prop])) {
        propsCopy[prop] = (propsCopy[prop] as Array<unknown>).map((item) => {
          return ConvertUtils.convertToPlainObject(item);
        });
      }
      propsCopy[prop] = ConvertUtils.convertToPlainObject(propsCopy[prop]);
    }

    return propsCopy;
  }
}
