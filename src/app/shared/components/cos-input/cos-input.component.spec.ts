import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosInputComponent } from './cos-input.component';

describe('CosInputComponent', () => {
  let component: CosInputComponent;
  let fixture: ComponentFixture<CosInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CosInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CosInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
