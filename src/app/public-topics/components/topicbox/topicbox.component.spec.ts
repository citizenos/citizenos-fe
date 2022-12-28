import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicboxComponent } from './topicbox.component';

describe('TopicboxComponent', () => {
  let component: TopicboxComponent;
  let fixture: ComponentFixture<TopicboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
