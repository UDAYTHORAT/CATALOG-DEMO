export type Dimensions = {
  length: number;
  width: number;
  height: number;
  unit: "cm";
};

export type CraftNotes = {
  buildTime: string;
  joinery: string;
  source: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  priceRange: string;
  dimensions: Dimensions;
  materials: string[];
  finish: string;
  description: string;
  construction: string;
  origin: string;
  weight: string;
  leadTime: string;
  tags: string[];
  hotspot: { x: string; y: string };
  designedFor: string[];
  craftNotes: CraftNotes;
  images: {
    hero: string;
    gallery: string[];
    details: string[];
  };
};

export type IntroPhase = {
  image: string;
  label: string;
  sublabel: string;
  type: 'room' | 'sketch' | 'build' | 'compose' | 'reveal';
};

export type Spread = {
  id: string;
  pageNumber: string;
  title: string;
  description: string;
  image: string;
  introSequence?: IntroPhase[];
  products: Product[];
};

export const PRODUCTS: Product[] = [
  {
    id: "ibisca-sofa",
    slug: "ibisca-sofa",
    name: "IBISCA",
    category: "Sofas",
    price: 3200,
    priceRange: "$3,200 - $4,500",
    dimensions: { length: 220, width: 95, height: 80, unit: "cm" },
    materials: ["Solid U.S. Pine Wood", "Duroflex 32 Density Foam", "Velvet / Art Leatherite"],
    finish: "Custom Options Available",
    description: "The Ibisca is a masterclass in structural integrity and plush comfort. Built upon a robust foundation of solid U.S. Pine, it features Duroflex 32-density foam for a seating experience that remains supportive over time.",
    construction: "Solid U.S. Pine frame with Duroflex 32-density foam filling and premium upholstery options.",
    origin: "Estre Furnitures",
    weight: "85kg",
    leadTime: "6-8 weeks",
    tags: ["Pine", "Velvet", "Leatherite", "Duroflex"],
    hotspot: { x: "45%", y: "65%" },
    designedFor: [
      "Modern minimalist interiors",
      "Executive lounge environments",
      "Refined residential spaces"
    ],
    craftNotes: {
      buildTime: "75 hours handcrafted",
      joinery: "Reinforced pine joinery",
      source: "Sustainably sourced U.S. Pine"
    },
    images: {
      hero: "/sofa-3/sofa image.jpeg",
      gallery: [
        "/sofa-3/sofa-room-premuim.jpeg",
        "/sofa-3/Dusty_Pink_i_202604231144.jpeg",
        "/sofa-3/blue.jpeg",
        "/sofa-3/sofa-enhanced.jpeg"
      ],
      details: [
        "/sofa-3/sofa-sketch.jpeg",
        "/sofa-3/sofa-sketch diffrent angle.jpeg",
        "/sofa-3/sofa-installation.jpeg"
      ]
    }
  }
];

// Derive all unique categories
export const CATEGORIES = Array.from(new Set(PRODUCTS.map(p => p.category)));

export const CATALOG_DATA: Spread[] = [
  {
    id: "ibisca-intro",
    pageNumber: "01-02",
    title: "Ibisca Foundation",
    description: "Designed for life. Strength from solid U.S. Pine, comfort from 32-density Duroflex foam.",
    image: "/sofa-3/sofa-enhanced.jpeg",
    introSequence: [
      {
        image: "/sofa-3/sofa-enhanced.jpeg",
        label: "Living Space Context",
        sublabel: "Designed for life, engineered for rest",
        type: "room"
      },
      {
        image: "/sofa-3/sofa-sketch.jpeg",
        label: "The Concept",
        sublabel: "Precision geometry meeting ergonomic comfort",
        type: "sketch"
      },
      {
        image: "/sofa-3/sofa-sketch diffrent angle.jpeg",
        label: "The Blueprint",
        sublabel: "U.S. Pine framework, engineered for longevity",
        type: "sketch"
      },
      {
        image: "/sofa-3/sofa-installation.jpeg",
        label: "The Build",
        sublabel: "Duroflex 32-density cushioning in progress",
        type: "build"
      },
      {
        image: "/sofa-3/sofa image.jpeg",
        label: "The Artifact",
        sublabel: "Ibisca — strength in pine, grace in velvet",
        type: "reveal"
      }
    ],
    products: [PRODUCTS[0]]
  }
];
