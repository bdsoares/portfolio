import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  computed,
  inject,
  signal
} from '@angular/core';
import { NgParticlesService, NgxParticlesModule } from '@tsparticles/angular';
import { type Engine, type ISourceOptions } from '@tsparticles/engine';
import { loadFull } from 'tsparticles';
import { UiPreferencesService } from '../../../../core/services/ui-preferences.service';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { PortfolioCopy, ProfileData, SocialLink } from '../../models/portfolio.models';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [NgxParticlesModule, RevealOnScrollDirective],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSectionComponent implements OnDestroy {
  private readonly ngParticlesService = inject(NgParticlesService);
  private particlesInitialized = false;
  private readonly onWindowLoad = (): void => {
    this.shouldRenderParticles.set(true);
    this.initializeParticles();
  };

  private readonly darkParticlesOptions: ISourceOptions = {
    fpsLimit: 90,
    fullScreen: {
      enable: false
    },
    detectRetina: true,
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onClick: {
          enable: true,
          mode: 'push'
        },
        onHover: {
          enable: true,
          mode: 'grab'
        },
        resize: {
          delay: 0.5,
          enable: true
        }
      },
      modes: {
        grab: {
          distance: 130,
          links: {
            opacity: 0.3
          }
        },
        push: {
          quantity: 1
        }
      }
    },
    particles: {
      color: {
        value: ['#7fb1ff', '#8ed8ff', '#4f73b8']
      },
      links: {
        enable: true,
        distance: 120,
        opacity: 0.2,
        width: 1,
        color: '#6f9ce5'
      },
      move: {
        enable: true,
        direction: 'none',
        outModes: {
          default: 'out'
        },
        speed: 0.38,
        random: false,
        straight: false
      },
      number: {
        density: {
          enable: true,
          width: 1100,
          height: 650
        },
        value: 54
      },
      opacity: {
        value: {
          min: 0.12,
          max: 0.48
        },
        animation: {
          enable: true,
          speed: 0.35,
          sync: false
        }
      },
      shape: {
        type: 'circle'
      },
      size: {
        value: {
          min: 1,
          max: 2.6
        },
        animation: {
          enable: true,
          speed: 0.75,
          sync: false
        }
      },
      twinkle: {
        particles: {
          enable: true,
          frequency: 0.012,
          color: '#ffffff',
          opacity: 0.6
        }
      }
    }
  };

  private readonly lightParticlesOptions: ISourceOptions = {
    fpsLimit: 90,
    fullScreen: {
      enable: false
    },
    detectRetina: true,
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onClick: {
          enable: true,
          mode: 'push'
        },
        onHover: {
          enable: true,
          mode: 'grab'
        },
        resize: {
          delay: 0.5,
          enable: true
        }
      },
      modes: {
        grab: {
          distance: 125,
          links: {
            opacity: 0.24
          }
        },
        push: {
          quantity: 1
        }
      }
    },
    particles: {
      color: {
        value: ['#456aa8', '#5f8fd6', '#6faadf']
      },
      links: {
        enable: true,
        distance: 120,
        opacity: 0.16,
        width: 1,
        color: '#547ec5'
      },
      move: {
        enable: true,
        direction: 'none',
        outModes: {
          default: 'out'
        },
        speed: 0.34,
        random: false,
        straight: false
      },
      number: {
        density: {
          enable: true,
          width: 1100,
          height: 650
        },
        value: 54
      },
      opacity: {
        value: {
          min: 0.2,
          max: 0.44
        },
        animation: {
          enable: true,
          speed: 0.3,
          sync: false
        }
      },
      shape: {
        type: 'circle'
      },
      size: {
        value: {
          min: 1,
          max: 2.4
        },
        animation: {
          enable: true,
          speed: 0.68,
          sync: false
        }
      },
      twinkle: {
        particles: {
          enable: true,
          frequency: 0.008,
          color: '#5f8fd6',
          opacity: 0.35
        }
      }
    }
  };

  @Input({ required: true }) profile!: ProfileData;
  @Input({ required: true }) socialLinks: SocialLink[] = [];
  @Input({ required: true }) copy!: PortfolioCopy['hero'];

  protected readonly ui = inject(UiPreferencesService);
  protected readonly particlesId = 'hero-tech-particles';
  protected readonly shouldRenderParticles = signal(this.isDocumentReady());
  protected readonly particlesOptions = computed<ISourceOptions>(() =>
    this.ui.theme() === 'light' ? this.lightParticlesOptions : this.darkParticlesOptions
  );

  constructor() {
    const windowRef = this.getWindowRef();

    if (this.shouldRenderParticles()) {
      this.initializeParticles();
    } else if (windowRef) {
      windowRef.addEventListener('load', this.onWindowLoad, { once: true });
    }
  }

  protected trackByLabel(_: number, link: SocialLink): string {
    return link.href;
  }

  ngOnDestroy(): void {
    const windowRef = this.getWindowRef();

    if (windowRef) {
      windowRef.removeEventListener('load', this.onWindowLoad);
    }
  }

  private getWindowRef(): Window | null {
    return typeof globalThis.window === 'undefined' ? null : globalThis.window;
  }

  private isDocumentReady(): boolean {
    return typeof globalThis.document !== 'undefined' && globalThis.document.readyState === 'complete';
  }

  private initializeParticles(): void {
    if (this.particlesInitialized) {
      return;
    }

    this.particlesInitialized = true;

    void this.ngParticlesService.init(async (engine: Engine) => {
      await loadFull(engine);
    });
  }
}
