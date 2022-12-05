import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTopicComponent } from './my-topic.component';

describe('MyTopicComponent', () => {
  let component: MyTopicComponent;
  let fixture: ComponentFixture<MyTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTopicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
