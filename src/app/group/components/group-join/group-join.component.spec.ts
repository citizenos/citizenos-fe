import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupJoinComponent } from './group-join.component';

describe('GroupJoinComponent', () => {
  let component: GroupJoinComponent;
  let fixture: ComponentFixture<GroupJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupJoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
