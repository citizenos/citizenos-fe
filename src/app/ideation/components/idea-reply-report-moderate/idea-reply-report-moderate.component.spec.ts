import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaReplyReportModerateComponent } from './idea-reply-report-moderate.component';

describe('IdeaReplyReportModerateComponent', () => {
  let component: IdeaReplyReportModerateComponent;
  let fixture: ComponentFixture<IdeaReplyReportModerateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeaReplyReportModerateComponent]
    });
    fixture = TestBed.createComponent(IdeaReplyReportModerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
