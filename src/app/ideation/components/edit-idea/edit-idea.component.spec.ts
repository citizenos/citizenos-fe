import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIdeaComponent } from './edit-idea.component';

describe('EditIdeaComponent', () => {
  let component: EditIdeaComponent;
  let fixture: ComponentFixture<EditIdeaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditIdeaComponent]
    });
    fixture = TestBed.createComponent(EditIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
