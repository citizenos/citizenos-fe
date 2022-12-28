import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipDirective } from './tooltip';

describe('TooltipDirective', () => {
  let component: TooltipDirective;
  let fixture: ComponentFixture<TooltipDirective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TooltipDirective ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
