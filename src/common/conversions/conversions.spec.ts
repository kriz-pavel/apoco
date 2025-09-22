import {
  convertCmToMetrsString,
  convertGramsToKilogramsString,
  convertIdToPokedexIdString,
  convertTextToSlug,
} from './conversions';

describe('Conversions', () => {
  describe('convertIdToPokedexIdString', () => {
    it('should convert single digit numbers to 3-digit padded strings', () => {
      expect(convertIdToPokedexIdString(1)).toBe('001');
      expect(convertIdToPokedexIdString(5)).toBe('005');
      expect(convertIdToPokedexIdString(9)).toBe('009');
    });

    it('should convert double digit numbers to 3-digit padded strings', () => {
      expect(convertIdToPokedexIdString(10)).toBe('010');
      expect(convertIdToPokedexIdString(25)).toBe('025');
      expect(convertIdToPokedexIdString(99)).toBe('099');
    });

    it('should convert triple digit numbers to 3-digit strings', () => {
      expect(convertIdToPokedexIdString(100)).toBe('100');
      expect(convertIdToPokedexIdString(150)).toBe('150');
      expect(convertIdToPokedexIdString(999)).toBe('999');
    });

    it('should handle numbers with more than 3 digits', () => {
      expect(convertIdToPokedexIdString(1000)).toBe('1000');
      expect(convertIdToPokedexIdString(1234)).toBe('1234');
    });

    it('should handle zero', () => {
      expect(convertIdToPokedexIdString(0)).toBe('000');
    });

    it('should throw an error for negative numbers', () => {
      expect(() => convertIdToPokedexIdString(-1)).toThrow();
    });
  });

  describe('convertTextToSlug', () => {
    it('should convert basic text to lowercase slug', () => {
      expect(convertTextToSlug('Pokemon')).toBe('pokemon');
      expect(convertTextToSlug('Bulbasaur')).toBe('bulbasaur');
      expect(convertTextToSlug('PIKACHU')).toBe('pikachu');
    });

    it('should replace spaces with hyphens', () => {
      expect(convertTextToSlug('Mr. Mime')).toBe('mr-mime');
      expect(convertTextToSlug('Pokemon Type')).toBe('pokemon-type');
      expect(convertTextToSlug('Fire Water Electric')).toBe(
        'fire-water-electric',
      );
    });

    it('should remove special characters', () => {
      expect(convertTextToSlug('Nidoran♀')).toBe('nidoran');
      expect(convertTextToSlug('Nidoran♂')).toBe('nidoran');
      expect(convertTextToSlug('Type: Normal')).toBe('type-normal');
      expect(convertTextToSlug('Ho-Oh!')).toBe('hooh');
    });

    it('should handle multiple spaces', () => {
      expect(convertTextToSlug('Pokemon   Type   Name')).toBe(
        'pokemon-type-name',
      );
      expect(convertTextToSlug('Fire  Water')).toBe('fire-water');
    });

    it('should handle mixed case and special characters', () => {
      expect(convertTextToSlug("Farfetch'd")).toBe('farfetchd');
      expect(convertTextToSlug('Type-0')).toBe('type0');
      expect(convertTextToSlug('100% Power')).toBe('100-power');
    });

    it('should handle empty string', () => {
      expect(convertTextToSlug('')).toBe('');
    });

    it('should handle strings with only special characters', () => {
      expect(convertTextToSlug('!!!')).toBe('');
      expect(convertTextToSlug('###')).toBe('');
    });

    it('should handle strings with only spaces', () => {
      expect(convertTextToSlug('   ')).toBe('-');
    });

    it('should handle numbers and letters', () => {
      expect(convertTextToSlug('Pokemon Go 2024')).toBe('pokemon-go-2024');
      expect(convertTextToSlug('Generation 1')).toBe('generation-1');
    });

    it('should handle accented characters', () => {
      expect(convertTextToSlug('Pokémon')).toBe('pokemon');
      expect(convertTextToSlug('Café')).toBe('cafe');
    });
  });

  describe('convertGramsToKilogramsString', () => {
    it('should convert grams to kilograms with kg suffix', () => {
      expect(convertGramsToKilogramsString(1000)).toBe('1kg');
      expect(convertGramsToKilogramsString(2500)).toBe('2.5kg');
      expect(convertGramsToKilogramsString(7500)).toBe('7.5kg');
    });

    it('should handle small values (less than 1kg)', () => {
      expect(convertGramsToKilogramsString(500)).toBe('0.5kg');
      expect(convertGramsToKilogramsString(250)).toBe('0.25kg');
      expect(convertGramsToKilogramsString(100)).toBe('0.1kg');
    });

    it('should handle zero', () => {
      expect(convertGramsToKilogramsString(0)).toBe('0kg');
    });

    it('should handle negative values', () => {
      expect(convertGramsToKilogramsString(-1000)).toBe('-1kg');
      expect(convertGramsToKilogramsString(-500)).toBe('-0.5kg');
    });
  });

  describe('convertCmToMetrsString', () => {
    it('should convert centimeters to meters with m suffix', () => {
      expect(convertCmToMetrsString(100)).toBe('1m');
      expect(convertCmToMetrsString(200)).toBe('2m');
      expect(convertCmToMetrsString(150)).toBe('1.5m');
    });

    it('should handle small values (less than 1m)', () => {
      expect(convertCmToMetrsString(50)).toBe('0.5m');
      expect(convertCmToMetrsString(25)).toBe('0.25m');
      expect(convertCmToMetrsString(10)).toBe('0.1m');
    });

    it('should handle zero', () => {
      expect(convertCmToMetrsString(0)).toBe('0m');
    });

    it('should handle negative values', () => {
      expect(convertCmToMetrsString(-100)).toBe('-1m');
      expect(convertCmToMetrsString(-50)).toBe('-0.5m');
    });
  });
});
