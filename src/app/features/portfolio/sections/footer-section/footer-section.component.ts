import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { UiPreferencesService } from '../../../../core/services/ui-preferences.service';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { FooterMetaData, PortfolioCopy, ProfileData, SocialLink } from '../../models/portfolio.models';

@Component({
  selector: 'app-footer-section',
  standalone: true,
  imports: [RevealOnScrollDirective],
  templateUrl: './footer-section.component.html',
  styleUrl: './footer-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterSectionComponent {
  private readonly year = new Date().getFullYear();

  @Input({ required: true }) profile!: ProfileData;
  @Input({ required: true }) socialLinks: SocialLink[] = [];
  @Input({ required: true }) footerMeta!: FooterMetaData;
  @Input({ required: true }) copy!: PortfolioCopy['footer'];
  @Input({ required: true }) navCopy!: PortfolioCopy['nav'];

  protected readonly ui = inject(UiPreferencesService);
  protected readonly currentYear = this.year;

  protected get emailHref(): string {
    const link = this.socialLinks.find((socialLink) => socialLink.icon === 'email');
    return link?.href ?? 'mailto:contato@brunodaniel.com';
  }

  protected trackByLabel(_: number, link: SocialLink): string {
    return link.href;
  }

  protected get playfulSignatureParts(): { before: string; after: string } {
    const signature = this.ui.text(this.footerMeta.playfulSignature);
    const [before, after = ''] = signature.split('{heart}');
    return { before: before.trimEnd(), after: after.trimStart() };
  }
}
