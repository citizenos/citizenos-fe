import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'regular-graph',
  templateUrl: './regular-graph.component.html',
  styleUrls: ['./regular-graph.component.scss']
})
export class RegularGraphComponent implements OnInit {
  @Input() options!: { rows: any[] };
  sortedOptions = <any[]>[];
  constructor() { }

  ngOnInit(): void {
    this.sortedOptions = this.options.rows.sort((a, b) => {
      const aCount = a['voteCount'] || 0;
      const bCount = b['voteCount'] || 0;
      return aCount < bCount ? 1 : aCount === bCount ? 0 : -1
    });
  }

  getVoteCountTotal() {
    let voteCountTotal = 0;
    if (this.options) {
      const options = this.options.rows;
      for (let i in options) {
        const voteCount = options[i].voteCount;
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
