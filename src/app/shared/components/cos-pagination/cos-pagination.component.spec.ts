import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosPaginationComponent } from './cos-pagination.component';

describe('CosPaginationComponent', () => {
  let component: CosPaginationComponent;
  let fixture: ComponentFixture<CosPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CosPaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CosPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
