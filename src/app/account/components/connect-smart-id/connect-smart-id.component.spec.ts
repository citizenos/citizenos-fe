import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectSmartIdComponent } from './connect-smart-id.component';

describe('ConnectSmartIdComponent', () => {
  let component: ConnectSmartIdComponent;
  let fixture: ComponentFixture<ConnectSmartIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectSmartIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectSmartIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
