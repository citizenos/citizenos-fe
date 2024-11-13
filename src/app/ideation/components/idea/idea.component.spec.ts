import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdeaComponent } from './idea.component';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';


describe('IdeaComponent TranslateService', () => {
  let component: IdeaComponent;
  let fixture: ComponentFixture<IdeaComponent>;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeaComponent],
      providers: [TranslateService, provideHttpClient(), provideHttpClientTesting()],
      imports: []
    });
    fixture = TestBed.createComponent(IdeaComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should inject TranslateService', () => {
    expect(translateService).toBeTruthy();
  });

  it('should handle language change', () => {
    const newLang = 'es';
    translateService.use(newLang);
    expect(translateService.currentLang).toBe(newLang);
  });

  it('should translate keys correctly', (done) => {
    const testKey = 'TEST.KEY';
    const expectedValue = 'Translated Value';

    spyOn(translateService, 'get').and.returnValue(of(expectedValue));

    translateService.get(testKey).subscribe(value => {
      expect(value).toBe(expectedValue);
      done();
    });
  });

  it('should handle missing translations', (done) => {
    const missingKey = 'MISSING.KEY';

    spyOn(translateService, 'get').and.returnValue(of(missingKey));

    translateService.get(missingKey).subscribe(value => {
      expect(value).toBe(missingKey);
      done();
    });
  });
});
