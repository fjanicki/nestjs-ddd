import { BaseValueObject, DomainPrimitive } from './base.value-object';
import { ArgumentInvalidError } from '../../../errors';

export class DateValueObject extends BaseValueObject<Date> {
  constructor(value: Date | string | number) {
    const date = new Date(value);
    super({ value: date });
  }

  get value(): Date {
    return this.props.value;
  }

  static now(): DateValueObject {
    return new DateValueObject(Date.now());
  }

  protected validate(props: DomainPrimitive<Date>): void {
    if (!(props.value instanceof Date) || Number.isNaN(props.value.getTime())) {
      throw new ArgumentInvalidError('Incorrect date');
    }
  }
}
