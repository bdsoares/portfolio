import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AppLanguage, LocalizedText } from '../../../core/models/preferences.models';
import { UiPreferencesService } from '../../../core/services/ui-preferences.service';

interface ThemeAriaLabels {
  dark: LocalizedText;
  light: LocalizedText;
}

@Component({
  selector: 'app-preferences-controls',
  standalone: true,
  templateUrl: './preferences-controls.component.html',
  styleUrl: './preferences-controls.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferencesControlsComponent {
  @Input({ required: true }) languageSwitchClass!: string;
  @Input({ required: true }) themeToggleClass!: string;
  @Input({ required: true }) languageAriaLabel!: LocalizedText;
  @Input({ required: true }) themeAriaLabels!: ThemeAriaLabels;
  @Output() interaction = new EventEmitter<void>();

  protected readonly ui = inject(UiPreferencesService);

  protected setLanguage(language: AppLanguage): void {
    this.ui.setLanguage(language);
    this.interaction.emit();
  }

  protected toggleTheme(): void {
    this.ui.toggleTheme();
    this.interaction.emit();
  }

  protected themeToggleAriaLabel(): string {
    return this.ui.theme() === 'dark'
      ? this.ui.text(this.themeAriaLabels.dark)
      : this.ui.text(this.themeAriaLabels.light);
  }
}
