import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicgroupboxComponent } from './publicgroupbox.component';

describe('PublicgroupboxComponent', () => {
  let component: PublicgroupboxComponent;
  let fixture: ComponentFixture<PublicgroupboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicgroupboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicgroupboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
