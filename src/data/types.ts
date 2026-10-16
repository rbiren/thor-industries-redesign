export interface Card {
  title: string;
  text?: string;
  href: string;
  image?: string;
  eyebrow?: string;
  action?: string;
}
export interface Section {
  title: string;
  text?: string[];
  bullets?: string[];
  image?: string;
  href?: string;
  action?: string;
  cards?: Card[];
  accordion?: boolean;
}
export interface Page {
  slug: string;
  title: string;
  description: string;
  hero: string;
  heroAlt: string;
  label: string;
  lead?: string[];
  sections: Section[];
  kind?: 'home' | 'stories' | 'category' | 'companies' | 'faq';
}
