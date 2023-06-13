import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesButtonComponent } from './activities-button.component';

describe('ActivitiesButtonComponent', () => {
  let component: ActivitiesButtonComponent;
  let fixture: ComponentFixture<ActivitiesButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivitiesButtonComponent]
    });
    fixture = TestBed.createComponent(ActivitiesButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
