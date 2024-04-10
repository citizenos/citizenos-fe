import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicOnboardingComponent } from './topic-onboarding.component';

describe('TopicOnboardingComponent', () => {
  let component: TopicOnboardingComponent;
  let fixture: ComponentFixture<TopicOnboardingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicOnboardingComponent]
    });
    fixture = TestBed.createComponent(TopicOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
