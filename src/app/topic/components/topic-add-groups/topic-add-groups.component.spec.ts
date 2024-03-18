import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicAddGroupsComponent } from './topic-add-groups.component';

describe('TopicAddGroupsComponent', () => {
  let component: TopicAddGroupsComponent;
  let fixture: ComponentFixture<TopicAddGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicAddGroupsComponent]
    });
    fixture = TestBed.createComponent(TopicAddGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
