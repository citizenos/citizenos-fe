import { Component, ElementRef, HostListener, ViewChild, Input, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: '[tooltip]',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
  @Input() delay? = 190; // Optional delay input, in ms
  @Input() noIcon? = false;
  @ViewChild('tooltTipIcon') toolTipIcon!: ElementRef;
  @ViewChild('tipContainer') tipContainer!: ElementRef;
  @ViewChild('arrow') arrow!: ElementRef;
  private readonly timer: any;
  public visible = false;
  @Input() pos? = 'bottom';
  constructor(private readonly el: ElementRef, private readonly renderer: Renderer2) {
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

  position() {
    if (this.noIcon) {
      this.toolTipIcon = this.el;
    }
    const containerPosition = this.tipContainer.nativeElement.getBoundingClientRect();

    if (containerPosition.width > window.innerWidth) {
      this.renderer.setStyle(this.tipContainer.nativeElement, 'width', `${window.innerWidth - 16}px`);
    }

    let left = containerPosition.right - window.innerWidth + 32;
    let tipIconContainer;
    let arrowContainer;
    setTimeout(() => {
      tipIconContainer = this.toolTipIcon.nativeElement.getBoundingClientRect();
      arrowContainer = this.arrow?.nativeElement.getBoundingClientRect();
      if (tipIconContainer.left - arrowContainer.left > tipIconContainer.width / 2)
        this.renderer.setStyle(this.arrow.nativeElement, 'left', `${(tipIconContainer.left - arrowContainer.left + tipIconContainer.width / 2)}px`)
    })
    if (this.pos === 'top') {
      this.renderer.setStyle(this.tipContainer.nativeElement, 'bottom', `8px`);
    }
    if (this.pos === 'bottom') {
      this.renderer.setStyle(this.tipContainer.nativeElement, 'top', `${this.toolTipIcon.nativeElement.offsetHeight + 8}px`);
    }
    if (window.innerWidth < containerPosition.right) {
      this.renderer.setStyle(this.tipContainer.nativeElement, 'left', `-${left}px`);
    }
    const containerBounds = this.tipContainer.nativeElement.getBoundingClientRect();
    if (containerBounds.left <= 0) {
      left = left + this.tipContainer.nativeElement.getBoundingClientRect().left;
      this.renderer.setStyle(this.tipContainer.nativeElement, 'left', `-${left}px`);
    }
    if (containerBounds.right + 32 >= window.innerWidth) {
      this.renderer.setStyle(this.tipContainer.nativeElement, 'right', `0px`);
    }
    else {
      const iconPos = this.toolTipIcon.nativeElement.getBoundingClientRect().left;
      if (iconPos === containerPosition.left) {
        this.renderer.setStyle(this.tipContainer.nativeElement, 'left', `-16px`);
      } else {
        let left = -12;
        this.renderer.setStyle(this.tipContainer.nativeElement, 'left', `${left}px`);
      }
      //this.renderer.setStyle(this.tipContainer.nativeElement, 'left', `${left}px`);
    }
  }
}
