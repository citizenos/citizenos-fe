import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicRequestsComponent } from './topic-requests.component';

describe('TopicRequestsComponent', () => {
  let component: TopicRequestsComponent;
  let fixture: ComponentFixture<TopicRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicRequestsComponent]
    });
    fixture = TestBed.createComponent(TopicRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
