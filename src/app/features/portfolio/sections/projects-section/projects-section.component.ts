import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  inject,
  signal
} from '@angular/core';
import { UiPreferencesService } from '../../../../core/services/ui-preferences.service';
import { ParallaxSceneDirective } from '../../../../shared/directives/parallax-scene.directive';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { TiltCardDirective } from '../../../../shared/directives/tilt-card.directive';
import { PortfolioCopy, PortfolioProject } from '../../models/portfolio.models';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [ParallaxSceneDirective, RevealOnScrollDirective, TiltCardDirective],
  templateUrl: './projects-section.component.html',
  styleUrl: './projects-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsSectionComponent implements OnDestroy {
  @Input({ required: true }) projects: PortfolioProject[] = [];
  @Input({ required: true }) copy!: PortfolioCopy['projects'];
  @Output() modalOpenChange = new EventEmitter<boolean>();

  protected readonly ui = inject(UiPreferencesService);
  protected readonly selectedTechnology = signal('all');
  protected readonly selectedPrivateProject = signal<PortfolioProject | null>(null);

  protected get technologyFilters(): string[] {
    const technologies = new Set<string>();

    for (const project of this.projects) {
      for (const technology of project.technologies) {
        technologies.add(technology);
      }
    }

    return ['all', ...Array.from(technologies).sort((a, b) => a.localeCompare(b))];
  }

  protected get filteredProjects(): PortfolioProject[] {
    const activeFilter = this.selectedTechnology();

    if (activeFilter === 'all') {
      return this.projects;
    }

    return this.projects.filter((project) => project.technologies.includes(activeFilter));
  }

  protected setTechnologyFilter(filter: string): void {
    this.selectedTechnology.set(filter);
  }

  protected isFilterActive(filter: string): boolean {
    return this.selectedTechnology() === filter;
  }

  protected trackByTitle(_: number, project: PortfolioProject): string {
    return project.title.pt;
  }

  protected cardScrollOffset(index: number): string {
    const baseOffset = ((index % 3) - 1) * 6;
    const parallaxIntensity = 10 + (index % 4) * 2;

    return `calc(${baseOffset}px + (var(--parallax-center, 0) * ${parallaxIntensity}px))`;
  }

  protected isPublicProject(project: PortfolioProject): project is PortfolioProject & {
    liveUrl: string;
    repositoryUrl: string;
  } {
    return project.kind === 'public' && !!project.liveUrl && !!project.repositoryUrl;
  }

  protected isPrivateProject(project: PortfolioProject): boolean {
    return project.kind === 'private' && !!project.privateDetails;
  }

  protected openPrivateProjectDetails(project: PortfolioProject): void {
    if (!this.isPrivateProject(project)) {
      return;
    }

    this.selectedPrivateProject.set(project);
    this.modalOpenChange.emit(true);
    this.lockBodyScroll();
  }

  protected closePrivateProjectDetails(): void {
    this.selectedPrivateProject.set(null);
    this.modalOpenChange.emit(false);
    this.unlockBodyScroll();
  }

  protected onModalBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closePrivateProjectDetails();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscapePressed(): void {
    if (this.selectedPrivateProject()) {
      this.closePrivateProjectDetails();
    }
  }

  ngOnDestroy(): void {
    this.modalOpenChange.emit(false);
    this.unlockBodyScroll();
  }

  private lockBodyScroll(): void {
    if (typeof globalThis.document === 'undefined') {
      return;
    }

    globalThis.document.body.style.overflow = 'hidden';
  }

  private unlockBodyScroll(): void {
    if (typeof globalThis.document === 'undefined') {
      return;
    }

    globalThis.document.body.style.overflow = '';
  }
}
