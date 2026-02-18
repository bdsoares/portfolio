import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { UiPreferencesService } from '../../../../core/services/ui-preferences.service';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { PortfolioCopy, TimelineItem } from '../../models/portfolio.models';

@Component({
  selector: 'app-timeline-section',
  standalone: true,
  imports: [RevealOnScrollDirective],
  templateUrl: './timeline-section.component.html',
  styleUrl: './timeline-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineSectionComponent {
  @Input({ required: true }) items: TimelineItem[] = [];
  @Input({ required: true }) copy!: PortfolioCopy['timeline'];

  protected readonly ui = inject(UiPreferencesService);

  protected trackByPeriod(_: number, item: TimelineItem): string {
    return `${item.period.pt}-${item.title.pt}`;
  }

  protected getRevealOrigin(index: number): 'left' | 'right' {
    return index % 2 === 0 ? 'left' : 'right';
  }
}
