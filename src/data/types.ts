import type { CanonicalSlug } from './routes.ts';

export interface NavItem {
  label: string;
  slug?: CanonicalSlug;
  href?: string;
  external?: boolean;
}

export interface NavGroup {
  label: string;
  slug?: CanonicalSlug;
  href?: string;
  external?: boolean;
  items?: NavItem[];
}

export interface Card {
  title: string;
  text?: string;
  href: string;
  image?: string;
  imageAlt?: string;
  eyebrow?: string;
  action?: string;
}

export interface Section {
  title: string;
  subtitle?: string;
  text?: string[];
  bullets?: string[];
  image?: string;
  imageAlt?: string;
  href?: string;
  action?: string;
  cards?: Card[];
  accordion?: boolean;
}

export interface Page {
  slug: CanonicalSlug;
  title: string;
  description: string;
  hero: string;
  heroAlt: string;
  label: string;
  lead?: string[];
  sections: Section[];
  kind?: 'home' | 'stories' | 'category' | 'companies' | 'faq';
}
