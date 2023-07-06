
// Define a test implementation of the abstract class
import { DomainPrimitive, Id } from "../../../src";

class TestId extends Id {
  protected validate({ value }: DomainPrimitive<string>): void {
    if (value === 'sample_invalid_rule') {
      throw new Error('Invalid ID');
    }
    if (value === '') {
      throw new Error('Invalid ID');
    }
  }
}

describe('Id', () => {
  describe('constructor', () => {
    it('should construct an object correctly with a valid ID', () => {
      expect(() => new TestId('123')).not.toThrow();
    });

    it('should throw an error if the ID has an invalid rule', () => {
      expect(() => new TestId('sample_invalid_rule')).toThrow('Invalid ID');
    });

    it('should throw an error if the ID is empty', () => {
      expect(() => new TestId('')).toThrow('Invalid ID');
    });
  });

  describe('value getter', () => {
    it('should return the correct ID', () => {
      const testObj = new TestId('123');
      expect(testObj.value).toBe('123');
    });
  });

  // You can add more test cases according to your use cases
});
