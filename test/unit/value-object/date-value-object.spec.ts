import { DateValueObject } from "../../../src";
import { ArgumentInvalidError } from "../../../src/errors";

describe('DateValueObject', () => {
  describe('constructor', () => {
    it('should construct an object correctly with a valid date string', () => {
      expect(() => new DateValueObject('2023-06-28')).not.toThrow();
    });

    it('should construct an object correctly with a valid timestamp', () => {
      expect(() => new DateValueObject(Date.now())).not.toThrow();
    });

    it('should throw an error if the date is invalid', () => {
      expect(() => new DateValueObject('invalid-date')).toThrow(ArgumentInvalidError);
      expect(() => new DateValueObject(NaN)).toThrow(ArgumentInvalidError);
    });
  });

  describe('value getter', () => {
    it('should return the correct date', () => {
      const testObj = new DateValueObject('2023-06-28');
      expect(testObj.value).toEqual(new Date('2023-06-28'));
    });
  });

  describe('now', () => {
    it('should return the current date', () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      const testObj = DateValueObject.now();
      expect(testObj.value).toEqual(new Date(now));
    });
  });
});
