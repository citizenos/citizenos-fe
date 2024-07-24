import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaReportComponent } from './idea-report.component';

describe('IdeaReportComponent', () => {
  let component: IdeaReportComponent;
  let fixture: ComponentFixture<IdeaReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeaReportComponent]
    });
    fixture = TestBed.createComponent(IdeaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
