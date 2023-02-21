import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicJoinComponent } from './topic-join.component';

describe('TopicJoinComponent', () => {
  let component: TopicJoinComponent;
  let fixture: ComponentFixture<TopicJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicJoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
