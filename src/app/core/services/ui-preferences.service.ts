import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';
import { AppLanguage, AppTheme, LocalizedText } from '../models/preferences.models';

const LANGUAGE_STORAGE_KEY = 'portfolio.language';
const THEME_STORAGE_KEY = 'portfolio.theme';

@Injectable({
  providedIn: 'root'
})
export class UiPreferencesService {
  private readonly document = inject(DOCUMENT);

  readonly language = signal<AppLanguage>(this.getInitialLanguage());
  readonly theme = signal<AppTheme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const activeTheme = this.theme();
      this.document.body.dataset['theme'] = activeTheme;
      this.persist(THEME_STORAGE_KEY, activeTheme);
    });

    effect(() => {
      const activeLanguage = this.language();
      this.document.documentElement.lang = activeLanguage === 'pt' ? 'pt-BR' : 'en';
      this.persist(LANGUAGE_STORAGE_KEY, activeLanguage);
    });
  }

  text(value: LocalizedText): string {
    return value[this.language()];
  }

  setLanguage(language: AppLanguage): void {
    this.language.set(language);
  }

  toggleTheme(): void {
    this.theme.update((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  }

  private getInitialLanguage(): AppLanguage {
    const storedLanguage = this.readStorage(LANGUAGE_STORAGE_KEY);

    return storedLanguage === 'en' ? 'en' : 'pt';
  }

  private getInitialTheme(): AppTheme {
    const storedTheme = this.readStorage(THEME_STORAGE_KEY);

    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }

    if (typeof globalThis.matchMedia === 'function') {
      return globalThis.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    return 'dark';
  }

  private readStorage(key: string): string | null {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  private persist(key: string, value: string): void {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      // Persistencia e opcional e pode falhar em contextos restritos.
    }
  }
}
