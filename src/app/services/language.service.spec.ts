import { TestBed } from '@angular/core/testing';
import { languages } from './language.service';

describe('LanguageService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(languages).toBeTruthy();
  });

  describe('LanguageService', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({});
    });

    it('should have a list of languages', () => {
      expect(languages).toBeTruthy();
      expect(Array.isArray(languages)).toBe(true);
      expect(languages.length).toBeGreaterThan(0);
    });

    it('should have languages with code, name, and nativeName properties', () => {
      languages.forEach(language => {
        expect(language.code).toBeDefined();
        expect(language.name).toBeDefined();
        expect(language.nativeName).toBeDefined();
      });
    });

    it('should have unique language codes', () => {
      const codes = languages.map(language => language.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });
  });
});
