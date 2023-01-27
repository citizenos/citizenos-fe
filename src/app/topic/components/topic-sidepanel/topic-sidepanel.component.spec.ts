import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicSidepanelComponent } from './topic-sidepanel.component';

describe('TopicSidepanelComponent', () => {
  let component: TopicSidepanelComponent;
  let fixture: ComponentFixture<TopicSidepanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicSidepanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicSidepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
