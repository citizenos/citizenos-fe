import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupboxComponent } from './groupbox.component';

describe('GroupboxComponent', () => {
  let component: GroupboxComponent;
  let fixture: ComponentFixture<GroupboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
