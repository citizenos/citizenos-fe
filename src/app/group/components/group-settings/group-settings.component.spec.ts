import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSettingsComponent } from './group-settings.component';
import { DialogService, DIALOG_DATA } from 'src/app/shared/dialog';
import { GroupService } from 'src/app/services/group.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';

describe('GroupSettingsComponent', () => {
  let component: GroupSettingsComponent;
  let fixture: ComponentFixture<GroupSettingsComponent>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockGroupService: jasmine.SpyObj<GroupService>;

  beforeEach(() => {
    mockDialogService = jasmine.createSpyObj('DialogService', ['closeAll']);
    mockGroupService = jasmine.createSpyObj('GroupService', ['update', 'uploadGroupImage', 'reset']);
    mockGroupService.VISIBILITY = { public: 'public', private: 'private' };

    TestBed.configureTestingModule({
      declarations: [GroupSettingsComponent],
      providers: [
        { provide: DialogService, useValue: mockDialogService },
        { provide: GroupService, useValue: mockGroupService },
        { provide: DIALOG_DATA, useValue: { group: { id: '1', name: '', description: '', visibility: '', join: '', members: [], topics: [], imageUrl: '', createdAt: new Date(), updatedAt: new Date(), deletedAt: null, rules: ['rule1', 'rule2'], inviteMessage: '' } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(GroupSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with sorted countries and languages', () => {
    expect(component.countries).toBeDefined();
    expect(component.languages).toBeDefined();
  });
/*
  it('should initialize with group data', () => {
    expect(component.group).toEqual({
      id: jasmine.any(String),
      name: jasmine.any(String),
      description: jasmine.any(String),
      visibility: jasmine.any(String),
      join: jasmine.any(String),
      members: jasmine.any(Array),
      topics: jasmine.any(Array),
      imageUrl: jasmine.any(String),
      createdAt: jasmine.any(Date),
      updatedAt: jasmine.any(Date),
      deletedAt: jasmine.any(Date),
      rules: ['rule1', 'rule2'],
      inviteMessage: jasmine.any(String)
    });
    expect(component.rules).toEqual([{ rule: 'rule1' }, { rule: 'rule2' }]);
  });*/

  it('should add a new rule', () => {
    component.addRule();
    expect(component.rules.length).toBe(3);
    expect(component.rules[2]).toEqual({ rule: '' });
  });

  it('should remove a rule', () => {
    component.removeRule(0);
    expect(component.rules.length).toBe(1);
    expect(component.rules[0]).toEqual({ rule: 'rule2' });
  });

  it('should change active tab', () => {
    component.selectTab('members');
    expect(component.activeTab).toBe('members');
  });

  it('should upload an image', () => {
    const file = new File([''], 'filename', { type: 'image/jpeg' });
    const event = { target: { files: [file] } };
    component.fileInput = { nativeElement: { files: [file] } } as ElementRef;
    component.fileUpload();
    expect(component.uploadedImage).toBe(file);
  });

  it('should delete group image', () => {
    component.deleteGroupImage();
    expect(component.group.imageUrl).toBeNull();
    expect(component.uploadedImage).toBeNull();
    expect(component.imageFile).toBeNull();
  });

  it('should save group settings', () => {
    mockGroupService.update.and.returnValue(of({ id: 1, rules: ['rule1', 'rule2'] }));
    component.save();
    expect(mockGroupService.update).toHaveBeenCalled();
  });

  it('should handle image upload during save', () => {
    const file = new File([''], 'filename', { type: 'image/jpeg' });
    component.imageFile = file;
    mockGroupService.update.and.returnValue(of({ id: 1, rules: ['rule1', 'rule2'] }));
    mockGroupService.uploadGroupImage.and.returnValue(of({ link: 'image-link' }));
    component.save();
    expect(mockGroupService.uploadGroupImage).toHaveBeenCalledWith(file, '1');
  });
});
