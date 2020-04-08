import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CarouselConfig } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-image-slide',
  templateUrl: './image-slide.component.html',
  styleUrls: ['./image-slide.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 0, noPause: true, showIndicators: true } }
  ]
})
export class ImageSlideComponent implements OnInit {
  imageLoadder: any;

  numberOfItems = 0;
  constructor(private _bsModalRef: BsModalRef) { }
  ngOnInit() {
  }
  //close Modal
  onCancel(): void {
    this._bsModalRef.hide();
  }
}
