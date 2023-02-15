import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigGraphComponent } from './big-graph.component';

describe('BigGraphComponent', () => {
  let component: BigGraphComponent;
  let fixture: ComponentFixture<BigGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BigGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BigGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
