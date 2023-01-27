import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicTabsComponent } from './topic-tabs.component';

describe('TopicTabsComponent', () => {
  let component: TopicTabsComponent;
  let fixture: ComponentFixture<TopicTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
