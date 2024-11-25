import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicEditDisabledDialogComponent } from './topic-edit-disabled-dialog.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

describe('TopicEditDisabledDialogComponent', () => {
  let component: TopicEditDisabledDialogComponent;
  let fixture: ComponentFixture<TopicEditDisabledDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicEditDisabledDialogComponent],
      imports: [TranslateModule.forRoot(), TranslatePipe]
    });
    fixture = TestBed.createComponent(TopicEditDisabledDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
