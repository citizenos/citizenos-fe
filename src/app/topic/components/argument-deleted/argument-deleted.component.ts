import { Component, OnInit, Input } from '@angular/core';
import { Argument } from 'src/app/interfaces/argument';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'argument-deleted',
  templateUrl: './argument-deleted.component.html',
  styleUrls: ['./argument-deleted.component.scss']
})
export class ArgumentDeletedComponent implements OnInit {
  @Input() argument!: Argument;

  showDeleteReason = false;
  showDeletedArgument = false;
  constructor(public config: ConfigService) { }

  ngOnInit(): void {
  }

  isVisible() {
    return (!this.argument.deletedAt && !this.showDeletedArgument) || (this.argument.deletedAt && this.showDeletedArgument);
  };
}
