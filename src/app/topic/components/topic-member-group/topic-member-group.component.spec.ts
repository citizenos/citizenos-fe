import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicMemberGroupComponent } from './topic-member-group.component';

describe('TopicMemberGroupComponent', () => {
  let component: TopicMemberGroupComponent;
  let fixture: ComponentFixture<TopicMemberGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicMemberGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicMemberGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
