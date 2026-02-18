import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
  inject
} from '@angular/core';

type RevealOrigin = 'top' | 'right' | 'bottom' | 'left';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private observer?: IntersectionObserver;

  @Input() revealDelay = 0;
  @Input() revealDistance = 24;
  @Input() revealThreshold = 0.2;
  @Input() revealOrigin: RevealOrigin = 'bottom';
  @Input() revealOnce = true;

  ngAfterViewInit(): void {
    const element = this.elementRef.nativeElement;
    const axis = this.getAxisByOrigin();

    this.renderer.addClass(element, 'reveal-on-scroll');
    this.renderer.setStyle(element, '--reveal-delay', `${this.revealDelay}ms`);
    this.renderer.setStyle(element, '--reveal-translate-x', `${axis.x}px`);
    this.renderer.setStyle(element, '--reveal-translate-y', `${axis.y}px`);

    if (!('IntersectionObserver' in globalThis)) {
      this.renderer.addClass(element, 'is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            if (!this.revealOnce) {
              this.renderer.removeClass(element, 'is-visible');
            }
            continue;
          }

          this.renderer.addClass(element, 'is-visible');

          if (this.revealOnce) {
            this.observer?.unobserve(element);
          }
        }
      },
      {
        threshold: this.revealThreshold
      }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private getAxisByOrigin(): { x: number; y: number } {
    switch (this.revealOrigin) {
      case 'top':
        return { x: 0, y: -this.revealDistance };
      case 'right':
        return { x: this.revealDistance, y: 0 };
      case 'left':
        return { x: -this.revealDistance, y: 0 };
      case 'bottom':
      default:
        return { x: 0, y: this.revealDistance };
    }
  }
}
