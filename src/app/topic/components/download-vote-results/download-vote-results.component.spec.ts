import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadVoteResultsComponent } from './download-vote-results.component';

describe('DownloadVoteResultsComponent', () => {
  let component: DownloadVoteResultsComponent;
  let fixture: ComponentFixture<DownloadVoteResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadVoteResultsComponent]
    });
    fixture = TestBed.createComponent(DownloadVoteResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
