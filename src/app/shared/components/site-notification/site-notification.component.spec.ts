import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteNotificationComponent } from './site-notification.component';

describe('SiteNotificationComponent', () => {
  let component: SiteNotificationComponent;
  let fixture: ComponentFixture<SiteNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
