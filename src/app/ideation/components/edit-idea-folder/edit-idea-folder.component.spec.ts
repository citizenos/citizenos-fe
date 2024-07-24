import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIdeaFolderComponent } from './edit-idea-folder.component';

describe('EditIdeaFolderComponent', () => {
  let component: EditIdeaFolderComponent;
  let fixture: ComponentFixture<EditIdeaFolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditIdeaFolderComponent]
    });
    fixture = TestBed.createComponent(EditIdeaFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
