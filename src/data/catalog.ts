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
    id: "celestial-sofa",
    slug: "celestial-sofa",
    name: "CELESTIAL",
    category: "Signature Collection",
    price: 4800,
    priceRange: "$4,800 - $6,200",
    dimensions: { length: 260, width: 110, height: 75, unit: "cm" },
    materials: ["Performance Velvet", "Solid Oak Chassis"],
    finish: "Deep Sea / Forest Green",
    description: "A monumental study in comfort and structural elegance. The Celestial Sofa features a hand-carved oak frame that floats beneath meticulously upholstered volumes.",
    construction: "Kiln-dried oak frame with multi-layer density foam and webbed suspension.",
    origin: "Aurelian Studio",
    weight: "110kg",
    leadTime: "10-12 weeks",
    tags: ["Velvet", "Signature", "Oak"],
    hotspot: { x: "50%", y: "60%" },
    designedFor: [
      "Large open-plan living spaces",
      "Statement interior compositions",
      "Long-duration seating comfort"
    ],
    craftNotes: {
      buildTime: "120 hours handcrafted",
      joinery: "Mortise and tenon joinery",
      source: "FSC Certified European Oak"
    },
    images: {
      hero: "/sofa/full-sofa.jpeg",
      gallery: [
        "/sofa/blue-sofa.jpeg",
        "/sofa/green-sofa.jpeg",
        "/sofa/blue-angle-3.jpeg",
        "/sofa/angle-blue-2.jpeg"
      ],
      details: [
        "/sofa/sofa-complete sketch.jpeg",
        "/sofa/sofa-sketch.jpeg",
        "/sofa/sofa-model.jpeg"
      ]
    }
  },
  {
    id: "elysian-sofa",
    slug: "elysian-sofa",
    name: "ELYSIAN",
    category: "Heritage Collection",
    price: 3900,
    priceRange: "$3,900 - $5,100",
    dimensions: { length: 240, width: 100, height: 82, unit: "cm" },
    materials: ["Washed Belgian Linen", "Reclaimed Oak Chassis"],
    finish: "Natural Oat / Terracotta / Sage",
    description: "A timeless silhouette wrapped in soft-washed Belgian linen. The Elysian Sofa embraces effortless elegance with its relaxed slipcover drape and deeply cushioned proportions.",
    construction: "Reclaimed oak frame with eight-way hand-tied springs and layered feather-down cushions.",
    origin: "Aurelian Studio",
    weight: "95kg",
    leadTime: "8-10 weeks",
    tags: ["Linen", "Heritage", "Slipcovered"],
    hotspot: { x: "50%", y: "55%" },
    designedFor: [
      "Warm, sunlit living rooms",
      "Casual entertaining spaces",
      "Everyday enduring comfort"
    ],
    craftNotes: {
      buildTime: "90 hours handcrafted",
      joinery: "Dowelled & glued joinery",
      source: "Reclaimed European Oak"
    },
    images: {
      hero: "/sofa-2/sofa-1-white.jpeg",
      gallery: [
        "/sofa-2/sofa-1-white.jpeg",
        "/sofa-2/red.jpeg",
        "/sofa-2/green.jpeg",
        "/sofa-2/diffrent angles.jpeg"
      ],
      details: [
        "/sofa-2/sketch of sofa.jpeg",
        "/sofa-2/diffrent angles.jpeg",
        "/sofa-2/sofa-room-white.jpeg"
      ]
    }
  }
];

export const CATALOG_DATA: Spread[] = [
  {
    id: "celestial-intro",
    pageNumber: "01-02",
    title: "Celestial Genesis",
    description: "From structural sketch to material reality. Experience the evolution of form.",
    image: "/sofa/full-sofa.jpeg",
    introSequence: [
      {
        image: "/sofa/room image.jpeg",
        label: "The Canvas",
        sublabel: "An empty room awaits its centerpiece",
        type: "room"
      },
      {
        image: "/sofa/sofa-sketch.jpeg",
        label: "The Blueprint",
        sublabel: "Every masterpiece begins with a single line",
        type: "sketch"
      },
      {
        image: "/sofa/sofa-model.jpeg",
        label: "The Skeleton",
        sublabel: "Oak frame, mortise & tenon joinery",
        type: "build"
      },
      {
        image: "/sofa/compete sofa sketch.jpeg",
        label: "The Vision",
        sublabel: "Imagined into the space it was designed for",
        type: "compose"
      },
      {
        image: "/sofa/full-sofa.jpeg",
        label: "The Masterpiece",
        sublabel: "Celestial — born from craft, built for legacy",
        type: "reveal"
      }
    ],
    products: [PRODUCTS[0]]
  },
  {
    id: "elysian-intro",
    pageNumber: "03-04",
    title: "Elysian Heritage",
    description: "Softness refined through generations. Where heritage linen meets modern living.",
    image: "/sofa-2/sofa-room-white.jpeg",
    introSequence: [
      {
        image: "/sofa-2/sofa-room-white.jpeg",
        label: "The Setting",
        sublabel: "A sunlit room yearning for warmth",
        type: "room"
      },
      {
        image: "/sofa-2/sketch of sofa.jpeg",
        label: "The Draft",
        sublabel: "Pencil on paper — the first conversation with form",
        type: "sketch"
      },
      {
        image: "/sofa-2/diffrent angles.jpeg",
        label: "The Perspective",
        sublabel: "Every angle tells a different story",
        type: "build"
      },
      {
        image: "/sofa-2/red.jpeg",
        label: "The Palette",
        sublabel: "Terracotta warmth, sage calm, natural purity",
        type: "compose"
      },
      {
        image: "/sofa-2/sofa-1-white.jpeg",
        label: "The Heirloom",
        sublabel: "Elysian — woven from legacy, dressed in linen",
        type: "reveal"
      }
    ],
    products: [PRODUCTS[1]]
  }
];
