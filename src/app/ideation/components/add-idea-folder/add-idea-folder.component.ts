import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { map, take } from 'rxjs';
import { Folder } from 'src/app/interfaces/folder';
import { TopicIdeaService } from 'src/app/services/topic-idea.service';
import { TopicIdeationService } from 'src/app/services/topic-ideation.service';
import { DIALOG_DATA, DialogRef } from 'src/app/shared/dialog';

@Component({
  selector: 'app-add-idea-folder',
  templateUrl: './add-idea-folder.component.html',
  styleUrls: ['./add-idea-folder.component.scss']
})
export class AddIdeaFolderComponent {

  folders$;
  wWidth = window.innerWidth;
  ideaFolders = <Folder[]>[];
  foldersCount = 0;
  idea;
  topicId;
  ideationId;
  doAddToFolder() {

  }

  constructor(public TopicIdeaService: TopicIdeaService, public TopicIdeationService: TopicIdeationService, @Inject(DIALOG_DATA) data: any, private dialogRef: DialogRef<AddIdeaFolderComponent>) {
    this.topicId = data.topicId;
    this.ideationId = data.ideationId;
    this.idea = data.idea;
    this.folders$ = this.TopicIdeationService.getFolders({
      topicId: data.topicId,
      ideationId: data.ideationId
    }).pipe(map((data: any) => {
      console.log('FOLDERS', data);
      this.foldersCount = data.count;
      return data.rows;
    }));
  }
  createFolder() {
    /*this.TopicIdeationService.createFolder({ topicId: this.topicId, ideationId: this.ideationId }, this.form.value).pipe(take(1)).subscribe({
      next: (folder) => {
        console.log('RES', folder);
        if (this.ideaFolders.length) {
          this.TopicIdeationService.addIdeaToFolder({ topicId: this.topicId, ideationId: this.ideationId, folderId: folder.id }, this.ideaFolders)
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
    })*/
  }

  folderSelected(folder: Folder) {
    const exists = this.ideaFolders.find((item) => item.id === folder.id);
    if (exists) return true;
    return false;
  }

  toggleFolder(folder: Folder, $event: any) {
    console.log('toggle', $event);
    $event.stopPropagation();
    const index = this.ideaFolders.findIndex((item) => item.id === folder.id);
    console.log('index', index);
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
    return this.ideaFolders.length === this.foldersCount;
  }
}
