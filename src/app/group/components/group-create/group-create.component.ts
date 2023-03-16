import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take, takeWhile } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.scss']
})
export class GroupCreateComponent implements OnInit {
  @ViewChild('imageUpload') fileInput?: ElementRef;

  group: Group = <Group>{
    name: '',
    description: '',
    imageUrl: '',
    visibility: this.GroupService.VISIBILITY.private
  };
  VISIBILITY = this.GroupService.VISIBILITY;
  errors?: any;
  tmpImageUrl?: string;
  imageFile?: any;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private GroupService: GroupService, private router: Router, private dialog: MatDialog) {
    this.group = Object.assign(this.group, data);
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
                  if ( group.visibility === this.VISIBILITY.public) {
                    this.router.navigate(['/groups', group.id]);
                  } else {
                    this.router.navigate(['/my', 'groups', group.id]);
                  }
                }
              });
          } else {
            this.dialog.closeAll();
            this.GroupService.reset();
            if ( group.visibility === this.VISIBILITY.public) {
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
}

@Component({
  selector: 'group-create-dialog',
  template: '',
  styleUrls: ['./group-create.component.scss']
})
export class GroupCreateDialogComponent {
  constructor(private router: Router, dialog: MatDialog) {
    dialog.open(GroupCreateComponent);
  }

}
