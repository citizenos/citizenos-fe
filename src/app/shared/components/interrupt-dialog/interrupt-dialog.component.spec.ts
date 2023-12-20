import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterruptDialogComponent } from './interrupt-dialog.component';

describe('InterruptDialogComponent', () => {
  let component: InterruptDialogComponent;
  let fixture: ComponentFixture<InterruptDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterruptDialogComponent]
    });
    fixture = TestBed.createComponent(InterruptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
