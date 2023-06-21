import { BaseValueObject, DomainPrimitive } from './base.value-object';

/**
 * The Id is used to uniquely identify an entity.
 */
export abstract class Id extends BaseValueObject<string> {
  constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  protected abstract validate({ value }: DomainPrimitive<string>): void;
}
