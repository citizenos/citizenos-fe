import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteEditorsComponent } from './invite-editors.component';

describe('InviteEditorsComponent', () => {
  let component: InviteEditorsComponent;
  let fixture: ComponentFixture<InviteEditorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InviteEditorsComponent]
    });
    fixture = TestBed.createComponent(InviteEditorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
