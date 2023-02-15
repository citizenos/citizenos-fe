import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'regular-graph',
  templateUrl: './regular-graph.component.html',
  styleUrls: ['./regular-graph.component.scss']
})
export class RegularGraphComponent implements OnInit {
  @Input() options!: { rows: any[] };
  constructor() { }

  ngOnInit(): void {
  }

  getVoteCountTotal() {
    let voteCountTotal = 0;
    if (this.options) {
      const options = this.options.rows;
      for (var i in options) {
        var voteCount = options[i].voteCount;
        if (voteCount) {
          voteCountTotal += voteCount;
        }
      }
    }

    return voteCountTotal;
  };

  getVoteValuePercentage(value: number) {
    if (!this.getVoteCountTotal() || value < 1 || !value) return 0;
    return value / this.getVoteCountTotal() * 100;
  };
}
