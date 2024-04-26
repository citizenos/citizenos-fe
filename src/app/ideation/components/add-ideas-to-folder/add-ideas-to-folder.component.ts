import { TopicIdeationService } from 'src/app/services/topic-ideation.service';
import { TopicIdeaService } from 'src/app/services/topic-idea.service';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, map, take } from 'rxjs';
import { Idea } from 'src/app/interfaces/idea';
import { DIALOG_DATA, DialogRef } from 'src/app/shared/dialog';

@Component({
  selector: 'app-add-ideas-to-folder',
  templateUrl: './add-ideas-to-folder.component.html',
  styleUrls: ['./add-ideas-to-folder.component.scss']
})
export class AddIdeasToFolderComponent {
  folder;
  ideas$;
  folderIdeas$;
  wWidth = window.innerWidth;
  folderIdeas = <Idea[]>[];
  ideasCount = 0;
  topicId;
  ideationId;
  constructor(public TopicIdeaService: TopicIdeaService, public TopicIdeationService: TopicIdeationService, @Inject(DIALOG_DATA) data: any, private dialogRef: DialogRef<AddIdeasToFolderComponent>) {
    this.topicId = data.topicId;
    this.folder = data.folder;
    this.ideationId = data.ideationId;
    this.ideas$ = this.TopicIdeaService.query({
      topicId: data.topicId,
      ideationId: data.ideationId
    }).pipe(map((res: any) => {
      this.ideasCount = res.data.count;
      return res.data.rows;
    }));
    this.folderIdeas$ = this.TopicIdeationService.query({
      topicId: data.topicId,
      ideationId: data.ideationId,
      folderId: this.folder.id
    }).pipe(map((res: any) => {
      res.data.rows.forEach((idea: Idea) => {
        this.folderIdeas.push(idea);
      });

      return res.data.rows
    }));
  }
  createFolder() {
    if (this.folderIdeas.length) {
      this.TopicIdeationService.addIdeaToFolder({ topicId: this.topicId, ideationId: this.ideationId, folderId: this.folder.id }, this.folderIdeas)
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
