import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseVotingComponent } from './close-voting.component';
import { DIALOG_DATA } from 'src/app/shared/dialog';
import { CloseVotingData } from './close-voting.component';

describe('CloseVotingComponent', () => {
  let component: CloseVotingComponent;
  let fixture: ComponentFixture<CloseVotingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseVotingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseVotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CloseVotingComponent', () => {
    let component: CloseVotingComponent;
    let fixture: ComponentFixture<CloseVotingComponent>;
    const mockDialogData: CloseVotingData = {
      topic: {
        authors: [
          {
            id: '123',
            name: 'Test Author',
            company: 'Test Company'
          }
        ],
        id: 'topic123',
        title: 'Test Topic Title',
        intro: 'Test topic introduction text',
        description: '<p>Test topic description</p>',
        status: 'open',
        visibility: 'public',
        hashtag: 'testtopic',
        join: {
          token: 'abc123',
          level: 'read'
        },
        categories: ['category1', 'category2'],
        endsAt: '2024-12-31T23:59:59Z',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        sourcePartnerId: null,
        sourcePartnerObjectId: null,
        permission: {
          level: 'admin',
          levelGroup: 'group1'
        },
        creator: {
          id: 'user123',
          name: 'Test Creator'
        },
        lastActivity: '2024-03-19T10:00:00Z',
        country: 'US',
        language: 'en',
        members: {
          users: [],
          groups: []
        },
        voteId: 'vote123',
        ideationId: 'ideation123',
        discussionId: 'discussion123',
        comments: {
          count: 0,
          latest: []
        },
        padUrl: 'https://example.com/pad/123',
        favourite: false,
        imageUrl: 'https://example.com/image.jpg'
      }
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [CloseVotingComponent],
        providers: [
          { provide: DIALOG_DATA, useValue: mockDialogData }
        ]
      })
      .compileComponents();

      fixture = TestBed.createComponent(CloseVotingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have data injected', () => {
      expect(component.data).toEqual(mockDialogData);
    });
  });

});
