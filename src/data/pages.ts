import type { Card, Page, Section } from './types';
import { rvTypes } from './rv-types.mjs';
import { questions } from './faq.mjs';
import { categories, storyById } from './stories.mjs';

export const origin = 'https://www.thorindustries.com';
export const tools = {
  finder: `${origin}/find-my-rv`,
  trip: `${origin}/trip-calculator`,
  finance: `${origin}/financing-your-rv`,
  investors: 'https://ir.thorindustries.com/ir-home/default.aspx',
};
const source = (path: string) => origin + path;
const card = (title: string, text: string, href: string, image?: string, action = 'Learn More'): Card => ({ title, text, href, image, action });
const section = (title: string, text: string[], href?: string, action = 'Learn More', image?: string): Section => ({ title, text, href, action, image });
const storyCards = (ids: string[]): Card[] => ids.map(id => storyById[id] as Card);
const report2025 = 'https://thorindustries-prod.zaneray.com/cms/media/aXo7kgIvOtkhCCvG_THOR_Sustainability_2025_Final_REV_iPDF.1.27.2025.pdf';
const familyCopy = 'Together, the THOR Industries family of companies represents the world’s largest manufacturer of recreational vehicles. We’ve chosen our family wisely, so your choice is that much easier.';
export const finderCopy = 'There are so many different types of RVs, there’s definitely something for everyone. But don’t let having so many choices overwhelm you; we’re here to help you sort through it all and figure out what you need and want.';

export const newsCards: Card[] = [
  { title: "THOR Industries Introduces World's First Range Extended Electric Class A Motorhome", text: "Debut of Entegra Coach Embark highlights THOR's leadership in innovation and commitment to electrifying the future of RVs", image: 'embark', eyebrow: 'September 22, 2025', href: 'https://ir.thorindustries.com/investor-resources/press-releases/press-release-details/2025/THOR-Industries-Introduces-Worlds-First-Range-Extended-Electric-Class-A-Motorhome/default.aspx', action: 'Read More' },
  { title: 'THOR & Harbinger Win 2025 Fast Company Award for Hybrid RV', text: "THOR Industries and Harbinger Earn Fast Company 2025 World Changing Ideas Award for World's First Hybrid Class A Motorhome", image: 'hybrid', eyebrow: 'July 16, 2025', href: source('/news-events/thor-industries-harbinger-world-changing-ideas-award'), action: 'Read More' },
  { title: 'Where the Magic Happens', text: 'THOR’s Electrification Lab is Ushering in a New Era of RV Adventure', image: 'lab', eyebrow: 'February 27, 2025', href: source('/news-events/where-the-magic-happens'), action: 'Read More' },
  { title: 'THOR’s Global Connected Vehicle Platform Expands to North America', text: 'The Platform Uses Technology and Partnership to Enhance the RVing Experience.', image: 'airstream', eyebrow: 'February 14, 2025', href: source('/news-events/blog-global-connected-vehicle-platform'), action: 'Read More' },
  card('Next Level EV Charging', 'THOR unveils an Innovative EV charging station concept designed to better serve electric RVs and EV tow vehicles', source('/news-events/blog-ev-charging'), undefined, 'Read More'),
  card('Airstream’s Smart Control App Comes to Apple’s CarPlay®', 'THOR and Airstream innovators collaborate to bring Airstream’s connected vehicle platform into the CarPlay ecosystem.', source('/news-events/blog-airstream-carplay'), undefined, 'Read More'),
  card('Blog: Lessons from the Tunnel', 'The Global Innovation Team recently took a deep dive into the aerodynamics of selected THOR travel trailers', source('/news-events/blog-lessons-from-the-tunnel'), undefined, 'Read More'),
  card('Blog: Electrifying the Road to Adventure', 'THOR is Making the Case for eRV-compatible EV Chargers in Rural Areas', source('/news-events/blog-electrifying-the-road-to-adventure'), undefined, 'Read More'),
];

