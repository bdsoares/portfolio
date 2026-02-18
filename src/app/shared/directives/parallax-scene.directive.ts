import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  inject
} from '@angular/core';

@Directive({
  selector: '[appParallaxScene]',
  standalone: true
})
export class ParallaxSceneDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly ngZone = inject(NgZone);

  @Input() parallaxSoft = 18;
  @Input() parallaxMedium = 44;
  @Input() parallaxDeep = 92;
  @Input() parallaxObserverMargin = 260;
  @Input() parallaxEasePower = 1.7;

  private animationFrameId: number | null = null;
  private intersectionObserver?: IntersectionObserver;
  private isSceneNearViewport = true;
  private isPageLoaded = this.isDocumentReady();
  private readonly canAnimate = this.detectAnimationSupport();
  private readonly onWindowLoad = (): void => {
    this.isPageLoaded = true;
    this.requestFrame();
  };

  ngOnInit(): void {
    this.writeProgress(0.5);

    if (!this.canAnimate) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      if (!this.isPageLoaded && typeof globalThis.window !== 'undefined') {
        globalThis.window.addEventListener('load', this.onWindowLoad, { once: true });
      }

      if ('IntersectionObserver' in globalThis) {
        this.intersectionObserver = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.target !== this.elementRef.nativeElement) {
                continue;
              }

              this.isSceneNearViewport = entry.isIntersecting;

              if (entry.isIntersecting && this.isPageLoaded) {
                this.requestFrame();
              }
            }
          },
          {
            root: null,
            threshold: 0,
            rootMargin: `${this.parallaxObserverMargin}px 0px ${this.parallaxObserverMargin}px 0px`
          }
        );

        this.intersectionObserver.observe(this.elementRef.nativeElement);
      }

      globalThis.window.addEventListener('scroll', this.onViewportChange, { passive: true });
      globalThis.window.addEventListener('resize', this.onViewportChange, { passive: true });

      if (this.isPageLoaded) {
        this.requestFrame();
      }
    });
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();

    if (typeof globalThis.window !== 'undefined') {
      globalThis.window.removeEventListener('scroll', this.onViewportChange);
      globalThis.window.removeEventListener('resize', this.onViewportChange);
      globalThis.window.removeEventListener('load', this.onWindowLoad);
    }

    if (this.animationFrameId !== null && typeof globalThis.window !== 'undefined') {
      globalThis.window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private readonly onViewportChange = (): void => {
    if (!this.isSceneNearViewport || !this.isPageLoaded) {
      return;
    }

    this.requestFrame();
  };

  private requestFrame(): void {
    if (this.animationFrameId !== null || typeof globalThis.window === 'undefined' || !this.isPageLoaded) {
      return;
    }

    this.animationFrameId = globalThis.window.requestAnimationFrame(() => {
      this.animationFrameId = null;
      this.updateSceneProgress();
    });
  }

  private updateSceneProgress(): void {
    if (typeof globalThis.window === 'undefined') {
      return;
    }

    const element = this.elementRef.nativeElement;
    const bounds = element.getBoundingClientRect();
    const viewportHeight = globalThis.window.innerHeight || 1;
    const sceneTravelDistance = viewportHeight + bounds.height;
    const rawProgress = this.clamp((viewportHeight - bounds.top) / sceneTravelDistance, 0, 1);
    const easedProgress = this.easeInOut(rawProgress, this.parallaxEasePower);

    this.writeProgress(easedProgress);
  }

  private writeProgress(progress: number): void {
    const element = this.elementRef.nativeElement;
    const center = progress * 2 - 1;
    const softShift = center * this.parallaxSoft;
    const mediumShift = center * this.parallaxMedium;
    const deepShift = center * this.parallaxDeep;

    this.renderer.setStyle(element, '--parallax-progress', progress.toFixed(4));
    this.renderer.setStyle(element, '--parallax-center', center.toFixed(4));
    this.renderer.setStyle(element, '--parallax-shift-soft', `${softShift.toFixed(2)}px`);
    this.renderer.setStyle(element, '--parallax-shift-medium', `${mediumShift.toFixed(2)}px`);
    this.renderer.setStyle(element, '--parallax-shift-deep', `${deepShift.toFixed(2)}px`);
  }

  private easeInOut(value: number, power: number): number {
    const intensity = Math.max(1.05, power);

    if (value < 0.5) {
      return 0.5 * Math.pow(value * 2, intensity);
    }

    return 1 - 0.5 * Math.pow((1 - value) * 2, intensity);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private detectAnimationSupport(): boolean {
    if (typeof globalThis.window === 'undefined' || typeof globalThis.matchMedia !== 'function') {
      return false;
    }

    return !globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private isDocumentReady(): boolean {
    return typeof globalThis.document !== 'undefined' && globalThis.document.readyState === 'complete';
  }
}
