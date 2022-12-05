import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryboxComponent } from './categorybox.component';

describe('CategoryboxComponent', () => {
  let component: CategoryboxComponent;
  let fixture: ComponentFixture<CategoryboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
