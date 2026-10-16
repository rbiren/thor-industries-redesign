import type { Card, Page, Section } from './types.ts';
import {
  categories,
  homeBuyingSeason,
  homeFeaturedStories,
  homeNewsEvents,
  storiesHubCategories,
  storiesHubFeatured,
  storyCategoryPages,
} from './stories.mjs';
import { homeRvTypes, rvTypes } from './rv-types.mjs';
import { questions } from './faq.mjs';
import { SOURCE_ORIGIN, sourceHandoffs } from './routes.ts';
import { isBuiltRoute, routeHref } from '../lib/urls.ts';

const timeline: Array<[string, string]> = [
  ['1980', 'Thor Industries founded by Wade F. B. Thompson and Peter B. Orthwein with the acquisition of Airstream.'],
  ['1984', 'Thor goes public, then moves to the New York Stock Exchange in 1986 under ticker THO.'],
  ['1991', 'Acquired Dutchmen Manufacturing, expanding towable RV reach.'],
  ['2001', 'Acquired Keystone RV Company, one of North America’s leading towable manufacturers.'],
  ['2004', 'Acquired CrossRoads RV and Damon Motor Coach.'],
  ['2010', 'Acquired Heartland RV and Combined Damon and Four Winds into Thor Motor Coach.'],
  ['2016', 'Acquired Jayco, including Entegra Coach, Highland Ridge RV and Starcraft RV.'],
  ['2019', 'Completed acquisition of Erwin Hymer Group, establishing global RV leadership across North America and Europe.'],
  ['2020', 'Acquired Tiffin Motorhomes and launched the eMobility and innovation strategy.'],
  ['2021', 'Acquired Airxcel, strengthening RV component and aftermarket capabilities.'],
];

const source = (path = '') => `${SOURCE_ORIGIN}${path}`;
const tools = {
  finder: sourceHandoffs.rvFinder,
  calculator: sourceHandoffs.tripCalculator,
  finance: `${SOURCE_ORIGIN}/financing-your-rv`,
  investors: sourceHandoffs.investors,
};
const report2025 = 'https://thorindustries-prod.zaneray.com/cms/media/aSPx1XNYClf9ncae_THORIndustriesFY25SustainabilityReport_reduced.pdf';
const card = (
  title: string,
  text: string,
  href: string,
  image?: string,
  eyebrow?: string,
  action = 'Learn More',
  imageAlt?: string,
): Card => ({ title, text, href, image, imageAlt, eyebrow, action });
const section = (
  title: string,
  text: string[] = [],
  href?: string,
  action?: string,
  image?: string,
  cards?: Card[],
  subtitle?: string,
): Section => ({ title, subtitle, text, href, action, image, cards });

const newsCards: Card[] = homeNewsEvents;

const storyPages: Page[] = categories.map((category) => {
  const catData = storyCategoryPages[category.slug as keyof typeof storyCategoryPages];
  return {
    slug: `stories/category/${category.slug}` as Page['slug'],
    title: category.title,
    label: 'STORIES',
    description: category.intro,
    hero: category.hero,
    heroAlt: `THOR ${category.label} stories.`,
    kind: 'category',
    categoryKey: category.slug as Page['categoryKey'],
    sections: [
      {
        title: category.title,
        cards: catData.stories as Card[],
      },
    ],
  };
});

