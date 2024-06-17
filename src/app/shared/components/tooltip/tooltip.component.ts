import { Component, ElementRef, HostListener, ViewChild, Input, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: '[tooltip]',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnDestroy {
  @Input() delay? = 190; // Optional delay input, in ms
  @Input() noIcon? = false;
  @ViewChild('tooltTipIcon') toolTipIcon!: ElementRef;
  @ViewChild('tipContainer') tipContainer!: ElementRef;
  private timer: any;
  public visible = false;
  @Input() pos? = 'bottom';
  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    if (this.noIcon) {
      this.toolTipIcon = this.el;
    }
  }

  ngOnDestroy(): void {

  }

  @HostListener('mouseenter') onMouseEnter() {
    this.visible = true;
    setTimeout(() => {
      this.position();
    })

  }

  @HostListener('mouseleave') onMouseLeave() {
    this.visible = false;
    if (this.timer) clearTimeout(this.timer);
  }

  position () {
    const containerPosition = this.tipContainer.nativeElement.getBoundingClientRect();

    if (containerPosition.width > window.innerWidth) {
      this.renderer.setStyle(this.tipContainer.nativeElement, 'width', `${window.innerWidth - 16}px`);
    }

    let left = containerPosition.right - window.innerWidth + 32;
    if (window.innerWidth < containerPosition.right) {
      this.renderer.setStyle(this.tipContainer.nativeElement, 'left', `-${left}px`);
    }
    if (this.tipContainer.nativeElement.getBoundingClientRect().left < 0) {
      left = left + this.tipContainer.nativeElement.getBoundingClientRect().left;
      this.renderer.setStyle(this.tipContainer.nativeElement, 'left', `-${left}px`);
    } else {
      const iconPos = this.toolTipIcon.nativeElement.getBoundingClientRect().left;
      if (iconPos === containerPosition.left) {
        this.renderer.setStyle(this.tipContainer.nativeElement, 'left', `-16px`);
      }
      //this.renderer.setStyle(this.tipContainer.nativeElement, 'left', `${left}px`);
    }
  }
}
