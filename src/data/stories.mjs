const source = 'https://www.thorindustries.com/stories/';
const entries = [
  ['self-care-in-nature', 'Self-Care In Nature', 'Award-winning advocate, storyteller, and athlete Dani Reyes-Acosta shares how she unwinds outdoors and the transformative benefits of reconnecting with yourself.', 'story-care', 'Travel', 'Watch Now'],
  ['rv-camping-guide', 'The Ultimate RV Camping Guide', 'Campground Guides, Budgeting Tips & RV Camping 101', 'story-camping', 'Learn'],
  ['camping-way-of-life', 'A Camping Way of Life', 'A glimpse into touring country music artist John King’s life on the road with his family and travel trailer in tow.', 'story-king', 'On The Road'],
  ['how-to-public-land-camp', 'Five Tips for RVing on Public Land', 'Five tips to help you get prepared to venture outside the traditional campground and camp on public land.', 'story-public', 'Learn', 'Watch Now'],
  ['alternative-campsites-guide', 'Your Guide to Alternative RV Campsites', 'Tired of overcrowded campgrounds? These seasoned RV travelers share alternative RV campsites you might not know about.', 'story-alternative', 'Learn', 'Watch Now'],
  ['booking-rv-campsites', 'How Far In Advance To Book A Campsite', 'Wondering when you should book your next camping trip? Here are some tips to help.', 'story-booking', 'Learn', 'Watch Now'],
  ['how-to-camp-beach', 'How to Camp on the Beach', 'If you’re the kind of person who thinks the beach is like the promised land, Michael and Tiffany have tips for how to RV camp near the ocean and live the life of your dreams.', 'story-beach', 'Learn'],
  ['checklist-packing-moving-campsites', 'A Checklist for Packing Up and Moving Campsites', 'Samantha and Blake share their unique perspectives on how to make packing up and moving campsites faster, easier and less painless so you can spend more time enjoying the outdoors.', 'story-packing', 'Learn'],
  ['how-to-explorer-find-campsites', 'How To Think Like An Explorer And Find Great Campsites', 'Long-term RVer Karen Blue shares a few traits to help you think like an explorer and find new, epic boondocking and camping locations.', 'story-explorer', 'Learn'],
  ['recipe-swiss-chard-pesto-shakshuka', 'Swiss Chard and Pesto Shakshuka', 'A simple dish with a big name, shakshuka is a savory morning meal for any day of the week.', 'recipe-shakshuka', 'Recipes'],
  ['recipe-dry-rubbed-smoked-ribs-and-brisket', 'Dry Rubbed Smoked Ribs and Brisket', '', 'recipe-ribs', 'Recipes'],
  ['creamy-lobster-pie', 'Creamy lobster pie', 'From the creamy sauce to the sweet lobster to the flaky crust, this pie is the epitome of comfort food.', 'recipe-lobster', 'Recipes'],
  ['recipe-oatmeal-chocolate-chip-cookies', 'Oatmeal Chocolate Chip Cookies', 'Delicious cookies, RV style!', 'recipe-cookies', 'Recipes'],
  ['recipe-campfire-pizza', 'Campfire Pizza', 'How do you top a campfire pizza?', 'recipe-pizza', 'Recipes'],
  ['recipe-chia-power-bliss-balls', 'Chia Power Bliss Balls', 'Chia seeds, oats and nuts are combined with a sweet twist for the perfect on-the-go snack.', 'recipe-chia', 'Recipes', 'Watch Now'],
  ['family-campgrounds-colorado', 'Family-Friendly RV Campgrounds in Colorado', 'Colorado natives share their handpicked list of the best family-friendly campgrounds in the Centennial State.', 'road-colorado', 'On The Road'],
  ['rv-camping-beach-tips', 'Beach RV Camping: What Not To Do', 'Get advice on what NOT to do while beach RV camping from this family’s first time boondocking near the ocean.', 'road-beach', 'Learn'],
  ['rv-starter-kit', 'Your RV Starter Kit', 'John King’s (abbreviated) RV Starter Kit list for those just beginning their RV journey.', 'road-starter', 'On The Road'],
  ['first-rv-national-forest-trip', 'Tips for Your First RV Trip to a National Forest', 'Get insider secrets on finding the best campsites within National Forests.', 'road-forest', 'Travel'],
  ['how-to-plan-long-road-trip', 'How to Plan a Long Road Trip', 'Roadlife mom Christy Cutler shares her best tips for planning a long road trip in your RV––and her best tips for enjoying the journey.', 'road-trip', 'Learn'],
  ['rving-at-a-racetrack', 'The Ultimate Race Weekend Experience', 'From unmatched access to the action to an incredible tailgating vibe, here’s why RV camping at a racetrack is the ultimate race weekend experience.', 'travel-race', 'Travel'],
  ['harvest-hosts-101', 'Harvest Hosts 101', 'Get these seasoned RVer’s top five favorite Harvest Host camping destinations, plus tips for booking your trip.', 'travel-harvest', 'Travel'],
  ['rving-natures-playground', 'RVing in Nature’s Playground', '', 'travel-playground', 'Travel', 'Watch Now'],
  ['nff', 'THOR Industries & The National Forest Foundation', "Learn more about THOR Industries' partnership with the National Forest Foundation.", 'video-nff', 'Travel'],
  ['rv-decor-renovations', 'Five Renovations to Make Your RV Feel Homey', 'Renee Tilby’s favorite DIY projects for making your home-on-wheels more homey without using power tools.', 'video-homey', 'Learn'],
  ['dark-sky-astrocartography-tips', 'Plan Your Ultimate RV Stargazing Adventure', 'Escape the city lights for a starry night adventure with these tips on how to take a dark sky RV trip.', 'video-stars', 'On The Road'],
  ['boondock-poncha-springs-colorado', 'Boondock With Us', 'See how the Lahrs find epic boondocking spots with their large fifth-wheel RV, prepare for the trip, set up camp, and enjoy all the comforts of home while off-grid.', 'video-boondock', 'Travel'],
  ['exploring-florida-keys', 'Beneath the Surface', 'Travel writer and master diver Adrienne Jordan takes us on a road trip adventure throughout the Florida Keys.', 'video-keys', 'Video', 'Watch Now'],
  ['national-forest-hidden-gems', '12 Hidden Gems of the National Forest System', 'A list of 12 national forests across the country that you may not know about but should definitely check out.', 'forest', 'Travel', 'Read Full Story'],
  ['checklists-find-rv', 'Three Checklists To Help You Find Your Perfect RV', 'Interested in buying an RV but don’t know where to start? Long-term RVers Ben and Christina McMillan share their three RV checklists to help guide you through the process.', 'checklists', 'Learn', 'Read Full Story'],
];
export const stories = entries.map(([id, title, text, image, category, action]) => ({
  id, title, text, image, eyebrow: category, href: source + id, action: action || 'Read More',
}));
export const storyById = Object.fromEntries(stories.map(story => [story.id, story]));
export const categories = [
  { slug: 'learn', title: 'Learn', hero: 'story-booking', ids: ['booking-rv-campsites', 'how-to-camp-beach', 'checklist-packing-moving-campsites', 'how-to-explorer-find-campsites', 'alternative-campsites-guide', 'checklists-find-rv'] },
  { slug: 'recipes', title: 'Recipes', hero: 'recipe-shakshuka', ids: ['recipe-swiss-chard-pesto-shakshuka', 'recipe-dry-rubbed-smoked-ribs-and-brisket', 'creamy-lobster-pie', 'recipe-oatmeal-chocolate-chip-cookies', 'recipe-campfire-pizza', 'recipe-chia-power-bliss-balls'] },
  { slug: 'on-the-road', title: 'On The Road', hero: 'road-colorado', ids: ['family-campgrounds-colorado', 'rv-camping-beach-tips', 'rv-starter-kit', 'first-rv-national-forest-trip', 'how-to-plan-long-road-trip', 'alternative-campsites-guide'] },
  { slug: 'travel', title: 'Travel', hero: 'travel-canada', ids: ['rving-at-a-racetrack', 'harvest-hosts-101', 'rving-natures-playground', 'first-rv-national-forest-trip', 'national-forest-hidden-gems', 'self-care-in-nature'] },
  { slug: 'video', title: 'Video', hero: 'video-nff', ids: ['nff', 'rv-decor-renovations', 'dark-sky-astrocartography-tips', 'boondock-poncha-springs-colorado', 'exploring-florida-keys', 'camping-way-of-life'] },
];
