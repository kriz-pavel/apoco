import { checkExists, checkFound } from './preconditions';

describe('Preconditions', () => {
  describe('checkExists', () => {
    it('should return the value when it is defined and not null', () => {
      // Arrange
      const stringValue = 'test';
      const numberValue = 42;
      const objectValue = { key: 'value' };
      const arrayValue = [1, 2, 3];
      const booleanValue = true;
      const zeroValue = 0;
      const emptyStringValue = '';
      const falseValue = false;

      // Act & Assert
      expect(checkExists(stringValue, 'String should exist')).toBe(stringValue);
      expect(checkExists(numberValue, 'Number should exist')).toBe(numberValue);
      expect(checkExists(objectValue, 'Object should exist')).toBe(objectValue);
      expect(checkExists(arrayValue, 'Array should exist')).toBe(arrayValue);
      expect(checkExists(booleanValue, 'Boolean should exist')).toBe(
        booleanValue,
      );
      expect(checkExists(zeroValue, 'Zero should exist')).toBe(zeroValue);
      expect(checkExists(emptyStringValue, 'Empty string should exist')).toBe(
        emptyStringValue,
      );
      expect(checkExists(falseValue, 'False should exist')).toBe(falseValue);
    });

    it('should throw an error with the provided message when value is null or undefined', () => {
      // Arrange
      const errorMessage = 'Value cannot be null';

      // Act & Assert
      expect(() => checkExists(null, 'Value cannot be null')).toThrow(
        errorMessage,
      );
      expect(() => checkExists(undefined, 'Value cannot be undefined')).toThrow(
        errorMessage,
      );
    });

    it('should work with complex nested objects', () => {
      // Arrange
      const complexObject = {
        user: {
          id: 123,
          profile: {
            name: 'John Doe',
            settings: {
              theme: 'dark',
              notifications: true,
            },
          },
        },
        pokemons: [
          { name: 'Pikachu', type: 'Electric' },
          { name: 'Charizard', type: 'Fire' },
        ],
      };

      // Act & Assert
      const result = checkExists(complexObject, 'Complex object should exist');
      expect(result).toBe(complexObject);
      expect(result.user.profile.name).toBe('John Doe');
      expect(result.pokemons).toHaveLength(2);
    });
  });

  describe('checkFound', () => {
    it('should return the value when it is defined and not null', () => {
      // Arrange
      const value = 'test';

      // Act & Assert
      expect(checkFound(value, 'Value should exist')).toBe(value);
    });

    it('should throw an error with the provided message when value is null or undefined', () => {
      // Arrange
      const errorMessage = 'Value cannot be null';

      // Act & Assert
      expect(() => checkFound(null, 'Value cannot be null')).toThrow(
        errorMessage,
      );
      expect(() => checkFound(undefined, 'Value cannot be undefined')).toThrow(
        errorMessage,
      );
    });
  });
});
