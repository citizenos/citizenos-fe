import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicAttachmentsComponent } from './topic-attachments.component';

describe('TopicAttachmentsComponent', () => {
  let component: TopicAttachmentsComponent;
  let fixture: ComponentFixture<TopicAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicAttachmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
