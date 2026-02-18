import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { UiPreferencesService } from '../../../../core/services/ui-preferences.service';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { PortfolioCopy, ProfileData } from '../../models/portfolio.models';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [RevealOnScrollDirective],
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutSectionComponent {
  @Input({ required: true }) profile!: ProfileData;
  @Input({ required: true }) copy!: PortfolioCopy['about'];

  protected readonly ui = inject(UiPreferencesService);
}
