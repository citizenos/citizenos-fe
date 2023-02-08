import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectEidComponent } from './connect-eid.component';

describe('ConnectEidComponent', () => {
  let component: ConnectEidComponent;
  let fixture: ComponentFixture<ConnectEidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectEidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectEidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
