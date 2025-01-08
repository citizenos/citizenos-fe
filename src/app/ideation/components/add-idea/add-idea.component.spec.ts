import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIdeaComponent } from './add-idea.component';

describe('AddIdeaComponent', () => {
  let component: AddIdeaComponent;
  let fixture: ComponentFixture<AddIdeaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddIdeaComponent]
    });
    fixture = TestBed.createComponent(AddIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
