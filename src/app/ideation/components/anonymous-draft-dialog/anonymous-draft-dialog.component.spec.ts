import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousDraftDialogComponent } from './anonymous-draft-dialog.component';

describe('AnonymousDraftDialogComponent', () => {
  let component: AnonymousDraftDialogComponent;
  let fixture: ComponentFixture<AnonymousDraftDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnonymousDraftDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnonymousDraftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
