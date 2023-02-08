import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEidComponent } from './add-eid.component';

describe('AddEidComponent', () => {
  let component: AddEidComponent;
  let fixture: ComponentFixture<AddEidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
