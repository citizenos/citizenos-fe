import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosToggleComponent } from './cos-toggle.component';

describe('CosToggleComponent', () => {
  let component: CosToggleComponent;
  let fixture: ComponentFixture<CosToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CosToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CosToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
