import { categories } from './stories.mjs';
import { tools } from './pages';
export const navigation = [
  { title: 'RV Finder', href: tools.finder },
  { title: 'Stories', links: [
    { title: 'View All Stories', href: '/stories/' },
    ...categories.map(category => ({ title: category.title, href: `/stories/category/${category.slug}/` })),
  ] },
  { title: 'RV Basics', links: [
    { title: 'Find Your RV', href: tools.finder },
    { title: 'RV Types', href: '/rv-types/' },
    { title: 'Trip Calculator', href: tools.trip },
    { title: 'Financing Your RV', href: '/financing-your-rv/' },
    { title: 'Towing Guide', href: '/towing-guide/' },
    { title: 'FAQ', href: '/faq/' },
  ] },
  { title: 'About THOR', links: [
    { title: 'Innovation', href: '/innovation/' },
    { title: 'History', href: '/history/' },
    { title: 'Community', href: '/community/' },
    { title: 'News & Events', href: '/news-events/' },
    { title: 'Careers', href: '/careers/' },
  ] },
  { title: 'THOR Companies', href: '/thor-companies/' },
  { title: 'Sustainability', links: [
    { title: 'Overview', href: '/sustainability/' },
    { title: 'Report', href: '/sustainability-report/' },
    { title: 'Innovation', href: '/innovation/' },
    { title: 'Environmental', href: '/sustainability-environmental/' },
    { title: 'Social Responsibility', href: '/social-responsibility/' },
    { title: 'Governance', href: '/governance/' },
    { title: 'Supply Management', href: '/supply-management/' },
  ] },
  { title: 'Investors', href: tools.investors },
];
