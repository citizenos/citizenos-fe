import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { map, take } from 'rxjs';
import { Folder } from 'src/app/interfaces/folder';
import { TopicIdeaService } from 'src/app/services/topic-idea.service';
import { TopicIdeationFoldersService } from 'src/app/services/topic-ideation-folders.service';
import { DIALOG_DATA, DialogRef } from 'src/app/shared/dialog';

@Component({
  selector: 'app-add-idea-folder',
  templateUrl: './add-idea-folder.component.html',
  styleUrls: ['./add-idea-folder.component.scss']
})
export class AddIdeaFolderComponent {

  ideasFolders$;
  folders$;
  wWidth = window.innerWidth;
  ideaFolders = <Folder[]>[];
  initialFolders = <Folder[]>[];
  foldersCount = 0;
  idea;
  topicId;
  ideationId;
  form = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
  });
  showFolderInput = false;

  constructor(public TopicIdeaService: TopicIdeaService, public TopicIdeationFoldersService: TopicIdeationFoldersService, @Inject(DIALOG_DATA) data: any, private dialogRef: DialogRef<AddIdeaFolderComponent>) {
    this.topicId = data.topicId;
    this.ideationId = data.ideationId;
    this.idea = data.idea;
    this.ideasFolders$ = this.TopicIdeaService.getFolders({
      topicId: data.topicId,
      ideationId: data.ideationId,
      ideaId: data.idea.id
    }).pipe(take(1), map((data: any) => {
      this.ideaFolders = Object.assign([], data.rows);
      this.initialFolders = Object.assign([], data.rows);
      this.ideaFolders = data.rows;
      return data.rows;
    })).subscribe();

    this.folders$ = this.TopicIdeationFoldersService.query({
      topicId: data.topicId,
      ideationId: data.ideationId
    }).pipe(map((data: any) => {
      this.foldersCount = data.count;
      return data.rows;
    }));
  }

  createFolder() {
    if (this.showFolderInput && !this.form.invalid) {
      this.TopicIdeationFoldersService.save({ topicId: this.topicId, ideationId: this.ideationId }, this.form.value).pipe(take(1)).subscribe({
        next: (folder) => {
          this.TopicIdeationFoldersService.addIdea({ topicId: this.topicId, ideationId: this.ideationId, folderId: folder.id }, this.idea)
            .pipe(take(1))
            .subscribe({
              next: (res) => {
                this.dialogRef.close();
              },
              error: (err) => {
                console.log('Error adding ideas to folder')
              }
            })
        },
        error: (err) => {
          console.log('ERROR', err)
        }
      });
    }
    const foldersToRemove = this.initialFolders.filter((folder) => {
      const exists = this.ideaFolders.find((f) => f.id === folder.id);
      return !exists;
    });

    if (foldersToRemove.length) {
      foldersToRemove.forEach((folder) => {
        this.TopicIdeationFoldersService.removeIdea({ topicId: this.topicId, ideationId: this.ideationId, ideaId: this.idea.id, folderId: folder.id })
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              console.log(res);
            },
            error: (err) => {
              console.log(err);
            }
          })
      })
    }
    if (this.ideaFolders.length) {
      this.TopicIdeaService.addFolders({ topicId: this.topicId, ideationId: this.ideationId, ideaId: this.idea.id }, this.ideaFolders)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
          },
          error: (err) => {
            console.error(`Error adding folders`, err);
          }
        })
    }


    this.dialogRef.close();
  }

  folderSelected(folder: Folder) {
    const exists = this.ideaFolders.find((item) => item.id === folder.id);
    if (exists) return true;
    return false;
  }

  toggleFolder(folder: Folder, $event: any) {
    $event.stopPropagation();
    const index = this.ideaFolders.findIndex((item) => item.id === folder.id);
    if (index === -1) {
      this.ideaFolders.push(folder);
    } else {
      this.ideaFolders.splice(index, 1);
    }
  }

  toggleAllFolders(folders: Folder[]) {
    const allChecked = this.ideaFolders.length === folders.length;
    if (!allChecked) {
      folders.forEach((folder) => {
        const index = this.ideaFolders.findIndex((item) => item.id === folder.id);
        if (index === -1) this.ideaFolders.push(folder);
      });
    } else {
      this.ideaFolders = [];
    }
  }

  allChecked() {
    return this.ideaFolders?.length === this.foldersCount;
  }
}
