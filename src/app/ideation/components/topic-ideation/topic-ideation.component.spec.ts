import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicIdeationComponent } from './topic-ideation.component';

describe('TopicIdeationComponent', () => {
  let component: TopicIdeationComponent;
  let fixture: ComponentFixture<TopicIdeationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicIdeationComponent]
    });
    fixture = TestBed.createComponent(TopicIdeationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
