import type { NavGroup } from './types.ts';
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
    slug: 'rv-types',
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
    slug: 'innovation',
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

export const footerGroups: NavGroup[] = [
  {
    label: 'Explore',
    items: [
      { label: 'THOR Companies', slug: 'thor-companies' },
      { label: 'RV Finder', href: sourceHandoffs.rvFinder, external: true },
      { label: 'Stories', slug: 'stories' },
      { label: 'Investors', href: sourceHandoffs.investors, external: true },
      { label: 'Sustainability', slug: 'sustainability' },
      { label: 'Contact Us', href: sourceHandoffs.contact, external: true },
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

export const footerLinks = [
  { label: 'Contact Us', href: sourceHandoffs.contact },
  { label: 'Terms & Conditions', href: sourceHandoffs.terms },
  { label: 'Privacy Policy', href: sourceHandoffs.privacy },
  { label: 'Cookie Policy', href: sourceHandoffs.cookies },
];

export const socialLinks = [
  { label: 'Instagram', href: sourceHandoffs.instagram },
  { label: 'Facebook', href: sourceHandoffs.facebook },
  { label: 'YouTube', href: sourceHandoffs.youtube },
  { label: 'TikTok', href: sourceHandoffs.tiktok },
  { label: 'Pinterest', href: sourceHandoffs.pinterest },
];
