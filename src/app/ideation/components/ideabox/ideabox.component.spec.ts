import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaboxComponent } from './ideabox.component';

describe('IdeaboxComponent', () => {
  let component: IdeaboxComponent;
  let fixture: ComponentFixture<IdeaboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeaboxComponent]
    });
    fixture = TestBed.createComponent(IdeaboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