const history: [string, string, string][] = [
  ['1980', 'Founding', 'THOR Industries Inc. was founded on August 29, 1980 when Wade F.B. Thompson and Peter B. Orthwein acquired Airstream, the most recognized name in the industry. Despite its venerable image, Airstream had not fared well during the economic downturn of the late 1970s. By focusing on improving quality while reducing costs, Airstream returned to profitability in its very first year under the new THOR management.'],
  ['1982', 'General Coach', 'THOR was strong enough to purchase the Canadian company General Coach, a manufacturer of travel trailers and fifth wheels.'],
  ['1984', 'Publicly traded company', 'THOR became a public company listed on the over-the-counter market. In 1986, THOR was listed on the New York Stock Exchange. That same year, Forbes Magazine ranked THOR sixth out of the "200 best small companies in America."'],
  ['1988', 'Small and mid-size bus industry', 'THOR entered the small and mid-size bus industry with the acquisition of ElDorado Bus. In 1991, National Coach was purchased and the two companies operated under the ElDorado National trademark, with plants in California and Kansas.'],
  ['1991', 'Dutchmen Manufacturing', 'THOR acquired Dutchmen Manufacturing, now one of the leading brands of travel trailers and fifth wheels.'],
  ['1992', 'Four Winds International', 'Four Winds International, a manufacturer of Class A and Class C motorhomes, was acquired in 1992.'],
  ['1995', 'Komfort Corporation', 'Komfort Corporation, a builder of travel trailers and fifth wheels, became part of the growing THOR family in 1995.'],
  ['1996', 'Thor California', 'Thor California was a start-up in 1996, which became one of the most successful RV start-ups.'],
  ['1998', 'Champion Bus', 'THOR solidified its leadership in the bus industry with the acquisition of Champion Bus.'],
  ['2001', 'Keystone RV', 'When THOR acquired Keystone RV in 2001, the company achieved an unprecedented dominance within the RV industry.'],
  ['2003', 'Damon and Breckenridge', 'THOR acquired Damon, a manufacturer of Class A motorhomes, raising its profile in the growing motorized RV market. In that same year, THOR acquired Breckenridge, builder of park trailers.'],
  ['2004', 'Crossroads RV', 'With the addition of Crossroads RV in 2004, THOR solidified its industry leading position in towable RVs.'],
  ['2005', 'Goshen Coach', 'THOR acquired Goshen Coach to round out its holdings in the small and mid-size bus industry.'],
  ['2010', 'Heartland RV Company', "In September 2010, THOR made its largest acquisition to date when it purchased Heartland RV Company, further cementing its companies’ combined position as the world's largest producer of towable RVs."],
  ['2010', 'SJC Industries, Inc.', 'In March 2010, THOR acquired SJC Industries, Inc., the second largest ambulance manufacturer in the United States.'],
  ['2012', 'Krystal Infinity and Federal Coach', 'THOR made two strategic acquisitions in the luxury bus market when it acquired Krystal Infinity, LLC in September, and the bus operation assets of Federal Coach in December. Both purchases have enabled THOR to expand its bus business into the luxury coach market.'],
  ['2013', 'Bison Coach', 'THOR acquired the net assets of specialty trailer manufacturer Bison Coach through a wholly owned subsidiary. Founded in 1984, Milford, Indiana-based Bison is known for its rugged, high-quality and affordable specialty trailers. In 2003, Bison began adding living quarter conversions to their production process resulting in the development of a complete line of equine trailers with living quarters.'],
  ['2013', 'Exiting the bus business', "THOR exited the bus industry when it sold its bus business to Allied Specialty Vehicles. THOR's bus business included Champion Bus, Inc.; General Coach America, Inc.; Goshen Coach, Inc.; ElDorado National (California), Inc.; and ElDorado National (Kansas), Inc.; which combined represent one of the largest producers of transit and shuttle buses in North America with bus segment sales of approximately $450 million for the fiscal year ended July 31, 2013."],
  ['2013', "Livin’ Lite", "THOR acquired the assets of innovative RV maker Livin' Lite through a wholly owned subsidiary. Livin' Lite is known for its advanced lightweight aluminum construction applied to a variety of smaller RVs, including travel trailers, toy haulers, camping trailers and truck campers."],
  ['2013', 'Wakarusa RV production campus', "THOR's subsidiary, Thor Wakarusa, LLC, purchased the RV production campus in Wakarusa, Indiana that was formerly operated by Navistar International Corporation. The facilities are comprised of nearly one million square feet of total production space located on more than 150 acres. In addition to the production space, the complex includes more than 35 paint booths designed specifically for painting RVs. The campus was purchased to support the ongoing growth of THOR's businesses."],
  ['2014', 'KZ, Inc.', 'THOR acquired KZ, Inc. a leading manufacturer and marketer of towable recreational vehicles that offers unmatched quality and value to consumers in North America. KZ markets a comprehensive product line, which includes travel trailers, fifth wheels and toy haulers.'],
  ['2015', 'Cruiser RV and DRV Luxury Suites', 'In January 2015, THOR announced that its Heartland subsidiary acquired towable RV maker Cruiser RV (CRV) and luxury fifth wheel maker DRV Luxury Suites, both based in Howe, Indiana.'],
  ['2015', 'Postle Aluminum Co.', 'THOR acquired Elkhart, Indiana-based Postle Aluminum Co. Founded in 1974, Postle produces extruded aluminum and specialized components for the RV industry and other industries, with a commitment to each customer in providing the highest-quality products and exceptional service.'],
  ['2016', 'Jayco, Inc.', "In June 2016, THOR acquired Jayco, Inc., a family of companies which included strong subsidiaries Jayco, Starcraft RV, Highland Ridge RV, and Entegra Coach- manufacturing brands like Jay Flight, one of North America's top-selling travel trailers since 2004. Jayco is based in Northern Indiana, with additional facilities in Idaho."],
  ['2019', 'Erwin Hymer Group', "In February 2019, THOR completed the acquisition of Erwin Hymer Group (EHG), one of Europe's largest makers of recreational vehicles (RVs). The combination of THOR and EHG created the world's largest RV manufacturer, with leading positions in both North American and Europe."],
  ['2020', 'Tiffin Group', "In December 2020, THOR acquired the Tiffin Group, a premium manufacturer of luxury recreational vehicles known for excellent product quality, outstanding customer service and brand loyalty. A family-owned business since 1972, Tiffin set the standard for the luxury Class A segment and complements THOR's North American portfolio. The Tiffin Group operates in Alabama and Mississippi and includes Tiffin Motorhomes, as well as associated operating entities which primarily supply Tiffin Motorhomes."],
  ['2021', 'Airxcel', 'In September 2021, THOR acquired Wichita, Kansas-based Airxcel, a leading supplier of OEM and aftermarket RV parts and accessories. Airxcel began in 1991 as a divesture of the Coleman RV Air Conditioner division and has continued to grow through innovative product development, market expansion, and strategic acquisitions. Airxcel manufactures and sells a comprehensive line of functionally critical, branded products in recreational vehicle heating, cooling, ventilation, cooking, window covering, side wall, and roofing materials.'],
];

