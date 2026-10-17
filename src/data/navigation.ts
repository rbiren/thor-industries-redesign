import type { NavGroup, NavItem } from './types.ts';
import { sourceHandoffs } from './routes.ts';

export const navigation: NavGroup[] = [
  {
    label: 'RV Finder',
    href: sourceHandoffs.rvFinder,
    external: true,
  },
  {
    label: 'Stories',
    slug: 'stories',
    items: [
      { label: 'View All', slug: 'stories' },
      { label: 'Learn', slug: 'stories/category/learn' },
      { label: 'Recipes', slug: 'stories/category/recipes' },
      { label: 'On the Road', slug: 'stories/category/on-the-road' },
      { label: 'Travel', slug: 'stories/category/travel' },
      { label: 'Video', slug: 'stories/category/video' },
    ],
  },
  {
    label: 'RV Basics',
    items: [
      { label: 'Find Your RV', href: sourceHandoffs.rvFinder, external: true },
      { label: 'RV Types', slug: 'rv-types' },
      { label: 'Trip Calculator', href: sourceHandoffs.tripCalculator, external: true },
      { label: 'Financing Your RV', slug: 'financing-your-rv' },
      { label: 'Towing Guide', slug: 'towing-guide' },
      { label: 'FAQ', slug: 'faq' },
    ],
  },
  {
    label: 'About THOR',
    items: [
      { label: 'Innovation', slug: 'innovation' },
      { label: 'History', slug: 'history' },
      { label: 'Community', slug: 'community' },
      { label: 'News & Events', slug: 'news-events' },
      { label: 'Careers', slug: 'careers' },
    ],
  },
  {
    label: 'THOR Companies',
    slug: 'thor-companies',
  },
  {
    label: 'Sustainability',
    slug: 'sustainability',
    items: [
      { label: 'Home', slug: 'sustainability' },
      { label: 'Report', slug: 'sustainability-report' },
      { label: 'Innovation', slug: 'innovation' },
      { label: 'Environmental', slug: 'sustainability-environmental' },
      { label: 'Social Responsibility', slug: 'social-responsibility' },
      { label: 'Governance', slug: 'governance' },
      { label: 'Supply Management', slug: 'supply-management' },
    ],
  },
  {
    label: 'Investors',
    href: sourceHandoffs.investors,
    external: true,
  },
];

export const footerExploreLinks: NavItem[] = [
  { label: 'Explore Companies', slug: 'thor-companies' },
  { label: 'Explore Careers', slug: 'careers' },
  { label: 'Explore Sustainability', slug: 'sustainability' },
  { label: 'Explore Innovation', slug: 'innovation' },
];

export const footerGroups: NavGroup[] = [
  {
    label: 'Explore',
    items: [
      ...footerExploreLinks,
      { label: 'Stories', slug: 'stories' },
      { label: 'RV Finder', href: sourceHandoffs.rvFinder, external: true },
      { label: 'Investors', href: sourceHandoffs.investors, external: true },
    ],
  },
  {
    label: 'RV Basics',
    items: [
      { label: 'Find Your RV', href: sourceHandoffs.rvFinder, external: true },
      { label: 'RV Types', slug: 'rv-types' },
      { label: 'Trip Calculator', href: sourceHandoffs.tripCalculator, external: true },
      { label: 'Financing Your RV', slug: 'financing-your-rv' },
      { label: 'Towing Guide', slug: 'towing-guide' },
      { label: 'FAQ', slug: 'faq' },
    ],
  },
  {
    label: 'About THOR',
    items: [
      { label: 'Innovation', slug: 'innovation' },
      { label: 'History', slug: 'history' },
      { label: 'Community', slug: 'community' },
      { label: 'News & Events', slug: 'news-events' },
      { label: 'Careers', slug: 'careers' },
    ],
  },
  {
    label: 'Sustainability',
    items: [
      { label: 'Home', slug: 'sustainability' },
      { label: 'Report', slug: 'sustainability-report' },
      { label: 'Innovation', slug: 'innovation' },
      { label: 'Environmental', slug: 'sustainability-environmental' },
      { label: 'Social Responsibility', slug: 'social-responsibility' },
      { label: 'Governance', slug: 'governance' },
      { label: 'Supply Management', slug: 'supply-management' },
    ],
  },
];

export const footerLinks: NavItem[] = [
  { label: 'Contact Us', href: sourceHandoffs.contact, external: true },
  { label: 'Careers', slug: 'careers' },
  { label: 'Terms and Conditions', href: sourceHandoffs.terms, external: true },
  { label: 'Privacy Policy', href: sourceHandoffs.privacy, external: true },
  { label: 'Legal', href: sourceHandoffs.legal, external: true },
  { label: 'Cookie Policy', href: sourceHandoffs.cookies, external: true },
  { label: 'Accessibility', href: sourceHandoffs.accessibility, external: true },
];

export const socialLinks = [
  {
    label: 'Follow Thor Industries on Facebook',
    shortLabel: 'Facebook',
    href: sourceHandoffs.facebook,
  },
  {
    label: 'Follow Thor Industries on Instagram',
    shortLabel: 'Instagram',
    href: sourceHandoffs.instagram,
  },
  {
    label: 'Follow Thor Industries on Pinterest',
    shortLabel: 'Pinterest',
    href: sourceHandoffs.pinterest,
  },
  {
    label: 'Follow Thor Industries on Linkedin',
    shortLabel: 'Linkedin',
    href: sourceHandoffs.linkedin,
  },
  {
    label: 'Follow Thor Industries on Youtube',
    shortLabel: 'Youtube',
    href: sourceHandoffs.youtube,
  },
];
