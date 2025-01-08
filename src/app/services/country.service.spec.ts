import { TestBed } from '@angular/core/testing';

import { countries } from './country.service';

describe('CountryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
  });

  describe('CountryService', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: []
      });
    });

    it('should be created', () => {
      expect(countries).toBeTruthy();
    });

    it('should contain Algeria with iso2 code "DZ"', () => {
      const algeria = countries.find(country => country.iso2 === 'DZ');
      expect(algeria).toBeTruthy();
      expect(algeria?.name).toBe('Algeria');
    });
  });
});
