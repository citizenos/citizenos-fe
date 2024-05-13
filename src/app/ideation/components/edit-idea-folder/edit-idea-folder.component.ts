import { TopicIdeationService } from 'src/app/services/topic-ideation.service';
import { TopicIdeaService } from 'src/app/services/topic-idea.service';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, map, take } from 'rxjs';
import { Idea } from 'src/app/interfaces/idea';
import { DIALOG_DATA, DialogRef } from 'src/app/shared/dialog';

@Component({
  selector: 'edit-idea-folder',
  templateUrl: './edit-idea-folder.component.html',
  styleUrls: ['./edit-idea-folder.component.scss']
})
export class EditIdeaFolderComponent {
  form = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
  });

  ideas$;
  wWidth = window.innerWidth;
  folderIdeas = <Idea[]>[];
  initialIdeas = <Idea[]>[];
  ideasCount = 0;
  topicId;
  ideationId;
  folder;
  constructor(public TopicIdeaService: TopicIdeaService, public TopicIdeationService: TopicIdeationService, @Inject(DIALOG_DATA) data: any, private dialogRef: DialogRef<EditIdeaFolderComponent>) {
    this.topicId = data.topicId;
    this.ideationId = data.ideationId;
    this.folder = data.folder;
    this.form.patchValue({'name': this.folder.name});
    this.ideas$ = this.TopicIdeaService.query({
      topicId: data.topicId,
      ideationId: data.ideationId,
    }).pipe(map((res: any) => {
      this.ideasCount = res.data.count;
      return res.data.rows;
    }));
    this.TopicIdeaService.query({
      topicId: data.topicId,
      ideationId: data.ideationId,
      folderId: data.folder.id
    }).pipe(take(1)).subscribe({
      next: (res) => {
        this.folderIdeas = Object.assign([], res.data.rows);
        this.initialIdeas = Object.assign([], res.data.rows);
      }
    })
  }
  editFolder() {
    console.log(this.initialIdeas, this.folderIdeas)
    const ideasToRemove = this.initialIdeas.filter((idea) => {
      const exists = this.folderIdeas.find((i) => i.id === idea.id);
      console.log('exists', exists)
      return !exists;
    });
    console.log('IDEAS to remvoe', ideasToRemove);
    this.TopicIdeationService.updateFolder({ topicId: this.topicId, ideationId: this.ideationId, folderId: this.folder.id }, this.form.value).pipe(take(1)).subscribe({
      next: (folder) => {
        console.log('RES', folder);
        if (ideasToRemove.length) {
          ideasToRemove.forEach((idea) => {
            this.TopicIdeationService.removeIdeaFromFolder({ topicId: this.topicId, ideationId: this.ideationId, folderId: this.folder.id, ideaId: idea.id })
            .pipe(take(1))
            .subscribe({
              next:(res) => {
                console.log(res);
              },
              error: (err) => {
                console.log(err);
              }
            })
          })
        }
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
    $event.stopPropagation();
    const index = this.folderIdeas.findIndex((item) => item.id === idea.id);
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
