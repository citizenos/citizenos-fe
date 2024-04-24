import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIdeaFolderComponent } from './create-idea-folder.component';

describe('CreateIdeaFolderComponent', () => {
  let component: CreateIdeaFolderComponent;
  let fixture: ComponentFixture<CreateIdeaFolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateIdeaFolderComponent]
    });
    fixture = TestBed.createComponent(CreateIdeaFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
