import { Component, Inject, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap, tap, of, take, takeWhile, catchError, map, Observable, BehaviorSubject } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { countries } from 'src/app/services/country.service';
import { languages } from 'src/app/services/language.service';

@Component({
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.scss']
})
export class GroupSettingsComponent {
  @ViewChild('imageUpload') fileInput?: ElementRef;
  @HostBinding('class.pos_dialog_fixed') addPosAbsolute: boolean = false;
  countries = countries;
  languages = languages;

  activeTab = 'info';
  group: Group;
  rules = <any[]>[];
  VISIBILITY = this.GroupService.VISIBILITY;
  errors?: any;
  tmpImageUrl?: string;
  imageFile?: any;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private GroupService: GroupService
  ) {
    this.group = data.group;
    this.rules = data.group.rules.map((rule:string) => {return {rule: rule}});
    if (this.activeTab === 'info') {
      this.addPosAbsolute = true;
    }
  }

  removeRule(index: number) {
    this.rules?.splice(index, 1);
  }

  selectTab(tab: string) {
    this.addPosAbsolute = false;
    if (tab === 'info') {
      this.addPosAbsolute = true;
    }
    this.activeTab = tab;
  }

  addRule() {
    this.rules?.push({ rule: '' });
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
    this.group.imageUrl = null;
    this.tmpImageUrl = undefined;
    this.imageFile = null;
  };

  save() {
    const saveGroup = Object.assign({}, this.group);
    saveGroup.rules = this.rules.map(rule => rule.rule);

    this.GroupService.update(saveGroup).pipe(take(1))
    .subscribe({
      next: (group) => {
        this.group = Object.assign(this.group, group);
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
              }
            });
        } else {
          this.dialog.closeAll();
          this.GroupService.reset();
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
