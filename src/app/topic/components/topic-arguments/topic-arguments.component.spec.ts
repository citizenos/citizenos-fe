import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicArgumentsComponent } from './topic-arguments.component';

describe('TopicArgumentsComponent', () => {
  let component: TopicArgumentsComponent;
  let fixture: ComponentFixture<TopicArgumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicArgumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicArgumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
