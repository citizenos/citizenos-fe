import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaReactionsComponent } from './idea-reactions.component';

describe('IdeaReactionsComponent', () => {
  let component: IdeaReactionsComponent;
  let fixture: ComponentFixture<IdeaReactionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeaReactionsComponent]
    });
    fixture = TestBed.createComponent(IdeaReactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
