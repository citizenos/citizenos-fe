import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicShareComponent } from './topic-share.component';

describe('TopicShareComponent', () => {
  let component: TopicShareComponent;
  let fixture: ComponentFixture<TopicShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicShareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
