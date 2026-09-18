import { Property, Testimonial, AgentInfo } from '../types';

export const PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Greenwood Heritage Bungalow',
    slug: 'greenwood-heritage-bungalow',
    price: 48500000,
    formattedPrice: '₹4.85 Cr',
    type: 'Single Family',
    status: 'For Sale',
    location: 'Plot 14, Koregaon Park, Pune, Maharashtra',
    city: 'Pune',
    state: 'MH',
    zip: '411001',
    beds: 4,
    baths: 4,
    sqft: 3600,
    yearBuilt: 2022,
    description:
      'An architectural tour de force nestled in the heritage tree canopies of Koregaon Park. Featuring Burma teak accents, Italian Statuario marble, open-concept chef kitchen with premium German appliances, expansive private veranda, and landscaped Zen water garden.',
    features: [
      'Bespoke Italian Statuario Marble Floors',
      'Burma Teak Wood Fenestration',
      'Solar Rooftop Grid with EV Charger',
      'Daikin VRV Central Climate Control',
      'Primary Suite with Jacuzzi & Rain Shower',
      'Landscaped Garden with Private Lap Pool'
    ],
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    isFeatured: true,
    hoaMonthly: 12000,
    propertyTaxAnnual: 95000
  },
  {
    id: 'prop-2',
    title: 'Parkside Modern Haven',
    slug: 'parkside-modern-haven',
    price: 85000000,
    formattedPrice: '₹8.50 Cr',
    type: 'Villa',
    status: 'For Sale',
    location: 'DLF Phase 5, Golf Course Road, Gurgaon, Haryana',
    city: 'Gurgaon',
    state: 'HR',
    zip: '122002',
    beds: 5,
    baths: 5.5,
    sqft: 4800,
    yearBuilt: 2023,
    description:
      'A masterclass in contemporary luxury architecture along the prestigious Golf Course Road corridor. Double-height triple-glazed glass facades effortlessly dissolve boundaries between curated interiors and verdant private lawns. Features Lutron smart lighting, Poggenpohl kitchen, and private basement entertainment lounge.',
    features: [
      'Double-Height Glass Facade overlooking Green Belt',
      'German Poggenpohl Custom Culinary Suite',
      'Lutron Home Automation & Touch Control',
      'Private High-Speed Schindler Home Elevator',
      'Courtyard with Floating Fire Table',
      'Climate-Controlled 350-Bottle Wine Cellar'
    ],
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    isFeatured: true,
    hoaMonthly: 18500,
    propertyTaxAnnual: 145000
  },
  {
    id: 'prop-3',
    title: 'Marine Drive Arabian Sea Penthouse',
    slug: 'marine-drive-sea-penthouse',
    price: 185000000,
    formattedPrice: '₹18.50 Cr',
    type: 'Penthouse',
    status: 'For Sale',
    location: 'Marine Drive Promenade, Churchgate, Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'MH',
    zip: '400020',
    beds: 4,
    baths: 4.5,
    sqft: 5200,
    yearBuilt: 2023,
    description:
      'Crown-jewel 34th-floor sky residence boasting unobstructed 270-degree panoramic vistas of the Queen’s Necklace and the Arabian Sea. Includes direct biometric high-speed elevator access, 1,800 sq ft private viewing terrace with infinity plunge pool, Boffi custom kitchen, and 24/7 five-star white-glove concierge.',
    features: [
      'Unobstructed Panoramic Arabian Sea & Queen’s Necklace Views',
      '1,800 sq ft Private Rooftop Terrace & Plunge Pool',
      'Biometric Direct High-Speed Elevator Access',
      'Boffi Kitchen with Sub-Zero & Miele Appliances',
      'Master Spa Suite with Hydrotherapy Tub',
      'Four Dedicated Automated Basement Parking Bays'
    ],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    isFeatured: true,
    hoaMonthly: 42000,
    propertyTaxAnnual: 280000
  },
  {
    id: 'prop-4',
    title: 'Casa Sol Oceanfront Portuguese Villa',
    slug: 'casa-sol-oceanfront-villa',
    price: 127500000,
    formattedPrice: '₹12.75 Cr',
    type: 'Villa',
    status: 'For Sale',
    location: 'Assagao Badem Road, Assagao, North Goa',
    city: 'Goa',
    state: 'GA',
    zip: '403507',
    beds: 4,
    baths: 5,
    sqft: 4500,
    yearBuilt: 2024,
    description:
      'Sensitively restored Indo-Portuguese luxury estate amidst coconut groves and swaying palms in high-fashion Assagao. Features exposed laterite stone arches, double-height vaulted timber ceilings, 20-meter infinity pool, shaded cabanas, and detached staff quarters.',
    features: [
      'Restored Indo-Portuguese Architectural Heritage',
      '20-Meter Private Heated Saltwater Infinity Pool',
      'Open-Air Courtyard Dining with Pizza Oven',
      'Off-Grid Capable Solar Power & Battery System',
      'Separate Two-Bedroom Detached Staff Quarters',
      'Lush 1.2 Acre Gated Tropical Estate'
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
    ],
    isFeatured: true,
    hoaMonthly: 15000,
    propertyTaxAnnual: 85000
  },
  {
    id: 'prop-5',
    title: 'The Luminary Worli Sky Penthouse',
    slug: 'the-luminary-worli-penthouse',
    price: 350000,
    formattedPrice: '₹3,50,000/mo',
    type: 'Penthouse',
    status: 'For Rent',
    location: 'Worli Sea Face Promenade, Worli, Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'MH',
    zip: '400018',
    beds: 3,
    baths: 3.5,
    sqft: 2800,
    yearBuilt: 2023,
    description:
      'Ultra-luxury sky residence for lease in an iconic tower on Worli Sea Face. Features direct elevator access into an art gallery foyer, wraparound sea-view deck facing Bandra-Worli Sea Link, Italian Poliform kitchen, and membership to the tower’s clubhouse and rooftop sky lounge.',
    features: [
      'Direct Private High-Speed Elevator Access',
      'Sea Link & Arabian Sea Sunset Panoramas',
      'Fully Furnished with Imported Italian Decor',
      'Tower Clubhouse with Olympic Pool & Spa',
      '24/7 Security, Valet, & Concierge Desk'
    ],
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    isFeatured: false,
    hoaMonthly: 25000,
    propertyTaxAnnual: 110000
  },
  {
    id: 'prop-6',
    title: 'Nilgiri Granite Architectural Residence',
    slug: 'nilgiri-granite-architectural-residence',
    price: 62000000,
    formattedPrice: '₹6.20 Cr',
    type: 'Single Family',
    status: 'For Sale',
    location: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana',
    city: 'Hyderabad',
    state: 'TS',
    zip: '500033',
    beds: 4,
    baths: 4.5,
    sqft: 3950,
    yearBuilt: 2023,
    description:
      'Sculptural contemporary estate built with raw Nilgiri granite and charred cedar in prime Jubilee Hills. Designed to harness natural wind tunnels for passive cooling, centered around an indoor water courtyard with open skylights and views towards KBR National Park.',
    features: [
      'IGBC Platinum Green Building Certified',
      'Bespoke Hand-Chiseled Nilgiri Granite Facade',
      'Central Rainwater Harvesting Courtyard',
      '11-Seat Dolby Atmos Private Home Theatre',
      'Cantilevered Teak Wood Floating Staircase',
      'Three Covered Automated Basement Car Parks'
    ],
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80'
    ],
    isFeatured: true,
    hoaMonthly: 12000,
    propertyTaxAnnual: 92000
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Rajesh & Sunita Singhal',
    role: 'Industrialist, Mumbai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: '“The absolute premier luxury advisory in India. Their discreet off-market network in South Mumbai helped us secure our sea-facing duplex before it ever reached the open market without bidding wars.”',
    verified: true
  },
  {
    id: 'test-2',
    name: 'Anita Krishnan',
    role: 'Tech Founder & Investor, Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: '“Their deep valuation acumen, architectural rigor, and strategic negotiation saved us over ₹85 Lakhs on our Golf Course Road villa acquisition. LuxeLiving is our only choice in India.”',
    verified: true
  },
  {
    id: 'test-3',
    name: 'Kabir & Tara Mehta',
    role: 'NRI Investor, Singapore / Dubai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: '“A seamless, white-glove NRI purchasing experience. From title diligence to MahaRERA registration and escrow closing, Priya and the LuxeLiving team made buying our Goa estate effortless.”',
    verified: true
  }
];

