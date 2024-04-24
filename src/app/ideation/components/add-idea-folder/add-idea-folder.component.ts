import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-idea-folder',
  templateUrl: './add-idea-folder.component.html',
  styleUrls: ['./add-idea-folder.component.scss']
})
export class AddIdeaFolderComponent {
  form = new UntypedFormGroup({
    email: new UntypedFormControl('', Validators.email),
  });

  wWidth = window.innerWidth;
  doAddToFolder() {

  }
}
