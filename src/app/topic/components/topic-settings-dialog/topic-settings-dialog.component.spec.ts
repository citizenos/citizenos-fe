import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicSettingsDialogComponent } from './topic-settings-dialog.component';

describe('TopicSettingsDialogComponent', () => {
  let component: TopicSettingsDialogComponent;
  let fixture: ComponentFixture<TopicSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicSettingsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
