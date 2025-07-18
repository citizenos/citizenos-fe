import { Component, Inject, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { DialogService, DIALOG_DATA } from 'src/app/shared/dialog';
import { take, takeWhile } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from '@services/group.service';
import { countries } from '@services/country.service';
import { languages } from '@services/language.service';

@Component({
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.scss'],
  standalone: false
})
export class GroupSettingsComponent {
  @ViewChild('imageUpload') fileInput?: ElementRef;
  countries = countries.sort((a: any, b: any) => {
    return a.name.localeCompare(b.name);
  });
  languages = languages.sort((a: any, b: any) => {
    return a.name.localeCompare(b.name);
  });

  activeTab = 'info';
  group: Group;
  rules = <any[]>[];
  VISIBILITY = this.GroupService.VISIBILITY;
  errors?: any;
  imageFile?: any;
  uploadedImage?: any;
  descriptionLength = 500;
  public tmpImageUrl?: any;

  constructor(
    private dialog: DialogService,
    @Inject(DIALOG_DATA) public data: any,
    private GroupService: GroupService
  ) {
    this.group = data.group;
    if (data.group.rules)
      this.rules = data.group.rules.map((rule:string) => {return {rule: rule}});
    if (this.activeTab === 'info') {
    }
  }

  removeRule(index: number) {
    this.rules?.splice(index, 1);
  }

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  addRule() {
    this.rules?.push({ rule: '' });
  }

  fileUpload() {
    const files = this.fileInput?.nativeElement.files;
    this.uploadedImage = files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      await this.resizeImage(reader.result as string).then((res: any) => {
        this.tmpImageUrl = res.imageUrl;
        this.imageFile = res.file;
      });
    };
    reader.readAsDataURL(files[0]);
  }

  resizeImage(imageURL: any): Promise<any> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 320;
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, image.width, image.height,
            0, 0, 320, 320);
        }
        var data = canvas.toDataURL('image/jpeg', 1);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'profileimage.jpg', { type: "image/jpeg" });
            canvas.remove();
            resolve({ file: file, imageUrl: data });
          }
        }, 'image/jpeg');
      };
      image.src = imageURL;
    });
  }

  fileDroped(files: any) {
    this.uploadedImage = files[0];
  }
  uploadImage() {
    this.fileInput?.nativeElement.click();
  };

  imageChange(image: any) {
    this.imageFile = image;
  }

  deleteGroupImage() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = null;
    }
    this.group.imageUrl = null;
    this.uploadedImage = null;
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
