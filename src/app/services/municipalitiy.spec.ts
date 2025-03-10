import { TestBed } from '@angular/core/testing';
import { municipalities } from './municipalitiy.service';

describe('MunicipalitiyService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(municipalities).toBeTruthy();
  });

  it('should have municipalitiy with name', () => {
    municipalities.forEach(language => {
      expect(language.name).toBeDefined();
    });
  });
});
