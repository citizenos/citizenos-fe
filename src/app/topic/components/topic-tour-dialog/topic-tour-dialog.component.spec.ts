import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicTourDialogComponent } from './topic-tour-dialog.component';

describe('TopicTourDialogComponent', () => {
  let component: TopicTourDialogComponent;
  let fixture: ComponentFixture<TopicTourDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicTourDialogComponent]
    });
    fixture = TestBed.createComponent(TopicTourDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
