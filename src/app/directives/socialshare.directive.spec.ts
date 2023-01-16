import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialshareDirective } from './socialshare.directive';

describe('SocialshareComponent', () => {
  let component: SocialshareDirective;
  let fixture: ComponentFixture<SocialshareDirective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialshareDirective ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialshareDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
