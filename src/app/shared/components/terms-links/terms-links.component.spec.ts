import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsLinksComponent } from './terms-links.component';

describe('TermsLinksComponent', () => {
  let component: TermsLinksComponent;
  let fixture: ComponentFixture<TermsLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsLinksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
