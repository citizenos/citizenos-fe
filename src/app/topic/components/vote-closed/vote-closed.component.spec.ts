import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteClosedComponent } from './vote-closed.component';

describe('VoteClosedComponent', () => {
  let component: VoteClosedComponent;
  let fixture: ComponentFixture<VoteClosedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoteClosedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
