import { RouterTestingHarness } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TopicVoteCastComponent } from './topic-vote-cast.component';
import { AppService } from '@services/app.service';
import { DialogService } from 'src/app/shared/dialog';
import { NotificationService } from '@services/notification.service';
import { AuthService } from '@services/auth.service';
import { TopicService } from '@services/topic.service';
import { TopicVoteService } from '@services/topic-vote.service';
import { TopicIdeaService } from '@services/topic-idea.service';
import { ActivatedRoute } from '@angular/router';
import { VoteDelegationService } from '@services/vote-delegation.service';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';

describe('TopicVoteCastComponent', () => {
  let component: TopicVoteCastComponent;
  let fixture: ComponentFixture<TopicVoteCastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        RouterTestingHarness
      ],
      imports: [,
        TranslateModule.forRoot()
      ],
      declarations: [TopicVoteCastComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicVoteCastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('TopicVoteCastComponent', () => {
    let component: TopicVoteCastComponent;
    let fixture: ComponentFixture<TopicVoteCastComponent>;
    let mockAppService: any;
    let mockDialogService: any;
    let mockNotificationService: any;
    let mockAuthService: any;
    let mockTopicService: any;
    let mockTopicVoteService: any;
    let mockTopicIdeaService: any;
    let mockActivatedRoute: any;
    let mockVoteDelegationService: any;

    beforeEach(async () => {
      mockAppService = jasmine.createSpyObj('AppService', ['']);
      mockDialogService = jasmine.createSpyObj('DialogService', ['open', 'closeAll']);
      mockNotificationService = jasmine.createSpyObj('NotificationService', ['addError', 'addSuccess', 'removeAll']);
      mockAuthService = jasmine.createSpyObj('AuthService', ['']);
      mockTopicService = jasmine.createSpyObj('TopicService', ['canUpdate', 'reloadTopic', 'patch']);
      mockTopicVoteService = jasmine.createSpyObj('TopicVoteService', ['canVote', 'canDelegate', 'cast', 'reloadVote', 'get', 'update', 'hasVoteEndedExpired', 'hasVoteEnded', 'loadVote']);
      mockTopicIdeaService = jasmine.createSpyObj('TopicIdeaService', ['get']);
      mockActivatedRoute = { snapshot: { params: {} } };
      mockVoteDelegationService = jasmine.createSpyObj('VoteDelegationService', ['delete']);

      await TestBed.configureTestingModule({
        declarations: [TopicVoteCastComponent],
        providers: [
          { provide: AppService, useValue: mockAppService },
          { provide: DialogService, useValue: mockDialogService },
          { provide: NotificationService, useValue: mockNotificationService },
          { provide: AuthService, useValue: mockAuthService },
          { provide: TopicService, useValue: mockTopicService },
          { provide: TopicVoteService, useValue: mockTopicVoteService },
          { provide: TopicIdeaService, useValue: mockTopicIdeaService },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: VoteDelegationService, useValue: mockVoteDelegationService }
        ]
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TopicVoteCastComponent);
      component = fixture.componentInstance;
      component.vote = {
        options: { rows: [] },
        maxChoices: 1,
        minChoices: 1,
        authType: '',
        id: '',
        delegation: false,
        downloads: {}
      };
      component.topic = {
        id: '',
        voteId: '',
        ideationId: '',
        status: '',
        authors: [],
        title: '',
        intro: '',
        description: '',
        visibility: '',
        hashtag: null,
        join: { token: '', level: '' },
        categories: [],
        endsAt: null,
        createdAt: '',
        updatedAt: '',
        sourcePartnerId: null,
        sourcePartnerObjectId: null,
        permission: { level: '', levelGroup: undefined },
        creator: {},
        lastActivity: null,
        country: null,
        language: null,
        members: {},
        discussionId: null,
        comments: {},
        padUrl: {},
        favourite: null,
        imageUrl: null,
        report: {
          id: '',
          type: null,
          text: null,
          moderatedReasonType: null,
          moderatedReasonText: null
        },
        events: {},
        vote: undefined,
        revision: undefined
      }

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should check if user can update the topic', () => {
      mockTopicService.canUpdate.and.returnValue(true);
      expect(component.canUpdate()).toBeTrue();
    });

    it('should check if user can vote', () => {
      mockTopicVoteService.canVote.and.returnValue(true);
      expect(component.canVote()).toBeTrue();
    });

    it('should check if user can delegate', () => {
      mockTopicVoteService.canDelegate.and.returnValue(true);
      expect(component.canDelegate()).toBeTrue();
    });

    it('should check if user can submit vote', () => {
      component.vote.options.rows = [{ selected: true, value: 'Neutral' }];
      expect(component.canSubmit()).toBeTrue();
    });

    it('should cast a vote', () => {
      mockTopicVoteService.cast.and.returnValue(of({}));
      mockTopicVoteService.get.and.returnValue(of({}));
      component.doVote();
      expect(mockNotificationService.addSuccess).toHaveBeenCalledWith('VIEWS.TOPICS_TOPICID.MSG_VOTE_REGISTERED');
    });

    it('should save vote', () => {
      mockTopicVoteService.update.and.returnValue(of({}));
      component.saveVote();
      expect(mockTopicService.reloadTopic).toHaveBeenCalled();
    });

    it('should close voting', () => {
      mockDialogService.open.and.returnValue({ afterClosed: () => of(true) });
      mockTopicService.patch.and.returnValue(of({}));
      component.closeVoting();
      expect(mockTopicService.reloadTopic).toHaveBeenCalled();
    });

    it('should send vote reminder', () => {
      mockDialogService.open.and.returnValue({ afterClosed: () => of(true) });
      component.sendVoteReminder();
      expect(mockNotificationService.addSuccess).toHaveBeenCalledWith('COMPONENTS.TOPIC_VOTE_CAST.MSG_VOTE_REMINDER_SENT');
    });

    it('should edit deadline', () => {
      component.editDeadline();
      expect(mockDialogService.open).toHaveBeenCalled();
    });

    it('should check if vote has ended or expired', () => {
      mockTopicVoteService.hasVoteEndedExpired.and.returnValue(true);
      expect(component.hasVoteEndedExpired()).toBeTrue();
    });

    it('should check if vote has ended', () => {
      mockTopicVoteService.hasVoteEnded.and.returnValue(true);
      expect(component.hasVoteEnded()).toBeTrue();
    });

    it('should delegate vote', () => {
      component.delegate();
      expect(mockDialogService.open).toHaveBeenCalled();
    });

    it('should revoke delegation', () => {
      mockDialogService.open.and.returnValue({ afterClosed: () => of(true) });
      mockVoteDelegationService.delete.and.returnValue(of({}));
      component.doRevokeDelegation();
      expect(mockTopicService.reloadTopic).toHaveBeenCalled();
    });

    it('should select an option', () => {
      component.vote.options.rows = [{ id: 1, value: 'Option 1' }];
      component.selectOption({ id: 1, value: 'Option 1' });
      expect(component.vote.options.rows[0].selected).toBeTrue();
    });

    it('should trigger final download', () => {
      component.vote.downloads = { bdocFinal: 'url' };
      component.triggerFinalDownload('bdoc');
      expect(window.location.href).toBe('url');
    });

    it('should view idea', () => {
      mockTopicIdeaService.get.and.returnValue(of({}));
      component.viewIdea('1');
      expect(mockDialogService.open).toHaveBeenCalled();
    });
  });
});
