import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIdeationDeadlineComponent } from './edit-ideation-deadline.component';

describe('EditIdeationDeadlineComponent', () => {
  let component: EditIdeationDeadlineComponent;
  let fixture: ComponentFixture<EditIdeationDeadlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditIdeationDeadlineComponent]
    });
    fixture = TestBed.createComponent(EditIdeationDeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
