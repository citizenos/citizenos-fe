import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicAttachmentsDialogComponent } from './topic-attachments-dialog.component';

describe('TopicAttachmentsDialogComponent', () => {
  let component: TopicAttachmentsDialogComponent;
  let fixture: ComponentFixture<TopicAttachmentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicAttachmentsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicAttachmentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
