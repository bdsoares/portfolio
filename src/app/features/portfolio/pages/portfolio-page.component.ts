import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  inject,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { UiPreferencesService } from '../../../core/services/ui-preferences.service';
import {
  FooterMetaData,
  PortfolioCopy,
  PortfolioDynamicContent,
  PortfolioProject,
  ProfileData,
  SocialLink,
  TimelineItem
} from '../models/portfolio.models';
import { PortfolioContentService } from '../services/portfolio-content.service';
import { FooterSectionComponent } from '../sections/footer-section/footer-section.component';
import { AboutSectionComponent } from '../sections/about-section/about-section.component';
import { HeroSectionComponent } from '../sections/hero-section/hero-section.component';
import { ProjectsSectionComponent } from '../sections/projects-section/projects-section.component';
import { TimelineSectionComponent } from '../sections/timeline-section/timeline-section.component';
import { ParallaxSceneDirective } from '../../../shared/directives/parallax-scene.directive';
import { PreferencesControlsComponent } from '../../../shared/components/preferences-controls/preferences-controls.component';

const EMPTY_LOCALIZED_TEXT = {
  pt: '',
  en: ''
} as const;

const EMPTY_PROFILE_DATA: ProfileData = {
  name: '',
  role: EMPTY_LOCALIZED_TEXT,
  location: EMPTY_LOCALIZED_TEXT,
  tagline: EMPTY_LOCALIZED_TEXT,
  summary: [],
  focusAreas: []
};

const EMPTY_FOOTER_META: FooterMetaData = {
  sourceCodeUrl: '',
  sourceCodeLabel: EMPTY_LOCALIZED_TEXT,
  playfulSignature: EMPTY_LOCALIZED_TEXT
};

const EMPTY_DYNAMIC_CONTENT: PortfolioDynamicContent = {
  profile: EMPTY_PROFILE_DATA,
  socialLinks: [],
  projects: [],
  timeline: [],
  footerMeta: EMPTY_FOOTER_META
};

const EMPTY_PORTFOLIO_COPY: PortfolioCopy = {
  nav: {
    about: EMPTY_LOCALIZED_TEXT,
    projects: EMPTY_LOCALIZED_TEXT,
    timeline: EMPTY_LOCALIZED_TEXT,
    languageAriaLabel: EMPTY_LOCALIZED_TEXT,
    themeAriaLabel: {
      dark: EMPTY_LOCALIZED_TEXT,
      light: EMPTY_LOCALIZED_TEXT
    }
  },
  hero: {
    socialAriaLabel: EMPTY_LOCALIZED_TEXT,
    cta: EMPTY_LOCALIZED_TEXT
  },
  about: {
    eyebrow: EMPTY_LOCALIZED_TEXT,
    heading: EMPTY_LOCALIZED_TEXT,
    focusTitle: EMPTY_LOCALIZED_TEXT
  },
  projects: {
    eyebrow: EMPTY_LOCALIZED_TEXT,
    heading: EMPTY_LOCALIZED_TEXT,
    filterByTechnology: EMPTY_LOCALIZED_TEXT,
    allTechnologies: EMPTY_LOCALIZED_TEXT,
    liveProject: EMPTY_LOCALIZED_TEXT,
    repository: EMPTY_LOCALIZED_TEXT,
    learnMore: EMPTY_LOCALIZED_TEXT,
    privateTag: EMPTY_LOCALIZED_TEXT,
    modalHeading: EMPTY_LOCALIZED_TEXT,
    closeModal: EMPTY_LOCALIZED_TEXT,
    noResults: EMPTY_LOCALIZED_TEXT
  },
  timeline: {
    eyebrow: EMPTY_LOCALIZED_TEXT,
    heading: EMPTY_LOCALIZED_TEXT
  },
  footer: {
    quickLinksTitle: EMPTY_LOCALIZED_TEXT,
    contactTitle: EMPTY_LOCALIZED_TEXT,
    backToTop: EMPTY_LOCALIZED_TEXT,
    rights: EMPTY_LOCALIZED_TEXT,
    builtWith: EMPTY_LOCALIZED_TEXT
  }
};

