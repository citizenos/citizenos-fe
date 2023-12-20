import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgumentWhyDialogComponent } from './argument-why-dialog.component';

describe('ArgumentWhyDialogComponent', () => {
  let component: ArgumentWhyDialogComponent;
  let fixture: ComponentFixture<ArgumentWhyDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArgumentWhyDialogComponent]
    });
    fixture = TestBed.createComponent(ArgumentWhyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
