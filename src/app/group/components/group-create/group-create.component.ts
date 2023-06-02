import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, of, switchMap, take, takeWhile } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { Topic } from 'src/app/interfaces/topic';
import { ConfigService } from 'src/app/services/config.service';
import { GroupService } from 'src/app/services/group.service';
import { SearchService } from 'src/app/services/search.service';
import { TopicService } from 'src/app/services/topic.service';
import { GroupMemberTopicService } from 'src/app/services/group-member-topic.service';

@Component({
  selector: 'group-create-component',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.scss']
})
export class GroupCreateComponent implements OnInit {
  @ViewChild('imageUpload') fileInput?: ElementRef;

  languages$: { [key: string]: any } = this.config.get('language').list;
  group: Group = <Group>{
    name: '',
    description: '',
    imageUrl: '',
    visibility: this.GroupService.VISIBILITY.private,
  };
  grouplanguage: string = '';
  groupcategories = <string[]>[]; //should be moved under group object
  VISIBILITY = this.GroupService.VISIBILITY;
  CATEGORIES = Object.keys(this.TopicService.CATEGORIES);
  errors?: any;
  tmpImageUrl?: string;
  imageFile?: any;
  tabSelected;
  tabs = ['info', 'settings', 'add_topics', 'invite'];
  rulesOfConduct = [
    { rule: '' },
    { rule: '' },
    { rule: '' },
  ];

  constructor(private TopicService: TopicService,
    public translate: TranslateService,
    private GroupService: GroupService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private Search: SearchService,
    private GroupMemberTopicService: GroupMemberTopicService,
    private config: ConfigService) {
    this.tabSelected = this.route.fragment.pipe(
      map((fragment) => {
        if (!fragment) {
          return this.selectTab('info')
        }
        return fragment
      }
      ));
  }

  selectTab(tab: string) {
    this.router.navigate([], { fragment: tab })
  }

  previousTab(tab: string | void) {
    if (tab) {
      const tabIndex = this.tabs.indexOf(tab);
      if (tabIndex > 0) {
        this.selectTab(this.tabs[tabIndex - 1]);
      }
    }
  }

  nextTab(tab: string | void) {
    if (tab) {
      const tabIndex = this.tabs.indexOf(tab);
      if (tabIndex > -1 && tabIndex < 3) {
        this.selectTab(this.tabs[tabIndex + 1]);
      }
    }
  }

  chooseCategory(category: string) {
    if (this.groupcategories.indexOf(category) > -1) {
      this.groupcategories.splice(this.groupcategories.indexOf(category), 1);
    } else {
      console.log(this.groupcategories)
      this.groupcategories.push(category);
    }
  }

  removeRule(index: number) {
    this.rulesOfConduct.splice(index, 1);
  }

  addRule() {
    this.rulesOfConduct.push({ rule: '' });
  }

  ngOnInit(): void {
  }

  fileUpload() {
    const files = this.fileInput?.nativeElement.files;
    this.imageFile = files[0];
    const reader = new FileReader();
    reader.onload = (() => {
      return (e: any) => {
        this.tmpImageUrl = e.target.result;
      };
    })();
    reader.readAsDataURL(files[0]);
  }

  fileDroped(files: any) {
    console.log(files)
    this.imageFile = files[0];
    const reader = new FileReader();
    reader.onload = (() => {
      return (e: any) => {
        this.tmpImageUrl = e.target.result;
      };
    })();
    reader.readAsDataURL(files[0]);
  }
  uploadImage() {
    this.fileInput?.nativeElement.click();
  };

  deleteGroupImage() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = null;
    }
    this.imageFile = null;
    this.tmpImageUrl = undefined;
  }

  createGroup() {
    this.errors = null;

    this.GroupService.save(this.group).pipe(take(1))
      .subscribe({
        next: (group) => {
          this.group = group;
          if (this.imageFile) {
            this.GroupService
              .uploadGroupImage(this.imageFile, this.group.id).pipe(
                takeWhile((e) => !e.link, true)
              )
              .subscribe((res: any) => {
                if (res.link) {
                  this.group.imageUrl = res.link;

                  this.dialog.closeAll();
                  this.GroupService.reset();
                  if (group.visibility === this.VISIBILITY.public) {
                    this.router.navigate(['/groups', group.id]);
                  } else {
                    this.router.navigate(['/my', 'groups', group.id]);
                  }
                }
              });
          } else {
            this.dialog.closeAll();
            this.GroupService.reset();
            if (group.visibility === this.VISIBILITY.public) {
              this.router.navigate(['/groups', group.id]);
            } else {
              this.router.navigate(['/my', 'groups', group.id]);
            }
          }
        },
        error: (errorResponse) => {
          if (errorResponse && errorResponse.errors) {
            this.errors = errorResponse.errors;
          }
        }
      });
  }
  searchStringTopic?: string;
  searchResults$ = of(<Topic[] | any[]>[]);
  memberTopics$ = of(<Topic[] | any[]>[]);
  memberTopics = <Topic[]>[];
  resultCount: number = 0;
  searchOrderBy?: string;

  search(str: any): void {
    if (str && str.length >= 2) {
      this.searchStringTopic = str;
      this.searchResults$ = this.Search
        .search(str, {
          include: 'my.topic',
          'my.topic.level': 'admin'
        })
        .pipe(
          switchMap((response) => {
            this.resultCount = response.results.my.topics.count;
            return of(response.results.my.topics.rows);
          }));
    } else {
      this.searchResults$ = of([]);
    }
  }

  addGroupMemberTopic(topic: Topic) {
    this.searchStringTopic = '';
    this.searchResults$ = of([]);

    if (!topic || !topic.id || !topic.title) {
      return false;
    }
    const member = this.memberTopics.find((o: any) => {
      return o.id === topic.id;
    });

    if (!member) {
      topic.permission.level = this.GroupMemberTopicService.LEVELS.read;
      this.memberTopics.push(topic);
    }
    return
  };

  removeGroupMemberTopic(topic: Topic) {
    this.memberTopics.splice(this.memberTopics.indexOf(topic), 1);
  };

  updateGroupMemberTopicLevel(topic: Topic, level: string) {
    topic.permission.level = level;
  };
}

