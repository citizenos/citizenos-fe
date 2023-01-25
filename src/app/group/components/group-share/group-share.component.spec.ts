import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupShareComponent } from './group-share.component';

describe('GroupShareComponent', () => {
  let component: GroupShareComponent;
  let fixture: ComponentFixture<GroupShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupShareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
