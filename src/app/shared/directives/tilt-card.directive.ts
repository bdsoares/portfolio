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
  selector: '[appTiltCard]',
  standalone: true
})
export class TiltCardDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly ngZone = inject(NgZone);

  @Input() tiltMax = 7;
  @Input() tiltPerspective = 1000;
  @Input() tiltScale = 1.01;

  private frameId: number | null = null;
  private currentX = 0;
  private currentY = 0;
  private targetX = 0;
  private targetY = 0;
  private readonly canTilt = this.detectTiltSupport();

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;

    this.renderer.setStyle(element, '--tilt-rotate-x', '0deg');
    this.renderer.setStyle(element, '--tilt-rotate-y', '0deg');
    this.renderer.setStyle(element, '--tilt-glow-x', '50%');
    this.renderer.setStyle(element, '--tilt-glow-y', '50%');
    this.renderer.setStyle(element, '--tilt-perspective', `${this.tiltPerspective}px`);
    this.renderer.setStyle(element, '--tilt-scale', `${this.tiltScale}`);

    if (!this.canTilt) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      element.addEventListener('pointermove', this.onPointerMove, { passive: true });
      element.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    });
  }

  ngOnDestroy(): void {
    const element = this.elementRef.nativeElement;
    element.removeEventListener('pointermove', this.onPointerMove);
    element.removeEventListener('pointerleave', this.onPointerLeave);

    if (this.frameId !== null && typeof globalThis.window !== 'undefined') {
      globalThis.window.cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  private readonly onPointerMove = (event: Event): void => {
    if (!(event instanceof PointerEvent)) {
      return;
    }

    const element = this.elementRef.nativeElement;
    const bounds = element.getBoundingClientRect();
    const normalizedX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const normalizedY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;

    this.targetX = this.clamp(-normalizedY * this.tiltMax, -this.tiltMax, this.tiltMax);
    this.targetY = this.clamp(normalizedX * this.tiltMax, -this.tiltMax, this.tiltMax);

    const glowX = this.clamp(((normalizedX + 1) / 2) * 100, 0, 100);
    const glowY = this.clamp(((normalizedY + 1) / 2) * 100, 0, 100);
    this.renderer.setStyle(element, '--tilt-glow-x', `${glowX.toFixed(2)}%`);
    this.renderer.setStyle(element, '--tilt-glow-y', `${glowY.toFixed(2)}%`);

    this.queueFrame();
  };

  private readonly onPointerLeave = (): void => {
    this.targetX = 0;
    this.targetY = 0;
    this.renderer.setStyle(this.elementRef.nativeElement, '--tilt-glow-x', '50%');
    this.renderer.setStyle(this.elementRef.nativeElement, '--tilt-glow-y', '50%');
    this.queueFrame();
  };

  private queueFrame(): void {
    if (this.frameId !== null || typeof globalThis.window === 'undefined') {
      return;
    }

    this.frameId = globalThis.window.requestAnimationFrame(() => {
      this.frameId = null;
      this.animateFrame();
    });
  }

  private animateFrame(): void {
    const easing = 0.18;

    this.currentX += (this.targetX - this.currentX) * easing;
    this.currentY += (this.targetY - this.currentY) * easing;

    const element = this.elementRef.nativeElement;
    this.renderer.setStyle(element, '--tilt-rotate-x', `${this.currentX.toFixed(2)}deg`);
    this.renderer.setStyle(element, '--tilt-rotate-y', `${this.currentY.toFixed(2)}deg`);

    const isSettled =
      Math.abs(this.targetX - this.currentX) < 0.05 && Math.abs(this.targetY - this.currentY) < 0.05;

    if (!isSettled) {
      this.queueFrame();
      return;
    }

    this.currentX = this.targetX;
    this.currentY = this.targetY;
  }

  private detectTiltSupport(): boolean {
    if (typeof globalThis.window === 'undefined' || typeof globalThis.matchMedia !== 'function') {
      return false;
    }

    const reducedMotion = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = globalThis.matchMedia('(hover: hover) and (pointer: fine)').matches;

    return !reducedMotion && finePointer;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
