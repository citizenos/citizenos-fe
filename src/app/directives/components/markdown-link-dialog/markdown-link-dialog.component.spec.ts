import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownLinkDialogComponent } from './markdown-link-dialog.component';

describe('MarkdownLinkDialogComponent', () => {
  let component: MarkdownLinkDialogComponent;
  let fixture: ComponentFixture<MarkdownLinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownLinkDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkdownLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
