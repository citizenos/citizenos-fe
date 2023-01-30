import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditArgumentComponent } from './edit-argument.component';

describe('EditArgumentComponent', () => {
  let component: EditArgumentComponent;
  let fixture: ComponentFixture<EditArgumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditArgumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditArgumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
