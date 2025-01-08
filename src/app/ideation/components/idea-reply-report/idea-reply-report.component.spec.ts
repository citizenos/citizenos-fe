import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaReplyReportComponent } from './idea-reply-report.component';

describe('IdeaReplyReportComponent', () => {
  let component: IdeaReplyReportComponent;
  let fixture: ComponentFixture<IdeaReplyReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeaReplyReportComponent]
    });
    fixture = TestBed.createComponent(IdeaReplyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
