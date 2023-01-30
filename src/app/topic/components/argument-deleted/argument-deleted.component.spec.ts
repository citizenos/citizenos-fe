import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgumentDeletedComponent } from './argument-deleted.component';

describe('ArgumentDeletedComponent', () => {
  let component: ArgumentDeletedComponent;
  let fixture: ComponentFixture<ArgumentDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArgumentDeletedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArgumentDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
