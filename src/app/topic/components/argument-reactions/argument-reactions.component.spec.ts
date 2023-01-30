import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgumentReactionsComponent } from './argument-reactions.component';

describe('ArgumentReactionsComponent', () => {
  let component: ArgumentReactionsComponent;
  let fixture: ComponentFixture<ArgumentReactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArgumentReactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArgumentReactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
