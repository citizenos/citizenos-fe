import { Component, Input, OnInit } from '@angular/core';
import { Group } from 'src/app/interfaces/group';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'public-group-box',
  templateUrl: './publicgroupbox.component.html',
  styleUrls: ['./publicgroupbox.component.scss']
})
export class PublicgroupboxComponent implements OnInit {
  @Input() group = <Group>{}; // decorate the property with @Input()
  constructor(dialog: MatDialog) { }

  ngOnInit(): void {
  }

  joinGroup () {
    /*this.dialog.openConfirm({
        template: '/views/modals/group_join_confirm.html',
        closeByEscape: false
    })
    .then(() => {
        this.Group
            .join(this.group.join.token)
            .then((res) => {
                if (res.id) {
                    this.$state.reload(true);
                }
            }, (res) => {
                this.$log.error('Failed to join Topic', res);
            }
        );
    });*/
}
}
