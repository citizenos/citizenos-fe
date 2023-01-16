import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSettingsDialogComponent } from './group-settings-dialog.component';

describe('GroupSettingsDialogComponent', () => {
  let component: GroupSettingsDialogComponent;
  let fixture: ComponentFixture<GroupSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupSettingsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
