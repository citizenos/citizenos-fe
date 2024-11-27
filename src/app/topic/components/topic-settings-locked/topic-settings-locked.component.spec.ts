import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicSettingsLockedComponent } from './topic-settings-locked.component';

describe('TopicSettingsLockedComponent', () => {
  let component: TopicSettingsLockedComponent;
  let fixture: ComponentFixture<TopicSettingsLockedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicSettingsLockedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicSettingsLockedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct selector', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-topic-settings-locked')).toBeTruthy();
  });

  it('should have the correct template URL', () => {
    const metadata = Reflect.getMetadata('annotations', TopicSettingsLockedComponent)[0];
    expect(metadata.templateUrl).toBe('./topic-settings-locked.component.html');
  });

  it('should have the correct style URL', () => {
    const metadata = Reflect.getMetadata('annotations', TopicSettingsLockedComponent)[0];
    expect(metadata.styleUrls).toContain('./topic-settings-locked.component.scss');
  });
});