@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [
    ParallaxSceneDirective,
    PreferencesControlsComponent,
    HeroSectionComponent,
    AboutSectionComponent,
    ProjectsSectionComponent,
    TimelineSectionComponent,
    FooterSectionComponent
  ],
  templateUrl: './portfolio-page.component.html',
  styleUrl: './portfolio-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioPageComponent implements AfterViewInit {
  private readonly contentService = inject(PortfolioContentService);
  @ViewChild('homeStageRef') private homeStageRef?: ElementRef<HTMLElement>;

  protected readonly ui = inject(UiPreferencesService);
  protected readonly isNavVisible = signal(false);
  protected readonly isMobileMenuOpen = signal(false);
  protected readonly isProjectModalOpen = signal(false);
  protected readonly shouldShowTopNav = computed(() => this.isNavVisible() && !this.isProjectModalOpen());
  private isPageLoaded = false;

  private readonly content = toSignal(
    this.contentService.getPortfolioData().pipe(
      catchError(() => of<PortfolioDynamicContent>(EMPTY_DYNAMIC_CONTENT))
    ),
    {
      initialValue: EMPTY_DYNAMIC_CONTENT
    }
  );
  private readonly i18nContent = toSignal(
    this.contentService.getPortfolioI18n().pipe(
      catchError(() => of<PortfolioCopy>(EMPTY_PORTFOLIO_COPY))
    ),
    {
      initialValue: EMPTY_PORTFOLIO_COPY
    }
  );

  protected readonly profile = computed<ProfileData>(() => this.content().profile);
  protected readonly socialLinks = computed<SocialLink[]>(() => this.content().socialLinks);
  protected readonly projects = computed<PortfolioProject[]>(() => this.content().projects);
  protected readonly timeline = computed<TimelineItem[]>(() => this.content().timeline);
  protected readonly footerMeta = computed<FooterMetaData>(() => this.content().footerMeta);
  protected get copy(): PortfolioCopy {
    return this.i18nContent();
  }

  ngAfterViewInit(): void {
    this.runAfterPageLoad(() => {
      this.forceInitialScrollToHome();
    });
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  protected onViewportChange(): void {
    if (!this.isPageLoaded) {
      return;
    }

    this.updateNavVisibility();
    this.handleDesktopMenuState();
  }

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  protected onProjectModalStateChange(isOpen: boolean): void {
    this.isProjectModalOpen.set(isOpen);

    if (isOpen) {
      this.closeMobileMenu();
    }
  }

  private updateNavVisibility(): void {
    const windowRef = this.getWindowRef();

    if (!windowRef) {
      return;
    }

    const homeStageHeight = this.homeStageRef?.nativeElement.offsetHeight ?? windowRef.innerHeight;
    const showAfter = Math.max(0, homeStageHeight - 36);
    this.isNavVisible.set(windowRef.scrollY >= showAfter);
  }

  private forceInitialScrollToHome(): void {
    const windowRef = this.getWindowRef();

    if (!windowRef) {
      return;
    }

    this.resetNavigationState(windowRef);
    this.closeMobileMenu();
  }

  private handleDesktopMenuState(): void {
    const windowRef = this.getWindowRef();

    if (!windowRef) {
      return;
    }

    if (windowRef.innerWidth > 650 && this.isMobileMenuOpen()) {
      this.closeMobileMenu();
    }
  }

  private getWindowRef(): Window | null {
    return typeof globalThis.window === 'undefined' ? null : globalThis.window;
  }

  private runAfterPageLoad(callback: () => void): void {
    const windowRef = this.getWindowRef();

    if (!windowRef) {
      return;
    }

    if (windowRef.document.readyState === 'complete') {
      this.isPageLoaded = true;
      callback();
      return;
    }

    const onLoad = () => {
      this.isPageLoaded = true;
      callback();
    };

    windowRef.addEventListener('load', onLoad, { once: true });
  }

  private resetNavigationState(windowRef: Window): void {
    if ('scrollRestoration' in windowRef.history) {
      windowRef.history.scrollRestoration = 'manual';
    }

    if (windowRef.location.hash) {
      windowRef.history.replaceState(null, '', `${windowRef.location.pathname}${windowRef.location.search}`);
    }
  }
}
