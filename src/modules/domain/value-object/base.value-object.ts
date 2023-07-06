import { ConvertUtils, ValidateUtils } from '../../../utils';
import { ArgumentNotProvidedError } from '../../../errors';

/**
 * The primitive type that the value object wraps.
 */
export type Primitives = string | number | boolean;

/**
 * Similar to the type Primitives, this is an object as a primitive type.
 */
export interface DomainPrimitive<T extends Primitives | Date> {
  value: T;
}

/**
 * The attributes of the value object.
 */
export type BaseValueObjectProps<T> = T extends Primitives | Date ? DomainPrimitive<T> : T;

/**
 * The base for all value objects
 */
export abstract class BaseValueObject<T> {
  /**
   * The properties of the value object.
   * They can be accessed using getters and setters.
   * @protected
   */
  protected readonly props: BaseValueObjectProps<T>;

  protected constructor(props: BaseValueObjectProps<T>) {
    this.validate(props);
    this.props = props;
  }

  static isValueObject(obj: unknown): obj is BaseValueObject<unknown> {
    return obj instanceof BaseValueObject;
  }

  /**
   * Unpack a value object to get its raw properties
   */
  public unpack(): T {
    if (this.isDomainPrimitive(this.props)) {
      return this.props.value;
    }

    const propsCopy = ConvertUtils.convertPropsToObject(this.props);

    return Object.freeze(propsCopy);
  }

  /**
   * Validates the value object.
   * @param props
   * @throws Error If the value object is invalid
   * @protected
   */
  protected abstract validate(props: BaseValueObjectProps<T>): void;

  private checkIfEmpty(props: BaseValueObjectProps<T>): void {
    if (ValidateUtils.isEmpty(props) || (this.isDomainPrimitive(props) && ValidateUtils.isEmpty(props.value))) {
      throw new ArgumentNotProvidedError('Property cannot be empty');
    }
  }

  private isDomainPrimitive(obj: unknown): obj is DomainPrimitive<T & (Primitives | Date)> {
    if (Object.prototype.hasOwnProperty.call(obj, 'value')) {
      return true;
    }
    return false;
  }
}
