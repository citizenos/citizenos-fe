import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRequestTopicsHandlerComponent } from './group-request-topics-handler.component';

describe('GroupRequestTopicsHandlerComponent', () => {
  let component: GroupRequestTopicsHandlerComponent;
  let fixture: ComponentFixture<GroupRequestTopicsHandlerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupRequestTopicsHandlerComponent]
    });
    fixture = TestBed.createComponent(GroupRequestTopicsHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
