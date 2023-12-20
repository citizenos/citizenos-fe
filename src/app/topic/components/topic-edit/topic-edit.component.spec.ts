import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicEditComponent } from './topic-edit.component';

describe('TopicEditComponent', () => {
  let component: TopicEditComponent;
  let fixture: ComponentFixture<TopicEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicEditComponent]
    });
    fixture = TestBed.createComponent(TopicEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
