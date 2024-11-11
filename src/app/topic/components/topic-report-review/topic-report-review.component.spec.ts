import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopicReportReviewComponent } from './topic-report-review.component';
import { TopicReportService } from 'src/app/services/topic-report.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

describe('TopicReportReviewComponent', () => {
  let component: TopicReportReviewComponent;
  let fixture: ComponentFixture<TopicReportReviewComponent>;
  let mockTopicReportService: jasmine.SpyObj<TopicReportService>;

  beforeEach(async () => {
    mockTopicReportService = jasmine.createSpyObj('TopicReportService', ['review']);

    await TestBed.configureTestingModule({
      declarations: [TopicReportReviewComponent],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot() // Add TranslateModule
      ],
      providers: [
        { provide: TopicReportService, useValue: mockTopicReportService },
        TranslateService // Provide TranslateService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicReportReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty text control', () => {
    expect(component.review).toBeInstanceOf(UntypedFormGroup);
    expect(component.review.controls['text']).toBeInstanceOf(UntypedFormControl);
    expect(component.review.controls['text'].value).toBe('');
  });

  it('should call review method and set isLoading to true', () => {
    mockTopicReportService.review.and.returnValue(of({}));

    component.review.controls['text'].setValue('Test review');
    component.doReview();

    expect(component.isLoading).toBeTrue();
    expect(mockTopicReportService.review).toHaveBeenCalledWith({
      topicId: 1,
      id: 1,
      text: 'Test review'
    });
  });

  it('should handle error when review fails', () => {
    const errorResponse = { errors: 'Some error' };
    mockTopicReportService.review.and.returnValue(throwError(errorResponse));

    component.review.controls['text'].setValue('Test review');
    component.doReview();

    expect(component.isLoading).toBeFalse();
    expect(component.errors).toEqual(errorResponse.errors);
  });
});
