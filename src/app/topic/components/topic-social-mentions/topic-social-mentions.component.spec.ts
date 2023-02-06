import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicSocialMentionsComponent } from './topic-social-mentions.component';

describe('TopicSocialMentionsComponent', () => {
  let component: TopicSocialMentionsComponent;
  let fixture: ComponentFixture<TopicSocialMentionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicSocialMentionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicSocialMentionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
