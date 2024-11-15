import { TopicIdeaService } from '@services/topic-idea.service';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, map, of, take, combineLatest, switchMap, tap } from 'rxjs';
import { Idea } from 'src/app/interfaces/idea';
import { DIALOG_DATA, DialogRef } from 'src/app/shared/dialog';
import { TopicIdeationFoldersService } from '@services/topic-ideation-folders.service';

@Component({
  selector: 'app-create-idea-folder',
  templateUrl: './create-idea-folder.component.html',
  styleUrls: ['./create-idea-folder.component.scss']
})
export class CreateIdeaFolderComponent {
  form = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
  });

  ideas$;
  allIdeas$ = <Idea[]>[];
  wWidth = window.innerWidth;
  folderIdeas = <Idea[]>[];
  ideasCount = 0;
  topicId;
  ideationId;
  constructor(public TopicIdeaService: TopicIdeaService, public TopicIdeationFoldersService: TopicIdeationFoldersService, @Inject(DIALOG_DATA) data: any, private dialogRef: DialogRef<CreateIdeaFolderComponent>) {
    this.topicId = data.topicId;
    this.ideationId = data.ideationId;
    let offset = 0;
    let limit = 8;
    this.TopicIdeaService.setParam('topicId', data.topicId);
    this.TopicIdeaService.setParam('ideationId', data.ideationId);
    this.TopicIdeaService.setParam('offset', offset);
    this.TopicIdeaService.setParam('limit', limit);
    this.ideas$ = this.TopicIdeaService.loadItems().pipe(
      tap((res: any) => {
        if (res.length) {
          this.TopicIdeaService.hasMore$.next(true);
        } else {
          this.TopicIdeaService.hasMore$.next(false);
        }
      }),
      map(
        (newIdeas: any) => {
          this.allIdeas$ = this.allIdeas$.concat(newIdeas);
          if (this.allIdeas$.length < 10 && newIdeas.length) {
            this.TopicIdeaService.loadMore();
          }
          return this.allIdeas$;
        }
      ));
  }
  createFolder() {
    this.TopicIdeationFoldersService.save({ topicId: this.topicId, ideationId: this.ideationId }, this.form.value).pipe(take(1)).subscribe({
      next: (folder) => {
        console.log('RES', folder);
        if (this.folderIdeas.length) {
          this.TopicIdeationFoldersService.addIdea({ topicId: this.topicId, ideationId: this.ideationId, folderId: folder.id }, this.folderIdeas)
            .pipe(take(1))
            .subscribe({
              next: (res) => {
                console.log('IDEAS to folder', res)

                this.dialogRef.close();
              },
              error: (err) => {
                console.log('Error adding ideas to folder')
              }
            })
        } else {

          this.dialogRef.close();
        }
      },
      error: (err) => {
        console.log('ERROR', err)
      }
    })
  }

  ideaSelected(idea: Idea) {
    const exists = this.folderIdeas.find((item) => item.id === idea.id);
    if (exists) return true;
    return false;
  }

  toggleIdea(idea: Idea, $event: any) {
    console.log('toggle', $event);
    $event.stopPropagation();
    const index = this.folderIdeas.findIndex((item) => item.id === idea.id);
    console.log('index', index);
    if (index === -1) {
      this.folderIdeas.push(idea);
    } else {
      this.folderIdeas.splice(index, 1);
    }
  }

  toggleAllIdeas(ideas: Idea[]) {
    const allChecked = this.folderIdeas.length === ideas.length;
    if (!allChecked) {
      ideas.forEach((idea) => {
        const index = this.folderIdeas.findIndex((item) => item.id === idea.id);
        if (index === -1) this.folderIdeas.push(idea);
      });
    } else {
      this.folderIdeas = [];
    }
  }

  allChecked() {
    return this.folderIdeas.length === this.ideasCount;
  }
}
