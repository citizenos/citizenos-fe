import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostArgumentComponent } from './post-argument.component';

describe('PostArgumentComponent', () => {
  let component: PostArgumentComponent;
  let fixture: ComponentFixture<PostArgumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostArgumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostArgumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