export const pages: Page[] = [
  {
    slug: '',
    title: 'FIND YOUR RV',
    label: 'Go Everywhere. Stay Anywhere.',
    description: 'Explore hundreds of RV models, narrow down your options, and find the perfect RV.',
    hero: 'hero',
    heroAlt: 'A family relaxes outside a THOR motorhome parked beside a mountain lake.',
    kind: 'home',
    sections: [
      section(
        'Who Is THOR?',
        [
          'In 1980, we embarked on a journey to connect people with nature, and families with each other. Today, we continue that journey by leading a global family of companies that make it easier and more enjoyable for families of all types to create lasting outdoor memories. Together we can Go Everywhere; Stay Anywhere.',
        ],
        routeHref('thor-companies'),
        'Explore Companies',
        'board-video-poster',
      ),
      section(
        'Meet the Family of Companies',
        [
          'Together, the THOR family of companies represents the world’s largest manufacturer of recreational vehicles. We offer a comprehensive range of RVs and travel tools to inspire and empower everyone to Go Everywhere. Stay Anywhere. We’ve chosen our family wisely so your choice is that much easier.',
        ],
        routeHref('thor-companies'),
        'View Family of Companies',
      ),
      section(
        'Explore RV Types',
        [
          'We’ll help you figure out what kind of RV is right for you.',
        ],
        routeHref('rv-types'),
        'View All',
        undefined,
        homeRvTypes,
      ),
      section(
        'Gear up for RV Buying Season',
        [],
        undefined,
        undefined,
        undefined,
        homeBuyingSeason,
      ),
      section(
        'Featured Stories',
        [],
        routeHref('stories'),
        'View All',
        undefined,
        homeFeaturedStories,
      ),
      section(
        'News and Events',
        [],
        routeHref('news-events'),
        'View All News and Events',
        undefined,
        homeNewsEvents,
        "What's New and Upcoming",
      ),
      section(
        'Find Your Perfect RV',
        [
          'There are so many different types of RVs, there’s definitely something for everyone. But don’t let having so many choices overwhelm you; we’re here to help you sort through it all and figure out what you need and want.',
        ],
        tools.finder,
        'Find Your RV',
        'finder-cta',
      ),
    ],
  },
  {
    slug: 'stories',
    title: 'STORIES',
    label: 'THOR Stories',
    description: 'Real travelers, practical RV guides, campfire recipes, road trips, and videos from across the THOR family.',
    hero: 'story-care',
    heroAlt: 'Finding Solace and Self-Care in Nature',
    kind: 'stories',
    sections: [
      {
        title: 'Featured Stories',
        cards: storiesHubFeatured as Card[],
      },
      ...storiesHubCategories.map((cat) => ({
        title: cat.title,
        href: `/${cat.slug}/`,
        action: cat.viewAllLabel,
        cards: cat.stories as Card[],
      })),
    ],
  },
  ...storyPages,
  {
    slug: 'rv-types',
    title: 'RV TYPES',
    label: 'RV Basics',
    description:
      'There are two main categories of RV: towables and motorhomes. Within those two categories are several different types of RVs. Get to know the different types of RVs to figure out which is best for you.',
    hero: 'rv-types',
    heroAlt: 'A family enjoying camp beside their RV.',
    kind: 'rv-types',
    lead: [
      'Towable RVs are hitched to a vehicle — like an SUV, pickup truck, or van — and towed. They don’t have an engine or require any maintenance on motorized parts, and they leave your tow vehicle free to drive around when you get to your destination.',
      'Motorized RVs have a drivetrain so you can drive them from destination to destination without needing a tow vehicle. Passengers can move about the cabin while you’re on the road, and setting up camp is fast when you arrive.',
    ],
    sections: rvTypes.map((item) => ({
      title: item.title,
      subtitle: item.eyebrow,
      text: [item.text],
      bullets: item.features,
      image: item.image,
      imageAlt: item.imageAlt,
      href: item.href,
      action: 'Learn More',
    })),
  },
  {
    slug: 'financing-your-rv',
    title: 'FINANCING YOUR RV',
    label: 'RV Basics',
    description: "It's More Affordable Than You Think",
    hero: 'finance',
    heroAlt: 'An Airstream travel trailer at a scenic campsite.',
    kind: 'financing',
    lead: [
      'With the number of people RVing on the rise, loans specific to RVs are more and more popular. But like a home, purchasing an RV is a big financial decision you shouldn’t take lightly. Take the time to get to know your budget and your options first.',
    ],
    sections: [
      section(
        'Trade-in Value',
        ['If you’re trading in an existing RV, you can use that value as part of your new/used RV purchase, thus making your loan amount smaller.'],
      ),
      section(
        'Collateral',
        ['Many RVers use their home or other substantial assets as collateral for their RV loan. How much collateral you’ll need depends on how much you need to borrow.'],
      ),
      section(
        'HOW MUCH DOES IT REALLY COST?',
        ['Use our calculator to figure how affordable owning an RV can be for you.'],
        tools.finance,
        'Open THOR’s Original Financing Calculator',
        'finance-calc-bg',
      ),
      section(
        'FIND YOUR RV',
        ['Explore our family of industry-leading companies and find your dream RV.'],
        tools.finder,
        'RV FINDER',
        'finance-finder',
      ),
    ],
  },
  {
    slug: 'towing-guide',
    title: 'GUIDE TO TOWING',
    label: 'RV Basics',
    description: 'Just like RV life is different from everyday life, towing an RV is different from your average road trip. Get familiar with how to hook up and safely hit the road.',
    hero: 'towing',
    heroAlt: 'A travel trailer and tow vehicle on the road.',
    kind: 'towing',
    lead: [
      'Just like RV life is different from everyday life, towing an RV is different from your average road trip. Get familiar with how to hook up and safely hit the road.',
    ],
    sections: [
      section(
        'MATCH YOUR TOW VEHICLE TO YOUR RV',
        [
          'It’s critical to take the time to properly match your tow vehicle to your towable RV to ensure you can safely tow in all conditions. Consult your tow vehicle owner’s manual or your dealer for information on the specific tow and weight ratings of your vehicle. And for more information watch this video from the RV Safety & Education Foundation.',
        ],
        'https://rvacademy.com/my-class/understanding-truck-towing-guides/understanding-truck-towing-guides?utm_source=thorindustries.com&utm_medium=referral',
        'Watch it Now',
        'towing-match-vehicle',
      ),
      section(
        'TRAILER LIFE TOWING GUIDE',
        [
          'Trailer Life Magazine is a top industry resource for all things RV, and their towing guides cover setup, towing capacity, ratings, and more – information that can be key in choosing the right vehicle and RV. You can find a comprehensive list of past Trailer Life Towing Guides here.',
        ],
        'https://webcontent.goodsam.com/trailerlife.com/digital_editions/TrailerLifeTowGuide2020.pdf',
        'Download Now',
        'towing-guide-book',
      ),
      section(
        'FIND YOUR PERFECT TOWABLE RV',
        [
          'There are so many different types of RVs, there’s definitely something for everyone. But don’t let having so many choices overwhelm you; we’re here to help you sort through it all and figure out what you need and want.',
        ],
        tools.finder,
        'EXPLORE THE RV FINDER',
        'finder-cta',
      ),
    ],
  },
  {
    slug: 'faq',
    title: 'FREQUENTLY ASKED QUESTIONS',
    label: 'RV Basics',
    description: 'Straight answers for first-time buyers, seasoned travelers, and everyone planning the next stretch of road.',
    hero: 'faq',
    heroAlt: 'Campers relaxing outside their RV in the evening.',
    kind: 'faq',
    sections: questions as Section[],
  },
  {
    slug: 'innovation',
    title: 'Leading Through Innovation',
    label: 'About THOR',
    description: 'Building the Future of RV Travel',
    hero: 'innovation',
    heroAlt: 'An electric RV concept parked in a modern natural setting.',
    lead: [
      'Every step of the way, THOR has led the RV industry through innovation. From category-defining products to advanced manufacturing and connected technologies, we invest in ideas that make RV travel easier, more sustainable, and more enjoyable.',
    ],
    sections: [
      section(
        'Building the Future of RV Travel',
        ['Explore recent innovation announcements, connected vehicle breakthroughs, and electrification milestones from across the THOR family.'],
        routeHref('news-events'),
        'Explore News & Events',
        undefined,
        newsCards,
      ),
    ],
  },
  {
    slug: 'history',
    title: 'Our History',
    label: 'About THOR',
    description: 'More than forty years of growth, acquisitions, and outdoor leadership.',
    hero: 'history',
    heroAlt: 'An Airstream trailer on the road through open country.',
    lead: [
      'THOR Industries began in 1980 when Wade F. B. Thompson and Peter B. Orthwein acquired Airstream, combining the first two letters of their last names to create THOR.',
    ],
    sections: timeline.map(([year, text]) => ({
      title: year,
      text: [text],
    })),
  },
  {
    slug: 'community',
    title: 'Building Our Community',
    label: 'About THOR',
    description: 'We are committed to supporting the communities where our employees and consumers live and play.',
    hero: 'community',
    heroAlt: 'An aerial view of a community connected to the outdoors.',
    lead: [
      'We have a role to play in supporting the communities that build and use THOR products. We’ve focused on three areas where we can have the greatest impact. For young people in our hometown, we’ve developed an innovative and hands-on education program to introduce them to career opportunities in their own backyard in the recreational vehicle industry. We have also taken a strategic approach to our philanthropic efforts and created new partnerships that will have lasting benefits for all who enjoy the outdoors.',
    ],
    sections: [
      section(
        'LEAP Program',
        [
          'The LEAP program supports local school districts in providing applied learning and real-world experience for their students. The three curriculum levels, fifth grade, eighth grade and high school, provide students with a differentiated educational experience to meet their varying needs.',
        ],
        source('/leap'),
        'Learn More',
        'leap',
      ),
      section(
        'Community Involvement',
        [
          'THOR Industries has long been a proud supporter of United Way and Habitat for Humanity. Both organizations offer many ways that we have positively impacted the communities where our employees and consumers live, work and play.',
        ],
        undefined,
        undefined,
        'habitat',
      ),
    ],
  },
  {
    slug: 'news-events',
    title: 'News and Events',
    label: 'About THOR',
    description: 'Get the latest on RV news, innovation and sustainability from the THOR Family of Companies.',
    hero: 'news',
    heroAlt: 'An RV parked beside Rimrock Lake, surrounded by evergreen trees.',
    sections: [
      {
        title: 'News and Events',
        cards: newsCards,
        href: source('/news-events'),
        action: 'Explore THOR’s Full News Archive',
      },
    ],
  },
  {
    slug: 'careers',
    title: 'Careers',
    label: 'About THOR',
    description: 'A strong company builds strong careers.',
    hero: 'careers',
    heroAlt: 'A team member assembling an RV inside a THOR family factory.',
    lead: [
      'Collectively, the THOR Industries family of companies comprises the largest manufacturers of recreational vehicles. Our family of operating companies produce exceptional RVs and RV components. We make it possible for our customers to live their dreams, and we take that responsibility seriously. We’re always looking for dedicated people who feel the same! Please explore our information and companies below to learn more about our culture and benefits.',
      'THOR Industries, Inc. recognizes the values and contribution of people with differences in experience, perspectives and capabilities. Diversity encompasses a variety of differences including, but not limited to: age, gender, experience, education, ethnicity, religious beliefs, cultural backgrounds, lifestyle, responsibilities, etc. At THOR we are committed to: Inspiring an inclusive culture which embraces individual differences:',
    ],
    sections: [
      {
        title: 'An Inclusive Culture',
        bullets: [
          'Treating team members fairly and with respect',
          'Establishing a workplace free from discrimination, harassment and bullying',
          'Training team members to be aware of their rights and responsibilities in regards to fair treatment',
          'Providing equal opportunities based on ability, performance and potential',
        ],
      },
      section(
        'THOR Industries Global Headquarters',
        [
          'Located in the heart of Elkhart County, we are advocates for family and the great outdoors. We are catalysts for people to connect with each other and we are champions for the exploration of the world around us.',
        ],
        source('/careers-global-headquarters'),
        'Explore Careers',
      ),
      {
        title: 'The THOR Family of Companies',
        text: [
          'Our companies make different products in different ways, but what they all have in common is a dedication to doing the right thing — by our customers and our team members — every single day. If you feel the same, we’d love to have you. Get a glimpse into the culture of our companies, and join the THOR team that’s right for you.',
        ],
        cards: [
          card('Airstream', 'Driven by innovation, rooted in humility, and obsessive about quality, the Airstream team is committed to making customers’ outdoor adventure dreams come true. And they’re building on a long legacy of success with every rivet.', 'https://www.airstream.com/company/careers/?utm_source=thorindustries.com&utm_medium=referral', 'logo-airstream', 'Now Hiring'),
          card('Jayco, Entegra Coach, Heartland RV, Open Range and DRV', 'Jayco started as a family business, and the feeling of family has only grown since then. Every single person is treated with respect and dignity at every turn, and it doesn’t count as a success unless everybody wins.', 'https://www.jaycofamily.com/careers/?utm_source=thorindustries.com&utm_medium=referral', 'logo-jayco', 'Now Hiring'),
          card('Keystone', 'The driving goal at Keystone is to make it easy for customers to find an RV that feels like it was made for them, and for team members to build that RV in the best possible way. The team works hard, works fast, shares ideas, and feels lucky to be doing it.', 'https://www.keystonerv.com/pickme', 'logo-keystone', 'Now Hiring'),
          card('KZ and Venture', 'KZ RV hangs their hat on quality at every step of the way. It’s a team who cares about what they do and who they do it for, a passion you can see everywhere—from the loyalty and career longevity to the can-do spirit and willingness to do anything it takes to get the job done right.', 'https://www.kz-rv.com/careers/?utm_source=thorindustries.com&utm_medium=referral', 'logo-kz', 'Now Hiring'),
          card('Postle Aluminum', 'As the backbone of the RV business, Postle supplies the aluminum that goes into THOR Industries RVs and so much more. From extrusion to fabrication to painting, there’s a trade for everyone and countless opportunities to join a hardworking team that will only keep growing.', 'https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=a4c08bd3-eedf-419a-9fb6-5d2ac8a3bafa&ccId=19000101_000001&lang=en_US/?utm_source=thorindustries.com&utm_medium=referral', undefined, 'Now Hiring'),
          card('Thor Motor Coach', 'What does it take to be the number one motorhome brand in North America? Four plants, six production lines, three campuses, and more than 1,000 hardworking employees who help Thor Motor Coach accomplish big goals every single day.', 'https://www.thormotorcoach.com/company/careers?utm_source=thorindustries.com&utm_medium=referral', 'logo-tmc', 'Now Hiring'),
          card('Tiffin Motorhomes', 'Every Tiffin employee plays an integral part in our mission to manufacture the finest motorhomes on the road today. By working at Tiffin, you can be a part of this mission and bring your perspective, experience, ideas, and dedication to helping us further that mission.', 'https://tiffin.applicantstack.com/x/openings', 'logo-tiffin', 'Now Hiring'),
        ],
      },
      section(
        'Transparency in Coverage',
        ['The Transparency in Coverage Rule for group health plans requires disclosure of cost-sharing information in a machine-readable format.'],
        'https://www.anthem.com/machine-readable-file/search',
        'View Disclosure',
      ),
    ],
  },
  {
    slug: 'thor-companies',
    title: 'Meet the Family of Companies',
    label: 'THOR Companies',
    description: 'North American RV brands, supply companies, European RV brands, and outdoor service partners across the THOR family.',
    hero: 'family',
    heroAlt: 'A couple sitting at the entry steps of an Airstream travel trailer.',
    kind: 'companies',
    lead: [
      'What started with the acquisition of Airstream in 1980 has grown into a global family of companies, trusted by hundreds of thousands of people across the globe to get them where they want to go safely and in style.',
    ],
    sections: [],
  },
  {
    slug: 'sustainability',
    title: 'Sustainability',
    label: 'Sustainability',
    description: 'Go Everywhere. Stay Anywhere.',
    hero: 'sustainability',
    heroAlt: 'A couple and their dog exploring a lakeshore.',
    sections: [
      section(
        'Sustainability Approach',
        [
          'We are committed to design and responsibly manufacture innovative products that allow our end consumers the freedom and flexibility to enjoy the outdoors and connect with nature in a sustainable manner, whenever and wherever they want. We are also committed to providing a safe and inclusive workplace for our team members and to support the communities in which our team members live and work.',
          'Our sustainability strategy reflects input from our stakeholders, results of our sustainability risk management process and our identified sustainability priorities. We continue to build and advance our sustainability strategy to identify opportunities for improvement across our company to meet the needs of our team members, partners, consumers and communities while actively addressing our impact on the environment. Our sustainability strategy aligns with our business strategy and focuses on three elements: environmental concerns, social responsibility and governance.',
        ],
      ),
      section(
        'Environmental',
        [
          'Minimizing our impact on the planet and contributing to a more sustainable future is a key focus area in our overall sustainability strategy. In an effort to take action to combat climate change and its impacts, our environmental strategy focuses on reducing GHG emissions, reducing waste to landfill and using water in a more conservative manner.',
          'As the global leader in RV manufacturing, we are invested in leading the industry in the fight against environmental threats to the outdoor and RV lifestyles. In support of these efforts, we became a signatory to Business Ambition for 1.5° C, and we committed to our goal of net-neutral carbon GHG emissions in or before 2050, with an interim target of a 50% reduction in Scope 1 and Scope 2 emissions in or before 2030.',
        ],
        routeHref('sustainability-environmental'),
        'Learn More',
        'environmental',
      ),
      section(
        'Social Responsibility',
        [
          'People are at the center of our sustainability efforts. Social issues, ranging from the health and safety of our team members to inclusive and equitable career development to the empowerment of all women and girls, are the foundation of our social strategy. In addition, our focus on community engagement is a priority, and key social areas are an important part of our corporate initiatives.',
          'We prioritize the well-being, health and safety of our team members and focus on issues around diversity, equity and inclusion while implementing an ethical and connected company culture. We engage with our communities through partnerships and direct giving to support the health and well-being, education and gender equality within our communities, and we continually explore ways to give back to these communities.',
        ],
        routeHref('social-responsibility'),
        'Learn More',
        'social',
      ),
      section(
        'Governance',
        [
          'Our governance strategy focuses on transparency in reporting and alignment with evolving sustainability requirements.',
          'Our executive officers and Board of Directors view oversight and effective management of sustainability-related risks and opportunities as essential to our ability to execute our strategy and achieve long-term sustainable growth.',
        ],
        routeHref('governance'),
        'Learn More',
        'governance',
      ),
      section(
        'Supply Management',
        [
          'THOR Industries, Inc. is committed to conducting our business in accordance with the highest ethical standards. We strive to act with integrity and fairness in both employment and business relationships. We expect our employees to act ethically and in compliance with all applicable laws at all times, and we expect the same from those with whom we do business, including business partners, agencies and suppliers.',
        ],
        routeHref('supply-management'),
        'Learn More',
        'supply',
      ),
      section(
        'Sustainability Committee',
        [
          'The Sustainability Committee supports on-going commitment to environmental, health, and safety, corporate social responsibility, corporate governance, sustainability, and other public policy initiatives.',
        ],
        'https://thorindustries-prod.zaneray.com/cms/media%2F24ddea17-6803-4f14-95f8-e630652797e6_sustainability+committee++-final+draft+10-10-19.pdf',
        'Download the Charter (PDF)',
      ),
      section('FY2025 Sustainability Report', [], routeHref('sustainability-report'), 'Explore the Report', 'report'),
    ],
  },
  {
    slug: 'sustainability-report',
    title: 'FY2025 Sustainability Report',
    label: 'Sustainability',
    description: 'Explore all THOR Sustainability Reports',
    hero: 'report',
    heroAlt: 'Outdoor recreation and RV travel from THOR’s sustainability report.',
    sections: [
      section('FY2025 Sustainability Report', [], report2025, 'Download the Report (PDF)'),
      {
        title: 'Explore all THOR Sustainability Reports',
        cards: [
          card('2024 Sustainability Report', '', 'https://thorindustries-prod.zaneray.com/cms/media/Zx_vEa8jQArTz6il_THORIndustriesFY24SustainabilityReport.pdf', undefined, 'Download PDF'),
          card('2023 Sustainability Report', '', 'https://thorindustries-prod.zaneray.com/cms/media/46776dde-ad96-4b3e-ab44-5eb8e6c67233_THOR_Sustainability_2023_Final.pdf', undefined, 'Download PDF'),
          card('2022 Sustainability Report', '', 'https://thorindustries-prod.zaneray.com/cms/media/94b6406f-cbf1-4a53-8872-e5b87c834fb8_THOR_Sustainability_2022_Final.pdf', undefined, 'Download PDF'),
        ],
      },
    ],
  },
  {
    slug: 'sustainability-environmental',
    title: 'Environmental',
    label: 'Sustainability',
    description: 'Preserving the health of our planet is fundamental to the THOR Industries lifestyle.',
    hero: 'environmental',
    heroAlt: 'A rocky Pacific Northwest shoreline with evergreen trees and islands.',
    lead: [
      'Preserving the health of our planet is fundamental to the THOR Industries lifestyle. We have a responsibility to protect our environment, and we strive to conserve resources throughout our operations and through the development of programs like Pick Up America that help preserve our planet for the next generation of campers and with partnerships like the one we have with the National Forest Foundation that is dedicated to preserving national forests and grasslands. Today, our manufacturing processes are more energy- and resource-efficient than ever before, with an emphasis on recycling and reducing the amount of waste that goes to landfills.',
    ],
    sections: [
      section(
        'Environmental Policy',
        [
          'This policy states our commitment to reducing waste, minimizing environmental impact, and promoting conservation. The goal is to boost sustainability and environmental awareness at all levels of our business, as well as among our suppliers, customers, and other stakeholders.',
        ],
        source('/sustainability-environmental-policy'),
      ),
      section(
        'Business Ambition for 1.5°C Commitment',
        [
          'We believe reducing waste and emissions, minimizing environmental impact and promoting conservation at all of our locations promotes the long-term health of the company while making the world a better place for all. That is why we are paving the way to a net-zero future and became a signatory of the UN Global Compact Business Ambition for 1.5°C Commitment. As part of our focus on sustainable practices, we have pledged net-zero greenhouse gas (GHG) emissions targets by 2050 to help meet a 1.5°C future, with an interim target of 50% reduction in GHG emissions in or before 2030',
        ],
        'https://ir.thorindustries.com/investor-resources/press-releases/press-release-details/2020/THOR-Industries-Commits-To-Combat-Climate-Change/default.aspx',
        'Read Press Release',
      ),
      section(
        'Environmental Management System (EMS)',
        [
          'THOR’s Environmental Management System (EMS) is a set of processes and practices that enable the THOR family of companies to reduce their environmental impacts and increase operating efficiencies. This proactive approach can help reduce the risk on non-compliance and improve the health and safety for our team members and communities in which we operate. THOR’s EMS also supports non-regulated goals, such as reduced energy intensity and greenhouse gas (GHG) emissions, and promotes stronger operational coordination and team member stewardship.',
        ],
        'https://thorindustries-prod.zaneray.com/cms/media/adQDI5GXnQHGZSuH_THORIndustriesEMS3_1_26.pdf',
        'Download EMS Manual (PDF)',
      ),
      section(
        'Solid Waste & Recycling',
        [
          'The THOR family of companies has a proud history of leadership in reducing solid waste landfill disposal and increasing recycling. We are pleased to announce our goal of 50% reduction of solid waste landfill disposal in or before 2030.',
          'Achieving this goal requires close collaboration with our value stream partners, particularly suppliers, to design out non-recyclable materials, reduce the quantity of packaging materials used and increase the frequency of returnable packaging. We continue to aggressively research opportunities to increase waste recycling as technology improves in this area.',
        ],
      ),
      section(
        'National Forest Foundation',
        [
          'America’s National Forest and Grasslands cover over 8% of the surface area of the United States and are home to virtually every form of outdoor recreation. In 2019, we established a multi-year partnership with the National Forest Foundation (NFF). The National Forest Foundation works on behalf of the American public to inspire personal and meaningful connections to our National Forests, leading forest conservation efforts and responsible recreation. Through our gifts, NFF will help to ensure these American treasures are available to our communities for generations to come.',
        ],
        'https://www.nationalforests.org/',
        'Visit Website',
        'forest',
      ),
      section(
        'Pick Up America',
        [
          'This national partnership encourages people to keep our outdoor spaces clean by pledging to remove trash from public lands. Over 259 tons of trash have been pledged to be removed from public lands since the program launched in 2019. By leaving the trails, forests, waterways, and recreation areas cleaner than we found them, we help ensure others experience the outdoors for generations to come.',
        ],
        'https://pickupamerica.com/',
        'Join Us, Make Your Pledge!',
      ),
    ],
  },
  {
    slug: 'social-responsibility',
    title: 'Social Responsibility',
    label: 'Sustainability',
    description: 'Taking care of our team members by supporting them in their personal and professional goals is a priority at THOR.',
    hero: 'social',
    heroAlt: 'The Thomas family enjoying a road trip.',
    lead: [
      'Taking care of our team members by supporting them in their personal and professional goals is a priority at THOR. We do this by engaging and connecting with our team members to help in their development. We continue to implement resources to cultivate and empower our people around the globe. THOR is proud of the work we do in our communities, as they are a valuable resource to our success. We continue to develop our culture and organization every day.',
    ],
    sections: [
      section(
        'Diversity and Inclusion Commitment',
        [
          'THOR Industries, Inc. recognizes the values and contributions of people with differences in experience, perspectives and capabilities. Diversity encompasses a variety of differences including, but not limited to: age, gender, experience, education, ethnicity, religious beliefs, cultural backgrounds, lifestyle and responsibilities.',
        ],
        source('/diversityandinclusion'),
      ),
      section(
        'Human Rights and Equal Employment',
        [
          'THOR Industries takes its responsibility to protect and respect human rights seriously, and we operate our business in accordance with internationally recognized human rights. More specifically, we’re dedicated to creating a workplace that respects and values people with diverse backgrounds, which enables all of our team members to do their best work.',
        ],
        source('/sustainability-human-rights'),
      ),
      section(
        'Occupational Health and Safety',
        [
          'Our employees are absolutely critical to THOR Industries’ success. We acknowledge and support every employee’s right to a safe workplace. We are committed to complying with applicable legal standards, to providing a healthy and safe work environment and working to continually improve our health and safety practices.',
        ],
        source('/sustainability-employee-safety'),
        'Learn More',
        'careers',
      ),
      section(
        'Education and Community Engagement',
        [
          "We have a role to play in supporting the communities that build and use THOR Industries products. We've focused on three areas where we can have the greatest impact.",
        ],
        source('/sustainability-education-community-engagement'),
        'Learn More',
        'community',
      ),
    ],
  },
  {
    slug: 'governance',
    title: 'Governance',
    label: 'Sustainability',
    description: 'Our commitment to high standards of corporate conduct and compliance.',
    hero: 'governance',
    heroAlt: 'An RV on a forest road.',
    lead: [
      'THOR Industries is governed by our executive officers and Board of Directors. Our President and Chief Executive Officer is a board member, while we operate with an independent Chairman of the Board.',
    ],
    sections: [
      {
        title: 'Standing Committees',
        bullets: [
          'Audit Committee: Ensures the integrity of our financial statements and compliance with legal and regulatory requirements. Manages our internal and external auditors.',
          'Compensation Committee: Has overall responsibility for evaluating and approving the structure of our executing plans, policies and programs.',
          'Executive Committee: Exercises all of the powers and authority of the Board of Directors in the management of the business and affairs of the company when the full board is not in session.',
          'Environmental, Social, Governance and Nomination Committee: Provides direction and oversight over THOR’s sustainability efforts and oversees the composition of the Board of Directors by regularly reviewing membership and nominating prospective members.',
        ],
      },
      section(
        'Corporate Governance',
        [
          'Our corporate governance guidelines assist our directors in fully understanding and effectively implementing their duties, while assuring the company’s ongoing commitment to high standards of corporate conduct and compliance.',
          'We use an enterprise risk management process that actively engages the Board and executives of THOR and its companies in assessing the risks and opportunities facing our company, including, but not limited to, key risks related to innovation, cybersecurity and climate-related issues. The Board receives a full assessment annually and is updated on the most critical risks on an ongoing basis. A list of our risk factors can be found in our annual report.',
        ],
      ),
      section(
        'Stakeholder Engagement',
        [
          'An integral part of our approach to sustainability includes the engagement of our stakeholders, on a formal and informal basis, to better understand their concerns and needs related to sustainability and to identify potentially significant sustainability-related risks and opportunities.',
          'We seek opportunities to engage with our employees, suppliers, dealers, consumers, local community members and other stakeholders to better identify and manage potential risks and to identify opportunities to provide support and leadership for our communities. We have also taken opportunities to interact with our supply base to foster engagement.',
          'Focus areas identified through stakeholder engagement are evaluated for their level of impact across our value chain and are prioritized accordingly. We believe our focus on the most significant sustainability factors better enables us to assess and mitigate risk and seize opportunities, resulting in an overall positive impact on our customers, partners, team members and communities.',
        ],
      ),
      section(
        'Sustainability Charter',
        [
          'The Sustainability Committee supports on-going commitment to environmental, health, and safety, corporate social responsibility, corporate governance, sustainability and other public policy initiatives.',
        ],
        source('/sustainability-sustainability-committee-of-thor-industries-inc.'),
        'Download the Charter',
      ),
      section(
        'Ethics and Compliance',
        [
          'THOR Industries demands a high standard of business ethics in all areas of operation. We commit to our team members to provide a safe, supportive and respectful workplace. Our team members are provided with the tools and training to help them make ethical business decisions. We believe that our team members make better decisions in a shorter amount of time when business ethics is used as a guiding principle.',
        ],
        source('/sustainability-ethics-and-compliance'),
      ),
    ],
  },
  {
    slug: 'supply-management',
    title: 'Supply Management',
    label: 'Sustainability',
    description: 'Integrity and fairness in our employment and business relationships.',
    hero: 'supply',
    heroAlt: 'THOR family RV manufacturing and supply operations.',
    lead: [
      'Along with our subsidiaries and affiliates, THOR Industries is committed to conducting business according to the highest ethical standards. This includes acting with integrity and fairness in both our employment and business relationships. We also expect our employees to act ethically, and in compliance with all applicable laws, at all times.',
      'We expect the same standard of ethics from those with whom we do business, including business partners, agencies and suppliers. Most importantly, we expect all of our suppliers to comply with the principles set forth in our Conflict Minerals Policy and our Supplier Code of Conduct.',
    ],
    sections: [
      section(
        'Supplier Requirements',
        [
          'Suppliers are required to comply with THOR Purchasing Terms & Conditions, Supplier Code of Conduct, and THOR Information Protection & Intellectual Property Terms (if Relevant). THOR Purchasing Terms & Conditions provide the terms and conditions for all THOR purchases. The Code of Conduct sets forth our expectation that all of our business partners, agencies and suppliers will act ethically, observe the principles set forth the Supplier Code of Conduct, and comply with all applicable laws. THOR Information Protection & Intellectual Property Terms apply to all suppliers that have access to THOR confidential or IP in order to provide material or services.',
        ],
        source('/supplier-requirements'),
      ),
      section(
        'Conflict Minerals Policy',
        [
          'This policy declares the commitment of THOR to complying with the requirements of the Conflict Mineral provision of the Dodd-Frank Act, and our expectation that our suppliers do the same. We are dedicated to engaging in a socially and environmentally responsible manner, which complies with the law and supports our customers’ businesses. We support the Dodd-Frank Act concerning Conflict Minerals sourcing.',
        ],
        source('/sustainability-conflict-minerals-policy'),
      ),
      section(
        'Disclosure Pursuant to the California Transparency in Supply Chains Act of 2010',
        [
          'This disclosure confirms the commitment of THOR to legal compliance, ethical conduct, and fair employment practices wherever we conduct business in the U.S. This includes the prohibition of child or forced labor. This disclosure further identifies what steps we do not currently undertake with respect to our suppliers. We maintain the highest level of integrity in all aspects of our activities.',
        ],
        source('/sustainability-disclosure-pursuant-to-the-california-transparency'),
      ),
      section(
        'Web Hosting Standard Operating Procedure',
        [
          'Various legislative mandates require that THOR ensure adequate security for Personal Data. This document is intended to describe THOR’s Standard Operating Procedure for ensuring adequate security of THOR-Personal Data, hosted by 3rd Party Providers.',
        ],
        source('/web-hosting-sop'),
      ),
      section(
        'Custom-Code Standard Operating Procedure',
        [
          'The intent of this Standard Operating Procedure (SOP) is to communicate our minimum standards to suppliers, to ensure that suppliers deliver secure code. Suppliers will use industry-standard testing mechanisms and provide THOR with the results.',
        ],
        source('/custom-code-sop'),
      ),
      section(
        'Supplier Sustainability Self-Assessment',
        [
          'Embracing sustainability offers a method for companies to integrate environmental, social, governance and supply chain initiatives into operations and company strategy. Understanding the status, risks and opportunities posed by sustainability are critical to the long-term viability of the value-streams for which we all depend. THOR’s Supplier Self-Assessment Questionnaire is designed to be a first check of supplier activities on these topics, and a tool to enable meaningful discussions moving forward.',
        ],
        'https://thorindustries-prod.zaneray.com/cms/media/7d6de808-92aa-41b3-9139-302aa2d0416e_6.+2022_THOR+Industries+Inc.+Supplier+Sustainability+Questionnaire.pdf',
        'Download Questionnaire (PDF)',
      ),
    ],
  },
];

export const builtPages: Page[] = pages.filter((page) => isBuiltRoute(page.slug));
