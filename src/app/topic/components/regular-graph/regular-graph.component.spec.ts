import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularGraphComponent } from './regular-graph.component';

describe('RegularGraphComponent', () => {
  let component: RegularGraphComponent;
  let fixture: ComponentFixture<RegularGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegularGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
