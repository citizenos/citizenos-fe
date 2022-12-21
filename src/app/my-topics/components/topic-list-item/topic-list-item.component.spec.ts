import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicListItemComponent } from './topic-list-item.component';

describe('TopicListItemComponent', () => {
  let component: TopicListItemComponent;
  let fixture: ComponentFixture<TopicListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
