import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicSettingsDisabledDialogComponent } from './topic-settings-disabled-dialog.component';

describe('TopicSettingsDisabledDialogComponent', () => {
  let component: TopicSettingsDisabledDialogComponent;
  let fixture: ComponentFixture<TopicSettingsDisabledDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicSettingsDisabledDialogComponent]
    });
    fixture = TestBed.createComponent(TopicSettingsDisabledDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
