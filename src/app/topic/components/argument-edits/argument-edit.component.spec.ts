import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgumentEditComponent } from './argument-edits.component';

describe('ArgumentEditComponent', () => {
  let component: ArgumentEditComponent;
  let fixture: ComponentFixture<ArgumentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArgumentEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArgumentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