export const AGENT_INFO: AgentInfo = {
  name: 'Priya Sharma',
  role: 'Managing Principal & Ultra-Luxury Property Specialist',
  experienceYears: 12,
  rank: 'Top 1% Luxury Producer in India',
  salesVolume: '₹850+ Cr Sales Volume',
  bio: 'With over 12 years of leadership in India’s ultra-prime residential market, Priya advises HNI families, tech founders, and NRI investors. Her advisory combines proprietary data-driven valuation models with absolute discretion and personalized concierge representation.',
  fullBio: 'Priya Sharma has orchestrated over ₹850 Crore in residential transactions across premier locations in Mumbai (Worli, Bandra, Marine Drive), Delhi NCR (Golf Course Road, Lutyens’ Delhi), Goa, and Bengaluru. Regularly featured in economic dailies as an authority on Indian luxury housing trends, Priya brings institutional-grade due diligence, MahaRERA compliance expertise, and bespoke off-market access to every client mandate.',
  image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  phone: '+91 98201 54321',
  email: 'priya.sharma@luxeliving.in',
  licenseNumber: 'MahaRERA Reg. #A51900028491',
  specialties: [
    'Seafront Penthouses & Duplexes',
    'Private Gated Villas & Estates',
    'Discreet Off-Market Acquisitions',
    'NRI Investment & Wealth Advisory',
    'MahaRERA & Legal Due Diligence'
  ]
};
