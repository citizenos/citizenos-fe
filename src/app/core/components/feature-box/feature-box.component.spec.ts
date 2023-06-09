import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureBoxComponent } from './feature-box.component';

describe('FeatureBoxComponent', () => {
  let component: FeatureBoxComponent;
  let fixture: ComponentFixture<FeatureBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeatureBoxComponent]
    });
    fixture = TestBed.createComponent(FeatureBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
