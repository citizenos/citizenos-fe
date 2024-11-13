
import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Topic } from 'src/app/interfaces/topic';
import { DIALOG_DATA, DialogRef } from 'src/app/shared/dialog';



export interface CloseVotingData {
  topic: Topic
}

@Component({
  selector: 'app-close-voting',
  templateUrl: './close-voting.component.html',
  styleUrl: './close-voting.component.scss'
})

export class CloseVotingComponent {

  constructor (@Inject(DIALOG_DATA) public data:CloseVotingData) {
  }

}
