import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';


@Component({
  selector: 'app-zoomable-image',
  templateUrl: './zoomable-image.component.html',
  styleUrl: './zoomable-image.component.scss'
})
export class ZoomableImageComponent {
  @Input() imageUrl: any;

  private readonly zoomLevel = 2.0;
  private isZooming = false;


  @HostListener('window:resize')
  onResize() {
    this.resetZoom();
  }

  zoomImage(event: MouseEvent | Touch) {
    this.isZooming = true;
    const image = event.target as HTMLImageElement;
    const container = image.parentElement as HTMLElement;
    const rect = container.getBoundingClientRect();
    
    const x = ((event instanceof Touch ? event.clientX : event.clientX) - rect.left) / container.offsetWidth;
    const y = ((event instanceof Touch ? event.clientY : event.clientY) - rect.top) / container.offsetHeight;
    
    const transformOriginX = x * 100;
    const transformOriginY = y * 100;
    
    image.style.transformOrigin = `${transformOriginX}% ${transformOriginY}%`;
    image.style.transform = `scale(${this.zoomLevel})`;
  }

  resetZoom() {
    this.isZooming = false;
    const image = document.querySelector('.image-container img') as HTMLImageElement;
    image.style.transformOrigin = 'center center';
    image.style.transform = 'scale(1)';
  }

  preventDefaultTouch(event: TouchEvent) {
    if (this.isZooming) {
      event.preventDefault();
    }
  }
}
