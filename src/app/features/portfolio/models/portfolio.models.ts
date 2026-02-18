import { LocalizedText } from '../../../core/models/preferences.models';

export interface ProfileData {
  name: string;
  role: LocalizedText;
  location: LocalizedText;
  tagline: LocalizedText;
  summary: LocalizedText[];
  focusAreas: LocalizedText[];
}

export type SocialIcon = 'linkedin' | 'github' | 'email';

export interface SocialLink {
  label: LocalizedText;
  href: string;
  icon: SocialIcon;
  ariaLabel: LocalizedText;
}

export interface PortfolioProject {
  kind: 'public' | 'private';
  title: LocalizedText;
  description: LocalizedText;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  repositoryUrl?: string;
  privateDetails?: LocalizedText;
}

export interface TimelineItem {
  period: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  skills: LocalizedText[];
}

export interface FooterMetaData {
  sourceCodeUrl: string;
  sourceCodeLabel: LocalizedText;
  playfulSignature: LocalizedText;
}

export interface PortfolioDynamicContent {
  profile: ProfileData;
  socialLinks: SocialLink[];
  projects: PortfolioProject[];
  timeline: TimelineItem[];
  footerMeta: FooterMetaData;
}

export interface PortfolioCopy {
  nav: {
    about: LocalizedText;
    projects: LocalizedText;
    timeline: LocalizedText;
    languageAriaLabel: LocalizedText;
    themeAriaLabel: {
      dark: LocalizedText;
      light: LocalizedText;
    };
  };
  hero: {
    socialAriaLabel: LocalizedText;
    cta: LocalizedText;
  };
  about: {
    eyebrow: LocalizedText;
    heading: LocalizedText;
    focusTitle: LocalizedText;
  };
  projects: {
    eyebrow: LocalizedText;
    heading: LocalizedText;
    filterByTechnology: LocalizedText;
    allTechnologies: LocalizedText;
    liveProject: LocalizedText;
    repository: LocalizedText;
    learnMore: LocalizedText;
    privateTag: LocalizedText;
    modalHeading: LocalizedText;
    closeModal: LocalizedText;
    noResults: LocalizedText;
  };
  timeline: {
    eyebrow: LocalizedText;
    heading: LocalizedText;
  };
  footer: {
    quickLinksTitle: LocalizedText;
    contactTitle: LocalizedText;
    backToTop: LocalizedText;
    rights: LocalizedText;
    builtWith: LocalizedText;
  };
}
