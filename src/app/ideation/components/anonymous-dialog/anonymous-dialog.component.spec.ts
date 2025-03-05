import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousDialogComponent } from './anonymous-dialog.component';

describe('InterruptDialogComponent', () => {
  let component: AnonymousDialogComponent;
  let fixture: ComponentFixture<AnonymousDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnonymousDialogComponent],
    });
    fixture = TestBed.createComponent(AnonymousDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
