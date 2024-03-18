import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Argument } from 'src/app/interfaces/argument';
import { ConfigService } from 'src/app/services/config.service';
import { ArgumentWhyDialogComponent } from '../argument-why-dialog/argument-why-dialog.component';
import { DialogService } from 'src/app/shared/dialog';

@Component({
  selector: 'argument-deleted',
  templateUrl: './argument-deleted.component.html',
  styleUrls: ['./argument-deleted.component.scss']
})
export class ArgumentDeletedComponent implements OnInit {
  @Input() argument!: Argument;
  @Output() showDeletedArgument = new EventEmitter();
  isArgumentVisible = false;
  constructor(public config: ConfigService, private dialog: DialogService) { }

  ngOnInit(): void {
  }

  showReason() {
    this.dialog.open(ArgumentWhyDialogComponent, {data: {argument: this.argument}});
  }

  showArgument () {
    this.isArgumentVisible = true;
    this.showDeletedArgument.emit(true);
  }

  isVisible() {
    return (!this.argument.deletedAt && !this.showDeletedArgument) || (this.argument.deletedAt && this.showDeletedArgument);
  };
}
