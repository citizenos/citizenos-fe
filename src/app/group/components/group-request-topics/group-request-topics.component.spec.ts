import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRequestTopicsComponent } from './group-request-topics.component';

describe('GroupRequestTopicsComponent', () => {
  let component: GroupRequestTopicsComponent;
  let fixture: ComponentFixture<GroupRequestTopicsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupRequestTopicsComponent]
    });
    fixture = TestBed.createComponent(GroupRequestTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
