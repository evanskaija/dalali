const fs = require('fs');

// Category-specific Unsplash images that ACTUALLY represent each property type
const imagesByType = {
  room: [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1598928506311-c55dd10cc7eb?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1614849963640-9cc74b2a826f?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1631049035182-249067d7618e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1594563703937-fdc640497dcd?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600',
  ],
  'master-room': [
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1560185008-b033106af5c8?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1631049035182-249067d7618e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600',
  ],
  house: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600585154526-990dced4ea0d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600566753086-00f18efc2291?auto=format&fit=crop&q=80&w=600',
  ],
  apartment: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1502672260266-1c1de2d93688?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600607687931-cebf0046d48d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1598928506311-c55dd10cc7eb?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600585154526-990dced4ea0d?auto=format&fit=crop&q=80&w=600',
  ],
  plot: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1595880500386-4b33823294fb?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1562981084-e26e20909b4f?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1582407947092-40c4f9baa773?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1542621334-a254cf47733d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=600',
  ],
  hall: [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1431540015160-0295292d70c3?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=600',
  ],
};

const titles = {
  room: [
    'Cozy Single Room - Tiled Floor',
    'Affordable Bedsitter Near Market',
    'Clean Single Room with Bathroom',
    'Budget-Friendly Room for Student',
    'Single Room - Ground Floor',
    'Furnished Single Room',
    'Single Room with Kitchen Access',
    'Quiet Single Room Near University',
    'Self-Contained Single Room',
    'Bright Single Room - New Build', 
    'Single Room with Balcony',
    'Renovated Single Room',
    'Single Room - Gated Compound',
    'Single Room Near Bus Stop',
    'Spacious Single Room',
  ],
  'master-room': [
    'Ensuite Master Bedroom',
    'Spacious Master Room with AC',
    'Modern Master Suite - Tiled',
    'Master Room with Walk-in Closet',
    'Large Master Bedroom - Top Floor',
    'Master Room with Private Bath',
    'Luxury Master Suite',
    'Master Bedroom - Sea Breeze',
    'Self-Contained Master Room',
    'Master Room in Gated Estate',
    'Master Room with Wardrobe',
    'Furnished Master Suite',
    'Master Room - New Apartment',
    'Premium Master Bedroom',
    'Master Room Near Shopping Mall',
  ],
  house: [
    'Beautiful 3-Bedroom Family House',
    'Modern 4-Bedroom Villa',
    'Spacious Bungalow with Garden',
    'Stand-Alone House with Parking',
    '2-Bedroom House - Quiet Area',
    'Renovated 3BR House',
    'Family Home with Security',
    'Gated 4-Bedroom Residence',
    'Modern House with Pool',
    'Traditional Swahili Home',
    'Duplex House - 3 Floors',
    'Executive 5-Bedroom Villa',
    'Compact 2BR Starter Home',
    'Corner House with Big Yard',
    'New Build - Move In Ready',
  ],
  apartment: [
    'Modern Studio Apartment',
    'Luxury 2BR Apartment',
    'Family Apartment with Pool',
    'Penthouse with City View',
    'Furnished 1BR Flat',
    'Ocean View Condo',
    'Budget Studio - CBD',
    '3-Bedroom Apartment',
    'Serviced Apartment',
    'Loft-Style Flat',
    'Apartment with Gym Access',
    'Rooftop Apartment',
    'New Apartment Complex',
    '2BR Flat Near Hospital',
    'Executive Apartment Suite',
  ],
  plot: [
    'Prime 1200sqm Compound',
    'Residential Plot - Title Deed',
    'Corner Plot Near Highway',
    'Beachside Compound',
    'Commercial Plot - Main Road',
    'Half Acre Compound',
    'Fenced Plot Ready to Build',
    'Investment Plot - Developing Area',
    'Large Compound with Trees',
    '800sqm Surveyed Plot',
    'Gated Compound - 2 Acres',
    'Industrial Plot',
    'Hilltop Plot with Views',
    'Flat Plot - All Services Connected',
    'Double Plot - Can Subdivide',
  ],
  hall: [
    'Grand Wedding Hall',
    'Modern Conference Center',
    'Elegant Banquet Hall',
    'Multi-Purpose Event Space',
    'Outdoor Garden Venue',
    'Corporate Meeting Hall',
    'Traditional Ceremony Ukumbi',
    'Ballroom - 500 Capacity',
    'Intimate Reception Hall',
    'Exhibition Hall',
    'Rooftop Event Venue',
    'Cultural Center Hall',
    'Luxury Gala Venue',
    'Community Hall',
    'Beach Wedding Venue',
  ],
};

