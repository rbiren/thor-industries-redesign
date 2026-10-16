import { categories } from './stories.mjs';
import { sourceHandoffs } from './routes.ts';
import { routeHref } from '../lib/urls.ts';

export interface NavLink {
  title: string;
  href: string;
  slug?: string;
}

export interface NavItem {
  title: string;
  href?: string;
  slug?: string;
  links?: NavLink[];
}

const routeLink = (title: string, slug: string): NavLink => ({
  title,
  slug,
  href: routeHref(slug),
});

export const navigation: NavItem[] = [
  { title: 'RV Finder', href: sourceHandoffs.rvFinder },
  {
    title: 'About THOR',
    links: [
      routeLink('About Us', 'about-us'),
      routeLink('Our History', 'our-history'),
      routeLink('THOR Leadership', 'thor-leadership'),
      routeLink('Innovation', 'innovation'),
      routeLink('Operations', 'operations'),
      { title: 'Investors', href: sourceHandoffs.investors },
      { title: 'Newsroom', href: sourceHandoffs.newsroom },
    ],
  },
  {
    title: 'Our Companies',
    links: [
      routeLink('Global Family of Companies', 'global-family-of-companies'),
      routeLink('European Companies', 'european-companies'),
      routeLink('Hymer', 'hymer'),
      routeLink('Supply Companies', 'supply-companies'),
      routeLink('Airxcel', 'airxcel'),
    ],
  },
  {
    title: 'RV Basics',
    links: [
      { title: 'RV Finder', href: sourceHandoffs.rvFinder },
      routeLink('RV Types', 'rv-types'),
      routeLink('RV FAQ', 'rv-faq'),
      { title: 'Dealer Locator', href: sourceHandoffs.dealerLocator },
    ],
  },
  {
    title: 'Stories',
    links: [
      routeLink('View All', 'stories'),
      ...categories.map(category => routeLink(category.title, `stories/${category.slug}`)),
    ],
  },
  {
    title: 'Sustainability',
    links: [
      routeLink('Home', 'sustainability'),
      { title: 'Report', href: sourceHandoffs.sustainabilityReport },
      routeLink('Innovation', 'innovation'),
      routeLink('Environmental', 'environmental'),
      routeLink('Social Responsibility', 'social-responsibility'),
      routeLink('Governance', 'governance'),
      { title: 'Supply Management', href: sourceHandoffs.supplyManagement },
    ],
  },
  { title: 'Investors', href: sourceHandoffs.investors },
];

