import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGroupTopicComponent } from './create-group-topic.component';

describe('CreateGroupTopicComponent', () => {
  let component: CreateGroupTopicComponent;
  let fixture: ComponentFixture<CreateGroupTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGroupTopicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGroupTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