const locations = [
  { name: 'Kijitonyama, Dar es Salaam', lat: -6.7798, lng: 39.2443 },
  { name: 'Mikocheni, Dar es Salaam', lat: -6.7601, lng: 39.2393 },
  { name: 'Masaki, Dar es Salaam', lat: -6.7368, lng: 39.2785 },
  { name: 'Sinza, Dar es Salaam', lat: -6.7865, lng: 39.2274 },
  { name: 'Oyster Bay, Dar es Salaam', lat: -6.7570, lng: 39.2740 },
  { name: 'Ubungo, Dar es Salaam', lat: -6.7905, lng: 39.2079 },
  { name: 'Kigamboni, Dar es Salaam', lat: -6.8200, lng: 39.3000 },
  { name: 'Mbezi Beach, Dar es Salaam', lat: -6.7200, lng: 39.2300 },
];

const types = ['room', 'master-room', 'house', 'apartment', 'plot', 'hall'];
let properties = [];
let idCounter = 1;

for (const type of types) {
  const typeImages = imagesByType[type];
  const typeTitles = titles[type];

  for (let i = 0; i < 15; i++) {
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const lat = loc.lat + (Math.random() - 0.5) * 0.05;
    const lng = loc.lng + (Math.random() - 0.5) * 0.05;

    // Shuffle images for variety but keep all 15
    const shuffledImages = [...typeImages].sort(() => 0.5 - Math.random());

    let price = 0;
    if (type === 'room') price = 100000 + Math.floor(Math.random() * 100000);
    else if (type === 'master-room') price = 150000 + Math.floor(Math.random() * 150000);
    else if (type === 'house') price = 500000 + Math.floor(Math.random() * 1000000);
    else if (type === 'apartment') price = 400000 + Math.floor(Math.random() * 800000);
    else if (type === 'plot') price = 10000000 + Math.floor(Math.random() * 40000000);
    else if (type === 'hall') price = 800000 + Math.floor(Math.random() * 1200000);

    properties.push({
      id: `gen-${idCounter++}`,
      title: typeTitles[i],
      price,
      location: loc.name,
      type,
      bedrooms: type === 'room' || type === 'master-room' ? 1 : type === 'plot' || type === 'hall' ? 0 : 2 + Math.floor(Math.random() * 3),
      bathrooms: type === 'plot' ? 0 : 1 + Math.floor(Math.random() * 3),
      images: shuffledImages,
      status: Math.random() > 0.15 ? 'available' : 'occupied',
      distance: +(1 + Math.random() * 15).toFixed(1),
      latitude: +lat.toFixed(4),
      longitude: +lng.toFixed(4),
      agentId: `a${1 + Math.floor(Math.random() * 4)}`,
      isPremium: Math.random() > 0.75,
    });
  }
}

const fileContent = `export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: 'apartment' | 'house' | 'room' | 'master-room' | 'plot' | 'hall';
  bedrooms: number;
  bathrooms: number;
  images: string[];
  video?: string;
  status: 'available' | 'occupied';
  distance?: number;
  latitude: number;
  longitude: number;
  agentId: string;
  isPremium: boolean;
}

export const mockProperties: Property[] = ${JSON.stringify(properties, null, 2)};
`;

fs.writeFileSync('./src/mockData/properties.ts', fileContent);
console.log('Generated ' + properties.length + ' properties with category-specific images');
