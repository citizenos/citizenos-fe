import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicEditDisabledDialogComponent } from './topic-edit-disabled-dialog.component';

describe('TopicEditDisabledDialogComponent', () => {
  let component: TopicEditDisabledDialogComponent;
  let fixture: ComponentFixture<TopicEditDisabledDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicEditDisabledDialogComponent]
    });
    fixture = TestBed.createComponent(TopicEditDisabledDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
