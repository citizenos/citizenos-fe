import { Input, Output, EventEmitter, Component, ViewChild, SimpleChanges, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent {
  @ViewChild('canvasElement') canvasElement!: ElementRef<any>;
  @Output() item = new EventEmitter<any>();
  @Input('file') file?: any;
  @Input('width') canvasWidth?: number;
  @Input('heigth') canvasHeight?: number;

  canvas: any;
  offsetX = 0;
  offsetY = 0;
  private isDragging = false;
  private startX: number = 0;
  private downX: number = 0;
  private downY: number = 0;
  private upX: number = 0;
  private upY: number = 0;
  private startY: number = 0;
  private image = new Image();
  private imageHeight = 320;
  private imageWidth = 320;
  scale = 1;
  constructor(private renderer: Renderer2) {
    this.canvasWidth = this.canvasWidth || 320;
    this.canvasHeight = this.canvasHeight || 320;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.canvasElement)
      this.setInitialImage();
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values

  }

  setInitialImage() {
    this.canvas = this.canvasElement.nativeElement;
    const offset = this.canvasElement.nativeElement.getBoundingClientRect();
    this.offsetX = offset.x;
    this.offsetY = offset.y;
    const context = this.canvas.getContext('2d');
    if (this.file) {
      this.image.src = URL.createObjectURL(this.file);
      this.image.onload = () => {
        console.log(this.image.width);
        if (context) {
          const scaleX = 300 / this.image.width;
          const scaleY = 300 / this.image.height;
          this.imageWidth = this.image.width * scaleX;
          this.imageHeight = this.image.height * scaleY;
          context.drawImage(this.image, 0, 0, this.imageWidth, this.imageHeight);
        }
      };
    }
  }
  ngAfterViewInit() {
    this.setInitialImage()
  }

  draw() {
    const context = this.canvas.getContext('2d');
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.drawImage(this.image, this.startX, this.startY, this.imageWidth * this.scale, this.imageHeight * this.scale);
    this.outPutImage();
  }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = Math.sign(event.deltaY);
    const context = this.canvas.getContext('2d');
    if (context) {
      if (delta > 0) {
        this.scale += 0.1;
      }
      else {
        this.scale -= 0.1;
      }
      this.draw();
    }
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut(event: MouseEvent) {
    // user has left the canvas, so clear the drag flag
    if (this.isDragging) {
      this.upX = event.clientX - this.offsetX;
      this.upY = event.clientY - this.offsetY;
    }
    this.isDragging = false;
  }
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.downX = event.clientX - this.offsetX + this.upX;
    this.downY = event.clientY - this.offsetY + this.upY;
  }

  onMouseUp(event: MouseEvent) {
    if (this.isDragging) {
      this.upX = event.clientX - this.offsetX;
      this.upY = event.clientY - this.offsetY;
    }
    this.isDragging = false;
  }

  onMouseMove(event: MouseEvent) {
    this.startX = event.clientX - this.offsetX - this.downX + this.upX;
    this.startY = event.clientY - this.offsetY - this.downY + this.upY;
    // if the drag flag is set, clear the canvas and draw the image
    const context = this.canvas.getContext('2d');
    if (this.isDragging && context) {
      this.draw();
    }

    /* if (this.isDragging) {
       const canvas = this.canvasElement.nativeElement;
       const context = canvas.getContext('2d');
       const dx = event.clientX - this.startX;
       const dy = event.clientY - this.startY;
       if (context) {
         console.log(context);
         context.clearRect(0, 0, canvas.width, canvas.height);
         context.drawImage(this.image, dx, dy, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

         this.startX = dx;
         this.startY = dy;
       }
     }*/
  }

  outPutImage() {
    this.canvas.toBlob((blob: Blob) => {
      if (blob) {
        const file = new File([blob], 'profileimage.jpg', { type: "image/jpeg" });
        this.item.emit(file);
      }
    }, 'image/jpeg');
  }
}
