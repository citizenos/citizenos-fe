import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'group-list-item',
  templateUrl: './group-list-item.component.html',
  styleUrls: ['./group-list-item.component.scss']
})

export class GroupListItemComponent {
  @Input() group!: Group;
  constructor(private router: Router, private route: ActivatedRoute, public GroupService: GroupService) {
  }
  isActiveItem () {
    return this.router.url.indexOf(this.group.id) > -1;
  }
  goToItemView() {
    this.router.navigate(['my','groups', this.group.id]);
  }
  goToView (check: boolean) {
    this.router.navigate(['groups', this.group.id], {queryParams: {editMode:true}});
  }
}
