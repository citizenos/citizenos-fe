import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAddTopicsComponent } from './group-add-topics.component';

describe('GroupAddTopicsComponent', () => {
  let component: GroupAddTopicsComponent;
  let fixture: ComponentFixture<GroupAddTopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupAddTopicsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAddTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
