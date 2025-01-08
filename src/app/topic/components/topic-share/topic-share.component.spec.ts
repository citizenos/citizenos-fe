import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicShareComponent } from './topic-share.component';
import { DialogService } from 'src/app/shared/dialog';
import { TopicService } from '@services/topic.service';
import { TopicJoinService } from '@services/topic-join.service';
import { LocationService } from '@services/location.service';
import { AuthService } from '@services/auth.service';
import { of } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';


  describe('TopicShareComponent', () => {
    let component: TopicShareComponent;
    let fixture: ComponentFixture<TopicShareComponent>;
    let mockDialogService: jasmine.SpyObj<DialogService>;
    let mockTopicService: jasmine.SpyObj<TopicService>;
    let mockTopicJoinService: jasmine.SpyObj<TopicJoinService>;
    let mockLocationService: jasmine.SpyObj<LocationService>;
    let mockAuthService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
      mockDialogService = jasmine.createSpyObj('DialogService', ['open']);
      mockTopicService = jasmine.createSpyObj('TopicService', ['canUpdate', 'canShare', 'LEVELS']);
      mockTopicJoinService = jasmine.createSpyObj('TopicJoinService', ['save', 'update']);
      mockLocationService = jasmine.createSpyObj('LocationService', ['getAbsoluteUrl']);
      mockAuthService = jasmine.createSpyObj('AuthService', [], { user: of({ value: { id: 'userId' } }) });

      await TestBed.configureTestingModule({
        declarations: [TopicShareComponent, ConfirmDialogComponent],
        imports: [],
        providers: [
          { provide: DialogService, useValue: mockDialogService },
          { provide: TopicService, useValue: mockTopicService },
          { provide: TopicJoinService, useValue: mockTopicJoinService },
          { provide: LocationService, useValue: mockLocationService },
          { provide: AuthService, useValue: mockAuthService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TopicShareComponent);
      component = fixture.componentInstance;
      component.topic = { id: 'topicId', join: { level: 'read', token: 'token' } } as any;
      mockTopicService.LEVELS = { read: 'read', write: 'write' };
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize join and generate join URL on init', () => {
      spyOn(component, 'generateJoinUrl');
      component.ngOnInit();
      expect(component.join).toEqual({ level: 'read', token: 'token' });
      expect(component.generateJoinUrl).toHaveBeenCalled();
    });

    it('should generate token join', () => {
      const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(true) });
      mockDialogService.open.and.returnValue(dialogRefSpy);
      mockTopicJoinService.save.and.returnValue(of({ token: 'newToken', level: 'read' }));

      component.generateTokenJoin();
      expect(mockDialogService.open).toHaveBeenCalledWith(ConfirmDialogComponent, jasmine.any(Object));
      expect(mockTopicJoinService.save).toHaveBeenCalledWith({
        topicId: 'topicId',
        userId: 'userId',
        level: 'read'
      });
    });

    it('should update join token', () => {
      mockTopicJoinService.update.and.returnValue(of({}));

      component.doUpdateJoinToken('write');
      expect(mockTopicJoinService.update).toHaveBeenCalledWith({
        topicId: 'topicId',
        userId: 'userId',
        level: 'write',
        token: 'token'
      });
      expect(component.join.level).toBe('write');
    });

    it('should generate join URL', () => {
      mockTopicService.canShare.and.returnValue(true);
      mockLocationService.getAbsoluteUrl.and.returnValue('http://example.com');

      component.generateJoinUrl();
      expect(mockLocationService.getAbsoluteUrl).toHaveBeenCalledWith('/topics/join/token');
      expect(component.joinUrl).toBe('http://example.com');
    });

    it('should copy invite link', () => {
      const inputElement = document.createElement('input');
      spyOn(component.linkInput, 'nativeElement').and.returnValue(inputElement);
      spyOn(inputElement, 'focus');
      spyOn(inputElement, 'select');
      spyOn(document, 'execCommand');

      component.copyInviteLink();
      expect(component.joinDisabled).toBe(false);
      setTimeout(() => {
        expect(inputElement.focus).toHaveBeenCalled();
        expect(inputElement.select).toHaveBeenCalled();
        expect(document.execCommand).toHaveBeenCalledWith('copy');




        expect(component.copySuccess).toBe(true);
      });
      setTimeout(() => {
        expect(component.copySuccess).toBe(false);
        expect(component.joinDisabled).toBe(true);
      }, 500);
    });
  });

