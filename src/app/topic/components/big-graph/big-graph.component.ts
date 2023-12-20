import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'big-graph',
  templateUrl: './big-graph.component.html',
  styleUrls: ['./big-graph.component.scss']
})
export class BigGraphComponent implements OnInit {
  @Input() options!:{rows: any[]};
  constructor() {

  }
  sortedOptions = <any[]>[];
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

  getVoteValuePercentage(value:any) {
    if (!this.getVoteCountTotal() || value < 1 || !value) return 0;
    return value / this.getVoteCountTotal() * 100;
  };

  trackByFn(index: number, element: any) {
    return element.key;
  }

  getOptionLetter(index:any) {
    if (index < 26) {
      return String.fromCharCode(65 + parseInt(index));
    } else {
      return String.fromCharCode(65 + Math.floor(parseInt(index) / 26) - 1) + (String.fromCharCode(65 + parseInt(index) % 26))
    }
  };
}
