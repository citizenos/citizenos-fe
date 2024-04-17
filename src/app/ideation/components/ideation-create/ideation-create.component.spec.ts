import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeationCreateComponent } from './ideation-create.component';

describe('IdeationCreateComponent', () => {
  let component: IdeationCreateComponent;
  let fixture: ComponentFixture<IdeationCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeationCreateComponent]
    });
    fixture = TestBed.createComponent(IdeationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
