import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicMilestonesComponent } from './topic-milestones.component';

describe('TopicMilestonesComponent', () => {
  let component: TopicMilestonesComponent;
  let fixture: ComponentFixture<TopicMilestonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicMilestonesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicMilestonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
