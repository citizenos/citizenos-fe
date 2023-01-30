import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgumentReplyComponent } from './argument-reply.component';

describe('ArgumentReplyComponent', () => {
  let component: ArgumentReplyComponent;
  let fixture: ComponentFixture<ArgumentReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArgumentReplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArgumentReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
