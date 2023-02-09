import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGroupComponent } from './my-group.component';

describe('MyGroupComponent', () => {
  let component: MyGroupComponent;
  let fixture: ComponentFixture<MyGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
