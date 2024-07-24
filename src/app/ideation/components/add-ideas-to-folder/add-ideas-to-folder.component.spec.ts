import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIdeasToFolderComponent } from './add-ideas-to-folder.component';

describe('AddIdeasToFolderComponent', () => {
  let component: AddIdeasToFolderComponent;
  let fixture: ComponentFixture<AddIdeasToFolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddIdeasToFolderComponent]
    });
    fixture = TestBed.createComponent(AddIdeasToFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
