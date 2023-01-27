import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicSettingsComponent } from './topic-settings.component';

describe('TopicSettingsComponent', () => {
  let component: TopicSettingsComponent;
  let fixture: ComponentFixture<TopicSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
