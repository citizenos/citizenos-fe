import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteCreateComponent } from './vote-create.component';

describe('VoteCreateComponent', () => {
  let component: VoteCreateComponent;
  let fixture: ComponentFixture<VoteCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoteCreateComponent]
    });
    fixture = TestBed.createComponent(VoteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
