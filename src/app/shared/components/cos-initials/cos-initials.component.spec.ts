import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosInitialsComponent } from './cos-initials.component';

describe('CosInitialsComponent', () => {
  let component: CosInitialsComponent;
  let fixture: ComponentFixture<CosInitialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CosInitialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CosInitialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
