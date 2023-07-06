import { BaseValueObject, DomainPrimitive, Primitives } from "../../../src";
import { type } from "os";

class StringValueObject extends BaseValueObject<Primitives> {

  constructor(props: Primitives) {
    super({value: props});
  }

  protected validate(props: DomainPrimitive<Primitives>): void {
    if (typeof props.value !== 'string')
      throw new Error('Invalid prop');
  }
}

class NumberValueObject extends BaseValueObject<Primitives> {

  constructor(props: Primitives) {
    super({value: props});
  }

  protected validate(props: DomainPrimitive<Primitives>): void {
    // For this simple test, just check if the prop is a string
    if (typeof props.value !== 'number') {
      throw new Error('Invalid prop');
    }
  }
}

describe('BaseValueObject', () => {
  describe('constructor', () => {
    it('should construct an object correctly with valid props', () => {
      expect(() => new StringValueObject('a valid string!')).not.toThrow();
    });

    it('should throw an error if props are invalid', () => {
      expect(() => new NumberValueObject(777)).not.toThrow();
    });
  });

  describe('isValueObject', () => {
    it('should return true if the object is a BaseValueObject instance', () => {
      const testObj = new StringValueObject('a valid string!');
      expect(BaseValueObject.isValueObject(testObj)).toBeTruthy();
    });

    it('should return false if the object is not a BaseValueObject instance', () => {
      const notValueObject = {value: 'test'};
      expect(BaseValueObject.isValueObject(notValueObject)).toBeFalsy();
    });
  });

  describe('unpack', () => {
    it('should unpack the value object correctly', () => {
      const testObj = new StringValueObject('test');
      expect(testObj.unpack()).toEqual('test');
    });

  });
});
