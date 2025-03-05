import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseWithoutSavingDialogComponent } from './close-without-saving-dialog.component';

describe('CloseWithoutSavingDialogComponent', () => {
  let component: CloseWithoutSavingDialogComponent;
  let fixture: ComponentFixture<CloseWithoutSavingDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CloseWithoutSavingDialogComponent],
    });
    fixture = TestBed.createComponent(CloseWithoutSavingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
