import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicMemberUserComponent } from './topic-member-user.component';

describe('TopicMemberUserComponent', () => {
  let component: TopicMemberUserComponent;
  let fixture: ComponentFixture<TopicMemberUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicMemberUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicMemberUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