export const pages: Page[] = [
  {
    slug: '', title: 'Find Your RV', description: 'Explore hundreds of RV models, narrow down your options, and find the perfect RV.',
    hero: 'hero', heroAlt: 'A family beside their Four Winds motorhome in a forest campground by a creek.', label: 'Go Everywhere. Stay Anywhere.', kind: 'home',
    sections: [
      section('Who Is THOR?', ['In 1980, we embarked on a journey to connect people with nature, and families with each other. Today, we continue that journey by leading a global family of companies that make it easier and more enjoyable for families of all types to create lasting outdoor memories. Together we can Go Everywhere; Stay Anywhere.'], '/thor-companies/', 'Explore Companies', 'family'),
      { title: 'Meet the Family of Companies', text: ['Together, the THOR family of companies represents the world’s largest manufacturer of recreational vehicles. We offer a comprehensive range of RVs and travel tools to inspire and empower everyone to Go Everywhere. Stay Anywhere. We’ve chosen our family wisely so your choice is that much easier.'], href: '/thor-companies/', action: 'View Family of Companies' },
      { title: 'Explore RV Types', text: ['We’ll help you figure out what kind of RV is right for you.'], cards: rvTypes, href: '/rv-types/', action: 'View All RV Types' },
      { title: 'Featured Stories', cards: storyCards(['checklists-find-rv', 'national-forest-hidden-gems', 'self-care-in-nature']), href: '/stories/', action: 'View All Stories' },
      { title: 'News and Events', text: ["What’s New and Upcoming"], cards: newsCards.slice(0, 3), href: '/news-events/', action: 'View All News and Events' },
    ],
  },
  {
    slug: 'stories', title: 'Stories', description: "Whether you're new to the world of RVing or you're ready to narrow your search, we're here to help you sort through it all and find the RV that's right for you.",
    hero: 'story-care', heroAlt: 'Dani Reyes-Acosta outdoors in nature.', label: 'Stories', kind: 'stories',
    sections: [
      { title: 'Featured Stories', cards: storyCards(['self-care-in-nature', 'rv-camping-guide', 'camping-way-of-life', 'how-to-public-land-camp']) },
      ...categories.map(category => ({ title: category.title, cards: storyCards(category.ids.slice(0, 3)), href: `/stories/category/${category.slug}/`, action: 'View All' })),
    ],
  },
  ...categories.map(category => ({
    slug: `stories/category/${category.slug}`, title: category.title,
    description: category.slug === 'travel' ? 'Select a region to discover curated trip guides and start planning your next RV adventure.' : 'Stories from the THOR family of RVers.',
    hero: category.hero, heroAlt: category.slug === 'recipes' ? 'Swiss chard and pesto shakshuka prepared for an outdoor meal.' : 'RV travel and outdoor experiences from the THOR community.',
    label: 'Stories', kind: 'category' as const,
    sections: [
      ...(category.slug === 'travel' ? [{
        title: 'Which region would you like to visit?',
        text: ['Select a region to discover curated trip guides and start planning your next RV adventure.'],
        bullets: [
          'Northwest — A dream destination for those seeking lush greenery and epic mountain ranges.',
          'West — Discover cliff-lined beaches, plunging canyons and dazzling deserts.',
          'Mid-West — Adventure abounds in vast plains and expansive lakes.',
          'Southwest — One of the most geographically diverse regions in the country.',
          'Northeast — Rich history, vibrant cities and abundant forests fill the Northeast.',
          'Mid-Atlantic — Rolling countrysides and pristine wilderness make for a picture-perfect adventure.',
          'Southeast — Experience Southern charm from its beachy shores to its mountain peaks.',
          'Canada — Dive into Canada’s wild and extravagant landscape that is as beautiful as it is diverse.',
        ],
        href: source('/stories/category/travel'), action: 'Explore Regions on THOR',
      }] : []),
      { title: category.slug === 'travel' ? 'Featured Guides' : category.title, cards: storyCards(category.ids), href: source(`/stories/category/${category.slug}`), action: `More ${category.title} on THOR` },
    ],
  })),
  {
    slug: 'rv-types', title: 'RV Types', label: 'RV Basics',
    description: 'With so many RV types available, there is definitely something for everyone.',
    hero: 'rv-types', heroAlt: 'A child holding a s’more beside a Jayco travel trailer.',
    lead: ['With so many RV types available, there is definitely something for everyone. But don’t let the choices overwhelm you. We’re here to help you sort through them all, figure out your needs and wants, and find the RV of your dreams.'],
    sections: rvTypes.map(type => ({ title: type.title, image: type.image, text: [type.text], bullets: type.features, href: type.href })),
  },
  {
    slug: 'financing-your-rv', title: 'Financing Your RV', label: 'RV Basics', description: 'It’s More Affordable Than You Think',
    hero: 'finance', heroAlt: 'An Airstream travel trailer at a scenic campsite.',
    lead: ['With the number of people RVing on the rise, loans specific to RVs are more and more popular. But like a home, purchasing an RV is a big financial decision you shouldn’t take lightly. Take the time to get to know your budget and your options first.'],
    sections: [
      section('Trade-in Value', ['If you’re trading in an existing RV, you can use that value as part of your new/used RV purchase, thus making your loan amount smaller.']),
      section('Collateral', ['Many RVers use their home or other substantial assets as collateral for their RV loan. How much collateral you’ll need depends on how much you need to borrow.']),
      section('How Much Does it really Cost?', ['Use our calculator to figure how affordable owning an RV can be for you.'], tools.finance, 'Open THOR’s Finance Calculator'),
    ],
  },
  {
    slug: 'towing-guide', title: 'Guide to Towing', label: 'RV Basics', description: 'Get familiar with how to hook up and safely hit the road.',
    hero: 'towing', heroAlt: 'A travel trailer and tow vehicle on the road.',
    lead: ['Just like RV life is different from everyday life, towing an RV is different from your average road trip. Get familiar with how to hook up and safely hit the road.'],
    sections: [
      section('Match Your Tow Vehicle to Your RV', ['It’s critical to take the time to properly match your tow vehicle to your towable RV to ensure you can safely tow in all conditions. Consult your tow vehicle owner’s manual or your dealer for information on the specific tow and weight ratings of your vehicle. And for more information watch this video from the RV Safety & Education Foundation.'], 'https://rvacademy.com/my-class/understanding-truck-towing-guides/understanding-truck-towing-guides?utm_source=thorindustries.com&utm_medium=referral', 'Watch it Now'),
      section('Trailer Life Towing Guide', ['Trailer Life Magazine is a top industry resource for all things RV, and their towing guides cover setup, towing capacity, ratings, and more – information that can be key in choosing the right vehicle and RV. You can find a comprehensive list of past Trailer Life Towing Guides here.'], 'https://webcontent.goodsam.com/trailerlife.com/digital_editions/TrailerLifeTowGuide2020.pdf', 'Download Towing Guide (PDF)'),
    ],
  },
  {
    slug: 'faq', title: 'Frequently Asked Questions', label: 'RV Basics', description: 'RV ownership, life on the road, and finding your perfect RV.',
    hero: 'faq', heroAlt: 'An RV traveling through an open landscape.', kind: 'faq', sections: questions as Section[],
  },
  {
    slug: 'innovation', title: 'Adventure. Reimagined.', label: 'Innovation',
    description: 'Shaping the RV Experience for a New Generation and a Changing World',
    hero: 'innovation', heroAlt: 'Solar panels and Starlink on a Tiffin Class A motorhome.',
    lead: ['For over 40 years, THOR has been helping people connect with nature and families with one another. We’ve enabled innumerable journeys and adventures, widened eyes and helped create lifelong memories.', 'As testament to our long-term commitment to leading global RV innovation, we’re leading another exhilarating adventure-exploring the undiscovered territory of the future.', 'THOR’s long-established culture of innovation uniquely positions us to lead the way; to create products which deliver the experience today’s owners seek and tomorrow’s RVers dream of- from design and safety to comfort and technology.'],
    sections: [
      section('Building for the Future', ['Whether it’s digital tools to help plan the journey, electric mobility systems to enable more freedom, or smart home technology which enhances comfort, THOR is blazing innovative new paths to the future of RVing.', 'And this is only the beginning.', 'It’s been said that the best way to navigate the future is to create it. That’s exactly what we’re doing.'], undefined, undefined, 'embark'),
      section('Global Innovation Mission Statement', ['The THOR Global Innovation Team strives to improve and expand the RVing experience. We work in partnership with the THOR family of companies to identify and develop innovations which enhance the enjoyment and comfort of our owners—both present and future—and increase the sustainability of RVing from the factory to the campsite.']),
      { title: 'Global Innovation Team Goals', bullets: ['Improve the RV owner experience in every way possible.', 'Ensure that THOR and its family of companies are prepared to meet the expectations of a new generation of RV owners.', 'Support the THOR family of companies in their efforts to create product differentiation through innovation.'] },
      section('THOR Innovation News', ['Catch a Glimpse of Tomorrow, Today'], source('/thor-innovation-news'), 'View All News'),
      section('Innovating for a Better Tomorrow', ['THOR’s Global Innovation Team supports the Corporate Social Responsibility policies of the THOR family of companies by supporting their commitment to reduce RVing’s impact on the environment, including its carbon footprint. These efforts include the development of electric RVs, the pursuit of more durable, lightweight and aerodynamic products, and the implementation of manufacturing practices which reduce waste and energy consumption.'], source('/innovation-and-sustainability'), 'Learn About THOR’s Global Sustainability Efforts'),
      section('Innovation Spotlight', ['THOR innovators are always working on something new and interesting. See what they’re up to now.'], source('/innovation-project-spotlight')),
      section('U.S. Innovation Lab', ['The future is happening here. Located at THOR’s Global Headquarters in Elkhart, Indiana, the US Innovation Lab is home to the Global Innovation team.'], source('/come-shape-the-future-with-us'), 'Explore Careers', 'lab'),
      section('Join Us on the Adventure!', ['One thing about an innovation ecosystem like THOR’s — it keeps evolving. Sign up for our newsletter for the latest developments as we reimagine and recreate the RV experience.'], source('/innovation'), 'Subscribe on THOR'),
    ],
  },
  {
    slug: 'history', title: 'History', label: 'About THOR', description: 'A journey that began in 1980.',
    hero: 'history', heroAlt: 'A vintage travel trailer and Buick from THOR’s history.',
    lead: ["Wade Thompson and Peter Orthwein founded THOR Industries in 1980 with the purchase of Airstream, an already iconic brand. Since going public in 1984, THOR has grown both organically and through strategic acquisitions in both recreational vehicles (RVs) and buses. Today, the THOR Family of Companies is the world's largest manufacturer of recreational vehicles.", 'Over the years THOR has received many honors for its growth and management success and has become one of the most admired and respected companies, not only in the RV industry, but in global business.'],
    sections: history.map(([year, title, text]) => section(`${year} — ${title}`, [text])),
  },
  {
    slug: 'community', title: 'Building Our Community', label: 'About THOR',
    description: 'We are committed to supporting the communities where our employees and consumers live and play.',
    hero: 'community', heroAlt: 'An aerial view of a community connected to the outdoors.',
    lead: ['We have a role to play in supporting the communities that build and use THOR products. We’ve focused on three areas where we can have the greatest impact. For young people in our hometown, we’ve developed an innovative and hands-on education program to introduce them to career opportunities in their own backyard in the recreational vehicle industry. We have also taken a strategic approach to our philanthropic efforts and created new partnerships that will have lasting benefits for all who enjoy the outdoors.'],
    sections: [
      section('LEAP Program', ['The LEAP program supports local school districts in providing applied learning and real-world experience for their students. The three curriculum levels, fifth grade, eighth grade and high school, provide students with a differentiated educational experience to meet their varying needs.'], source('/leap'), 'Learn More', 'leap'),
      section('Community Involvement', ['THOR Industries has long been a proud supporter of United Way and Habitat for Humanity. Both organizations offer many ways that we have positively impacted the communities where our employees and consumers live, work and play.'], undefined, undefined, 'habitat'),
    ],
  },
  {
    slug: 'news-events', title: 'News and Events', label: 'About THOR',
    description: 'Get the latest on RV news, innovation and sustainability from the THOR Family of Companies.',
    hero: 'news', heroAlt: 'An RV parked beside Rimrock Lake, surrounded by evergreen trees.',
    sections: [{ title: 'News and Events', cards: newsCards, href: source('/news-events'), action: 'Explore THOR’s Full News Archive' }],
  },
  {
    slug: 'careers', title: 'Careers', label: 'About THOR', description: 'A strong company builds strong careers.',
    hero: 'careers', heroAlt: 'A team member assembling an RV inside a THOR family factory.',
    lead: ['Collectively, the THOR Industries family of companies comprises the largest manufacturers of recreational vehicles. Our family of operating companies produce exceptional RVs and RV components. We make it possible for our customers to live their dreams, and we take that responsibility seriously. We’re always looking for dedicated people who feel the same! Please explore our information and companies below to learn more about our culture and benefits.', 'THOR Industries, Inc. recognizes the values and contribution of people with differences in experience, perspectives and capabilities. Diversity encompasses a variety of differences including, but not limited to: age, gender, experience, education, ethnicity, religious beliefs, cultural backgrounds, lifestyle, responsibilities, etc. At THOR we are committed to: Inspiring an inclusive culture which embraces individual differences:'],
    sections: [
      { title: 'An Inclusive Culture', bullets: ['Treating team members fairly and with respect', 'Establishing a workplace free from discrimination, harassment and bullying', 'Training team members to be aware of their rights and responsibilities in regards to fair treatment', 'Providing equal opportunities based on ability, performance and potential'] },
      section('THOR Industries Global Headquarters', ['Located in the heart of Elkhart County, we are advocates for family and the great outdoors. We are catalysts for people to connect with each other and we are champions for the exploration of the world around us.'], source('/careers-global-headquarters'), 'Explore Careers'),
      { title: 'The THOR Family of Companies', text: ['Our companies make different products in different ways, but what they all have in common is a dedication to doing the right thing — by our customers and our team members — every single day. If you feel the same, we’d love to have you. Get a glimpse into the culture of our companies, and join the THOR team that’s right for you.'], cards: [
        card('Airstream', 'Driven by innovation, rooted in humility, and obsessive about quality, the Airstream team is committed to making customers’ outdoor adventure dreams come true. And they’re building on a long legacy of success with every rivet.', 'https://www.airstream.com/company/careers/?utm_source=thorindustries.com&utm_medium=referral', 'logo-airstream', 'Now Hiring'),
        card('Jayco, Entegra Coach, Heartland RV, Open Range and DRV', 'Jayco started as a family business, and the feeling of family has only grown since then. Every single person is treated with respect and dignity at every turn, and it doesn’t count as a success unless everybody wins.', 'https://www.jaycofamily.com/careers/?utm_source=thorindustries.com&utm_medium=referral', 'logo-jayco', 'Now Hiring'),
        card('Keystone', 'The driving goal at Keystone is to make it easy for customers to find an RV that feels like it was made for them, and for team members to build that RV in the best possible way. The team works hard, works fast, shares ideas, and feels lucky to be doing it.', 'https://www.keystonerv.com/pickme', 'logo-keystone', 'Now Hiring'),
        card('KZ and Venture', 'KZ RV hangs their hat on quality at every step of the way. It’s a team who cares about what they do and who they do it for, a passion you can see everywhere—from the loyalty and career longevity to the can-do spirit and willingness to do anything it takes to get the job done right.', 'https://www.kz-rv.com/careers/?utm_source=thorindustries.com&utm_medium=referral', 'logo-kz', 'Now Hiring'),
        card('Postle Aluminum', 'As the backbone of the RV business, Postle supplies the aluminum that goes into THOR Industries RVs and so much more. From extrusion to fabrication to painting, there’s a trade for everyone and countless opportunities to join a hardworking team that will only keep growing.', 'https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=a4c08bd3-eedf-419a-9fb6-5d2ac8a3bafa&ccId=19000101_000001&lang=en_US/?utm_source=thorindustries.com&utm_medium=referral', undefined, 'Now Hiring'),
        card('Thor Motor Coach', 'What does it take to be the number one motorhome brand in North America? Four plants, six production lines, three campuses, and more than 1,000 hardworking employees who help Thor Motor Coach accomplish big goals every single day.', 'https://www.thormotorcoach.com/company/careers?utm_source=thorindustries.com&utm_medium=referral', 'logo-tmc', 'Now Hiring'),
        card('Tiffin Motorhomes', 'Every Tiffin employee plays an integral part in our mission to manufacture the finest motorhomes on the road today. By working at Tiffin, you can be a part of this mission and bring your perspective, experience, ideas, and dedication to helping us further that mission.', 'https://tiffin.applicantstack.com/x/openings', 'logo-tiffin', 'Now Hiring'),
      ] },
      section('Transparency in Coverage', ['The Transparency in Coverage Rule for group health plans requires disclosure of cost-sharing information in a machine-readable format.'], 'https://www.anthem.com/machine-readable-file/search', 'View Disclosure'),
    ],
  },
  {
    slug: 'thor-companies', title: 'THOR Family of Companies', label: 'Our Companies', description: familyCopy,
    hero: 'family', heroAlt: 'An Airstream travel trailer and family in an outdoor campsite.', kind: 'companies',
    sections: [section('THOR Industries Global Family of Companies', ['Explore the RV industry leader’s global family of companies spanning nearly 400 locations in 6 countries.'], source('/thor-companies'), 'Explore THOR’s Global Locations Map')],
  },
  {
    slug: 'sustainability', title: 'Sustainability', label: 'Sustainability', description: 'Go Everywhere. Stay Anywhere.',
    hero: 'sustainability', heroAlt: 'A couple and their dog exploring a lakeshore.',
    sections: [
      section('Sustainability Approach', ['We are committed to design and responsibly manufacture innovative products that allow our end consumers the freedom and flexibility to enjoy the outdoors and connect with nature in a sustainable manner, whenever and wherever they want. We are also committed to providing a safe and inclusive workplace for our team members and to support the communities in which our team members live and work.', 'Our sustainability strategy reflects input from our stakeholders, results of our sustainability risk management process and our identified sustainability priorities. We continue to build and advance our sustainability strategy to identify opportunities for improvement across our company to meet the needs of our team members, partners, consumers and communities while actively addressing our impact on the environment. Our sustainability strategy aligns with our business strategy and focuses on three elements: environmental concerns, social responsibility and governance.']),
      section('Environmental', ['Minimizing our impact on the planet and contributing to a more sustainable future is a key focus area in our overall sustainability strategy. In an effort to take action to combat climate change and its impacts, our environmental strategy focuses on reducing GHG emissions, reducing waste to landfill and using water in a more conservative manner.', 'As the global leader in RV manufacturing, we are invested in leading the industry in the fight against environmental threats to the outdoor and RV lifestyles. In support of these efforts, we became a signatory to Business Ambition for 1.5° C, and we committed to our goal of net-neutral carbon GHG emissions in or before 2050, with an interim target of a 50% reduction in Scope 1 and Scope 2 emissions in or before 2030.'], '/sustainability-environmental/', 'Learn More', 'environmental'),
      section('Social Responsibility', ['People are at the center of our sustainability efforts. Social issues, ranging from the health and safety of our team members to inclusive and equitable career development to the empowerment of all women and girls, are the foundation of our social strategy. In addition, our focus on community engagement is a priority, and key social areas are an important part of our corporate initiatives.', 'We prioritize the well-being, health and safety of our team members and focus on issues around diversity, equity and inclusion while implementing an ethical and connected company culture. We engage with our communities through partnerships and direct giving to support the health and well-being, education and gender equality within our communities, and we continually explore ways to give back to these communities.'], '/social-responsibility/', 'Learn More', 'social'),
      section('Governance', ['Our governance strategy focuses on transparency in reporting and alignment with evolving sustainability requirements.', 'Our executive officers and Board of Directors view oversight and effective management of sustainability-related risks and opportunities as essential to our ability to execute our strategy and achieve long-term sustainable growth.'], '/governance/', 'Learn More', 'governance'),
      section('Supply Management', ['THOR Industries, Inc. is committed to conducting our business in accordance with the highest ethical standards. We strive to act with integrity and fairness in both employment and business relationships. We expect our employees to act ethically and in compliance with all applicable laws at all times, and we expect the same from those with whom we do business, including business partners, agencies and suppliers.'], '/supply-management/', 'Learn More', 'supply'),
      section('Sustainability Committee', ['The Sustainability Committee supports on-going commitment to environmental, health, and safety, corporate social responsibility, corporate governance, sustainability, and other public policy initiatives.'], 'https://thorindustries-prod.zaneray.com/cms/media%2F24ddea17-6803-4f14-95f8-e630652797e6_sustainability+committee++-final+draft+10-10-19.pdf', 'Download the Charter (PDF)'),
      section('FY2025 Sustainability Report', [], '/sustainability-report/', 'Explore the Report', 'report'),
    ],
  },
  {
    slug: 'sustainability-report', title: 'FY2025 Sustainability Report', label: 'Sustainability',
    description: 'Explore all THOR Sustainability Reports', hero: 'report', heroAlt: 'Outdoor recreation and RV travel from THOR’s sustainability report.',
    sections: [
      section('FY2025 Sustainability Report', [], report2025, 'Download the Report (PDF)'),
      { title: 'Explore all THOR Sustainability Reports', cards: [
        card('2024 Sustainability Report', '', 'https://thorindustries-prod.zaneray.com/cms/media/Zx_vEa8jQArTz6il_THORIndustriesFY24SustainabilityReport.pdf', undefined, 'Download PDF'),
        card('2023 Sustainability Report', '', 'https://thorindustries-prod.zaneray.com/cms/media/46776dde-ad96-4b3e-ab44-5eb8e6c67233_THOR_Sustainability_2023_Final.pdf', undefined, 'Download PDF'),
        card('2022 Sustainability Report', '', 'https://thorindustries-prod.zaneray.com/cms/media/94b6406f-cbf1-4a53-8872-e5b87c834fb8_THOR_Sustainability_2022_Final.pdf', undefined, 'Download PDF'),
      ] },
    ],
  },
  {
    slug: 'sustainability-environmental', title: 'Environmental', label: 'Sustainability',
    description: 'Preserving the health of our planet is fundamental to the THOR Industries lifestyle.',
    hero: 'environmental', heroAlt: 'A rocky Pacific Northwest shoreline with evergreen trees and islands.',
    lead: ['Preserving the health of our planet is fundamental to the THOR Industries lifestyle. We have a responsibility to protect our environment, and we strive to conserve resources throughout our operations and through the development of programs like Pick Up America that help preserve our planet for the next generation of campers and with partnerships like the one we have with the National Forest Foundation that is dedicated to preserving national forests and grasslands. Today, our manufacturing processes are more energy- and resource-efficient than ever before, with an emphasis on recycling and reducing the amount of waste that goes to landfills.'],
    sections: [
      section('Environmental Policy', ['This policy states our commitment to reducing waste, minimizing environmental impact, and promoting conservation. The goal is to boost sustainability and environmental awareness at all levels of our business, as well as among our suppliers, customers, and other stakeholders.'], source('/sustainability-environmental-policy')),
      section('Business Ambition for 1.5°C Commitment', ['We believe reducing waste and emissions, minimizing environmental impact and promoting conservation at all of our locations promotes the long-term health of the company while making the world a better place for all. That is why we are paving the way to a net-zero future and became a signatory of the UN Global Compact Business Ambition for 1.5°C Commitment. As part of our focus on sustainable practices, we have pledged net-zero greenhouse gas (GHG) emissions targets by 2050 to help meet a 1.5°C future, with an interim target of 50% reduction in GHG emissions in or before 2030'], 'https://ir.thorindustries.com/investor-resources/press-releases/press-release-details/2020/THOR-Industries-Commits-To-Combat-Climate-Change/default.aspx', 'Read Press Release'),
      section('Environmental Management System (EMS)', ['THOR’s Environmental Management System (EMS) is a set of processes and practices that enable the THOR family of companies to reduce their environmental impacts and increase operating efficiencies. This proactive approach can help reduce the risk on non-compliance and improve the health and safety for our team members and communities in which we operate. THOR’s EMS also supports non-regulated goals, such as reduced energy intensity and greenhouse gas (GHG) emissions, and promotes stronger operational coordination and team member stewardship.'], 'https://thorindustries-prod.zaneray.com/cms/media/adQDI5GXnQHGZSuH_THORIndustriesEMS3_1_26.pdf', 'Download EMS Manual (PDF)'),
      section('Solid Waste & Recycling', ['The THOR family of companies has a proud history of leadership in reducing solid waste landfill disposal and increasing recycling. We are pleased to announce our goal of 50% reduction of solid waste landfill disposal in or before 2030.', 'Achieving this goal requires close collaboration with our value stream partners, particularly suppliers, to design out non-recyclable materials, reduce the quantity of packaging materials used and increase the frequency of returnable packaging. We continue to aggressively research opportunities to increase waste recycling as technology improves in this area.']),
      section('National Forest Foundation', ['America’s National Forest and Grasslands cover over 8% of the surface area of the United States and are home to virtually every form of outdoor recreation. In 2019, we established a multi-year partnership with the National Forest Foundation (NFF). The National Forest Foundation works on behalf of the American public to inspire personal and meaningful connections to our National Forests, leading forest conservation efforts and responsible recreation. Through our gifts, NFF will help to ensure these American treasures are available to our communities for generations to come.'], 'https://www.nationalforests.org/', 'Visit Website', 'forest'),
      section('Pick Up America', ['This national partnership encourages people to keep our outdoor spaces clean by pledging to remove trash from public lands. Over 259 tons of trash have been pledged to be removed from public lands since the program launched in 2019. By leaving the trails, forests, waterways, and recreation areas cleaner than we found them, we help ensure others experience the outdoors for generations to come.'], 'https://pickupamerica.com/', 'Join Us, Make Your Pledge!'),
    ],
  },
  {
    slug: 'social-responsibility', title: 'Social Responsibility', label: 'Sustainability',
    description: 'Taking care of our team members by supporting them in their personal and professional goals is a priority at THOR.',
    hero: 'social', heroAlt: 'The Thomas family enjoying a road trip.',
    lead: ['Taking care of our team members by supporting them in their personal and professional goals is a priority at THOR. We do this by engaging and connecting with our team members to help in their development. We continue to implement resources to cultivate and empower our people around the globe. THOR is proud of the work we do in our communities, as they are a valuable resource to our success. We continue to develop our culture and organization every day.'],
    sections: [
      section('Diversity and Inclusion Commitment', ['THOR Industries, Inc. recognizes the values and contributions of people with differences in experience, perspectives and capabilities. Diversity encompasses a variety of differences including, but not limited to: age, gender, experience, education, ethnicity, religious beliefs, cultural backgrounds, lifestyle and responsibilities.'], source('/diversityandinclusion')),
      section('Human Rights and Equal Employment', ['THOR Industries takes its responsibility to protect and respect human rights seriously, and we operate our business in accordance with internationally recognized human rights. More specifically, we’re dedicated to creating a workplace that respects and values people with diverse backgrounds, which enables all of our team members to do their best work.'], source('/sustainability-human-rights')),
      section('Occupational Health and Safety', ['Our employees are absolutely critical to THOR Industries’ success. We acknowledge and support every employee’s right to a safe workplace. We are committed to complying with applicable legal standards, to providing a healthy and safe work environment and working to continually improve our health and safety practices.'], source('/sustainability-employee-safety'), 'Learn More', 'careers'),
      section('Education and Community Engagement', ["We have a role to play in supporting the communities that build and use THOR Industries products. We've focused on three areas where we can have the greatest impact."], source('/sustainability-education-community-engagement'), 'Learn More', 'community'),
    ],
  },
  {
    slug: 'governance', title: 'Governance', label: 'Sustainability',
    description: 'Our commitment to high standards of corporate conduct and compliance.',
    hero: 'governance', heroAlt: 'An RV on a forest road.',
    lead: ['THOR Industries is governed by our executive officers and Board of Directors. Our President and Chief Executive Officer is a board member, while we operate with an independent Chairman of the Board.'],
    sections: [
      { title: 'Standing Committees', bullets: ['Audit Committee: Ensures the integrity of our financial statements and compliance with legal and regulatory requirements. Manages our internal and external auditors.', 'Compensation Committee: Has overall responsibility for evaluating and approving the structure of our executing plans, policies and programs.', 'Executive Committee: Exercises all of the powers and authority of the Board of Directors in the management of the business and affairs of the company when the full board is not in session.', 'Environmental, Social, Governance and Nomination Committee: Provides direction and oversight over THOR’s sustainability efforts and oversees the composition of the Board of Directors by regularly reviewing membership and nominating prospective members.'] },
      section('Corporate Governance', ['Our corporate governance guidelines assist our directors in fully understanding and effectively implementing their duties, while assuring the company’s ongoing commitment to high standards of corporate conduct and compliance.', 'We use an enterprise risk management process that actively engages the Board and executives of THOR and its companies in assessing the risks and opportunities facing our company, including, but not limited to, key risks related to innovation, cybersecurity and climate-related issues. The Board receives a full assessment annually and is updated on the most critical risks on an ongoing basis. A list of our risk factors can be found in our annual report.']),
      section('Stakeholder Engagement', ['An integral part of our approach to sustainability includes the engagement of our stakeholders, on a formal and informal basis, to better understand their concerns and needs related to sustainability and to identify potentially significant sustainability-related risks and opportunities.', 'We seek opportunities to engage with our employees, suppliers, dealers, consumers, local community members and other stakeholders to better identify and manage potential risks and to identify opportunities to provide support and leadership for our communities. We have also taken opportunities to interact with our supply base to foster engagement.', 'Focus areas identified through stakeholder engagement are evaluated for their level of impact across our value chain and are prioritized accordingly. We believe our focus on the most significant sustainability factors better enables us to assess and mitigate risk and seize opportunities, resulting in an overall positive impact on our customers, partners, team members and communities.']),
      section('Sustainability Charter', ['The Sustainability Committee supports on-going commitment to environmental, health, and safety, corporate social responsibility, corporate governance, sustainability and other public policy initiatives.'], source('/sustainability-sustainability-committee-of-thor-industries-inc.'), 'Download the Charter'),
      section('Ethics and Compliance', ['THOR Industries demands a high standard of business ethics in all areas of operation. We commit to our team members to provide a safe, supportive and respectful workplace. Our team members are provided with the tools and training to help them make ethical business decisions. We believe that our team members make better decisions in a shorter amount of time when business ethics is used as a guiding principle.'], source('/sustainability-ethics-and-compliance')),
    ],
  },
  {
    slug: 'supply-management', title: 'Supply Management', label: 'Sustainability',
    description: 'Integrity and fairness in our employment and business relationships.',
    hero: 'supply', heroAlt: 'THOR family RV manufacturing and supply operations.',
    lead: ['Along with our subsidiaries and affiliates, THOR Industries is committed to conducting business according to the highest ethical standards. This includes acting with integrity and fairness in both our employment and business relationships. We also expect our employees to act ethically, and in compliance with all applicable laws, at all times.', 'We expect the same standard of ethics from those with whom we do business, including business partners, agencies and suppliers. Most importantly, we expect all of our suppliers to comply with the principles set forth in our Conflict Minerals Policy and our Supplier Code of Conduct.'],
    sections: [
      section('Supplier Requirements', ['Suppliers are required to comply with THOR Purchasing Terms & Conditions, Supplier Code of Conduct, and THOR Information Protection & Intellectual Property Terms (if Relevant). THOR Purchasing Terms & Conditions provide the terms and conditions for all THOR purchases. The Code of Conduct sets forth our expectation that all of our business partners, agencies and suppliers will act ethically, observe the principles set forth the Supplier Code of Conduct, and comply with all applicable laws. THOR Information Protection & Intellectual Property Terms apply to all suppliers that have access to THOR confidential or IP in order to provide material or services.'], source('/supplier-requirements')),
      section('Conflict Minerals Policy', ['This policy declares the commitment of THOR to complying with the requirements of the Conflict Mineral provision of the Dodd-Frank Act, and our expectation that our suppliers do the same. We are dedicated to engaging in a socially and environmentally responsible manner, which complies with the law and supports our customers’ businesses. We support the Dodd-Frank Act concerning Conflict Minerals sourcing.'], source('/sustainability-conflict-minerals-policy')),
      section('Disclosure Pursuant to the California Transparency in Supply Chains Act of 2010', ['This disclosure confirms the commitment of THOR to legal compliance, ethical conduct, and fair employment practices wherever we conduct business in the U.S. This includes the prohibition of child or forced labor. This disclosure further identifies what steps we do not currently undertake with respect to our suppliers. We maintain the highest level of integrity in all aspects of our activities.'], source('/sustainability-disclosure-pursuant-to-the-california-transparency')),
      section('Web Hosting Standard Operating Procedure', ['Various legislative mandates require that THOR ensure adequate security for Personal Data. This document is intended to describe THOR’s Standard Operating Procedure for ensuring adequate security of THOR-Personal Data, hosted by 3rd Party Providers.'], source('/web-hosting-sop')),
      section('Custom-Code Standard Operating Procedure', ['The intent of this Standard Operating Procedure (SOP) is to communicate our minimum standards to suppliers, to ensure that suppliers deliver secure code. Suppliers will use industry-standard testing mechanisms and provide THOR with the results.'], source('/custom-code-sop')),
      section('Supplier Sustainability Self-Assessment', ['Embracing sustainability offers a method for companies to integrate environmental, social, governance and supply chain initiatives into operations and company strategy. Understanding the status, risks and opportunities posed by sustainability are critical to the long-term viability of the value-streams for which we all depend. THOR’s Supplier Self-Assessment Questionnaire is designed to be a first check of supplier activities on these topics, and a tool to enable meaningful discussions moving forward.'], 'https://thorindustries-prod.zaneray.com/cms/media/7d6de808-92aa-41b3-9139-302aa2d0416e_6.+2022_THOR+Industries+Inc.+Supplier+Sustainability+Questionnaire.pdf', 'Download Questionnaire (PDF)'),
    ],
  },
];
