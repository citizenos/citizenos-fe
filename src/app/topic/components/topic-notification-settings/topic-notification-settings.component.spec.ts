import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicNotificationSettingsComponent } from './topic-notification-settings.component';

describe('TopicNotificationSettingsComponent', () => {
  let component: TopicNotificationSettingsComponent;
  let fixture: ComponentFixture<TopicNotificationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicNotificationSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicNotificationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
