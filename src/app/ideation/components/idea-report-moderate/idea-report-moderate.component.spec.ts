import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaReportModerateComponent } from './idea-report-moderate.component';

describe('IdeaReportModerateComponent', () => {
  let component: IdeaReportModerateComponent;
  let fixture: ComponentFixture<IdeaReportModerateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeaReportModerateComponent]
    });
    fixture = TestBed.createComponent(IdeaReportModerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
