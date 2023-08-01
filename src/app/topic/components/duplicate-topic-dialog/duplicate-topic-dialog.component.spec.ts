import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateTopicDialogComponent } from './duplicate-topic-dialog.component';

describe('DuplicateTopicDialogComponent', () => {
  let component: DuplicateTopicDialogComponent;
  let fixture: ComponentFixture<DuplicateTopicDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DuplicateTopicDialogComponent]
    });
    fixture = TestBed.createComponent(DuplicateTopicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
