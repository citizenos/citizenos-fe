import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIdeaFolderComponent } from './add-idea-folder.component';

describe('AddIdeaFolderComponent', () => {
  let component: AddIdeaFolderComponent;
  let fixture: ComponentFixture<AddIdeaFolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddIdeaFolderComponent]
    });
    fixture = TestBed.createComponent(AddIdeaFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
