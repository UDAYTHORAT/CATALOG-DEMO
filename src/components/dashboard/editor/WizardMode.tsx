'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, CheckCircle2, Rocket, Info,
  Settings, Type, LayoutGrid, Package, MessageCircle, MapPin,
  ShieldCheck, Zap, Smartphone, Trophy, HelpCircle, Menu, X,
  Eye, Edit2, ArrowRight, RotateCcw, GripVertical
} from 'lucide-react';
import type { Content, TabId, Section, SectionId } from './types';
import type { Funnel } from '@/app/actions/funnels';
import PreviewPane from './PreviewPane';

interface WizardProps {
  content: Content;
  funnel: Funnel;
  panelRenderer: (tab: TabId) => React.ReactNode;
  products: any[];
  onSwitchToAdvanced: () => void;
  onFinish: () => void;
  onReorderSections: (sections: Section[]) => void;
  onResetSection?: (sectionId: SectionId) => void;
  onResetAll?: () => void;
}

// Wizard flow: same tabs as Advanced, minus WhatsApp
const WIZARD_FLOW: { id: TabId; label: string; hint: string; proTip: string; guide: string; reLabel?: string; reHint?: string; reProTip?: string; cafeLabel?: string; cafeHint?: string; cafeProTip?: string; cafeGuide?: string }[] = [
  {
    id: 'store', 
    label: 'Store Identity', 
    reLabel: 'Project Identity',
    cafeLabel: 'Cafe Identity',
    hint: 'Set your store name, WhatsApp number, and logo. This is the foundation of your funnel.',
    reHint: 'Set your project name, contact number, and branding. This is the foundation of your lead funnel.',
    cafeHint: 'Set your cafe name and WhatsApp number. This is the foundation of your table reservation funnel.',
    proTip: 'Use a clean, high-resolution logo. A professional identity builds instant trust with your customers.',
    reProTip: 'Consistent developer branding and an active contact number build instant trust with luxury property buyers.',
    cafeProTip: 'Ensure your WhatsApp number is active and monitored to capture table reservations instantly.',
    guide: '👶 Here is what to fill in:\n• **Logo**: Click or drag a picture here (PNG/JPG up to 5MB).\n• **Business Name**: Type your shop\'s name here (e.g., Urban Living).\n• **WhatsApp Lead Capture**: Put your number with country code (+91). This is where you get leads!',
    cafeGuide: '👶 Here is what to fill in:\n• **Cafe Name**: Type your cafe\'s name here (e.g., Kaffestuggu).\n• **WhatsApp Lead Capture**: Put your number with country code (+91). This is where you get leads!'
  },
  { 
    id: 'content', 
    label: 'Hero Landing', 
    cafeLabel: 'Hero & Branding',
    hint: 'Write a powerful headline and sub-headline. This is the hook that stops visitors from scrolling away.',
    reHint: 'Write a majestic project headline. This is the first impression for high-intent property buyers.',
    cafeHint: 'Set your cafe tagline, sub-tagline, and hero CTA button. This is the first impression diners see — make it irresistible.',
    proTip: 'Focus on benefits, not features. Instead of "We sell furniture", try "Transform your living space with handcrafted luxury".',
    reProTip: 'Sell the lifestyle, not the square footage. Instead of "New Apartments", try "A West-Facing Residence Designed for Silence and Light".',
    cafeProTip: 'Evoke warmth and authenticity. Instead of "Welcome to our cafe", try "The Oldest Eatery in Town" or "Freshly Roasted Since 1914".',
    guide: '👶 Here is what to do:\n• Write a big, loud sentence (Headline) to make people say "Wow!".\n• Write a little sentence below that (Sub-headline) to explain more.',
    cafeGuide: '☕ Here is what to do:\n• Write a bold tagline that captures your cafe\'s soul.\n• Add a sub-tagline with more warmth and detail.\n• Set the CTA button text (e.g., "Menu").'
  },
  { 
    id: 'categories', 
    label: 'Collections', 
    reLabel: 'Persona Matching',
    cafeLabel: 'Experience',
    hint: 'Create 1-3 product collections. Fewer choices lead to faster buying decisions.',
    reHint: 'Create 1-3 buyer personas (e.g., Family Living, Investment). This helps buyers find their perfect match instantly.',
    cafeHint: 'Upload up to 7 photos of your cafe\'s atmosphere to build your "Experience" gallery.',
    proTip: 'Start with your most popular category. Most buyers decide within the first few seconds of viewing your collections.',
    reProTip: 'Group by intent (Investment vs. Lifestyle). Segmenting your audience increases lead quality significantly.',
    cafeProTip: 'Diners book tables based on the ambiance they see. Include photos of seating, lighting, and decor.',
    guide: '👶 Here is what to do:\n• Give your group a Name (like "Sofas").\n• Add a Tagline (a short sentence) to describe it.',
    cafeGuide: '☕ Here is what to do:\n• Set the Atmosphere section headings.\n• Upload high-quality photos of your cafe interior.'
  },
  { 
    id: 'products', 
    label: 'Product Showcase', 
    reLabel: 'Property Showcase',
    cafeLabel: 'Specialities Showcase',
    hint: 'Add products with clear names, prices, and descriptions. Quality over quantity.',
    reHint: 'Add residences with clear configurations (2BHK, 3BHK), prices, and spatial details.',
    cafeHint: 'Add your top 3 signature dishes with names, prices, and high-quality photos. This curated 3-dish limit ensures maximum visual impact.',
    proTip: 'Always use real product photos if possible. Highlight customization options in the description to increase intent.',
    reProTip: 'Use high-resolution renders or site photos. Mention specific highlights like "Sky Deck" or "Italian Marble" to drive inquiries.',
    cafeProTip: 'Use real, mouth-watering food photos, not stock images. Mention key ingredients in the description so diners know what makes it special.',
    guide: '👶 Here is what to do:\n• Type the Product Name so people know what it is.\n• Put the Price so they know how much it costs.\n• Add a Picture so they can see it.',
    cafeGuide: '☕ Here is what to do:\n• Enter the Dish Name (e.g., "Artisanal Caramel Latte").\n• Set the Price (e.g., "$4.20").\n• Upload a beautiful photo of the dish.\n• Note: This showcase is strictly limited to your best 3 items.'
  },
  {
    id: 'menu',
    label: 'Full Menu',
    cafeLabel: 'Full Menu',
    hint: 'Add and categorize your full cafe menu items (e.g. Coffee, Gourmet Sandwiches, Pastries & Bites) with descriptions and prices.',
    cafeHint: 'Add and categorize your full cafe menu items (e.g. Coffee, Gourmet Sandwiches, Pastries & Bites) with descriptions and prices.',
    proTip: 'A categorized menu helps guests find their preferred items quickly. Highlight popular items like "Pesto Chicken Sourdough".',
    cafeProTip: 'A categorized menu helps guests find their preferred items quickly. Highlight popular items like "Pesto Chicken Sourdough".',
    guide: '☕ Here is what to do:\n• Manage menu categories (e.g. Coffee, Gourmet Sandwiches, Pastries).\n• Add items under each category with prices and descriptions.',
    cafeGuide: '☕ Here is what to do:\n• Create menu categories (e.g., "Gourmet Sandwiches", "Coffee").\n• Add items under each category with prices and descriptions.\n• Toggle the "Popular Badge" to highlight best-sellers (e.g., "Pesto Chicken Sourdough").'
  },
  {
    id: 'layouts',
    label: 'Layout Config',
    reLabel: 'Layout Config',
    hint: 'Configure the spatial blueprints for your store.',
    reHint: 'Configure the 2D floor plans for each residence to give buyers a true sense of scale.',
    proTip: 'Keep proportions realistic.',
    reProTip: 'Design precise 2D floor plans. Use the mobile tilt or desktop focus mode to carefully position rooms.',
    guide: '👶 Configure the spatial layout.'
  },
  { 
    id: 'testimonials', 
    label: 'Customer Reviews', 
    reLabel: 'Social Proof',
    cafeLabel: 'Guest Reviews',
    hint: 'Add real installation photos and customer reviews. Visual proof is the ultimate trust signal for premium buyers.',
    reHint: 'Add real resident or investor reviews. Trust is the primary driver for high-value real estate decisions.',
    cafeHint: 'Add 1-3 genuine guest reviews. Real testimonials are the strongest trust signal for a cafe — they drive walk-ins and reservations.',
    proTip: 'Upload high-quality photos of the product in the customer\'s home to build absolute authority.',
    reProTip: 'Highlight the speed of booking or the quality of service. Real human stories remove hesitation for large investments.',
    cafeProTip: 'Use real guest names with their role (e.g., "Food Blogger", "Tourist"). Authentic reviews with specific dish mentions are most convincing.',
    guide: '👑 How to build a luxury trust engine:\n• Add the Customer\'s Name and City.\n• Upload a real Installation Photo.\n• Add 2 strong details (e.g., "Delivered in 9 Days", "Solid Walnut Finish").',
    cafeGuide: '☕ How to build trust:\n• Add the Guest\'s Name (e.g., "Sarah L.").\n• Add their role or city (e.g., "Tourist", "Food Blogger").\n• Write a short, authentic review quote.'
  },
  { 
    id: 'location', 
    label: 'Studio Location', 
    reLabel: 'Project Site',
    cafeLabel: 'Cafe Location',
    hint: 'Add your showroom address or factory location. This helps buyers verify your store is real.',
    reHint: 'Add your experience center address or project site location. This is crucial for booking site visits.',
    cafeHint: 'Add your cafe\'s address and Google Maps link. This helps diners find you instantly and drives foot traffic.',
    proTip: 'Even if you are online-only, mentioning your base city or factory location helps establish authenticity.',
    reProTip: 'Include a Google Maps link. 80% of buyers will look at the location context before inquiring.',
    cafeProTip: 'A precise Google Maps pin is essential. 90% of diners will check your location before deciding to visit.',
    guide: '👶 Here is what to do:\n• Type your Address (where your shop is).\n• Add a Map Link so they can get directions.',
    cafeGuide: '☕ Here is what to do:\n• Type your Cafe Name (e.g., "Kaffestuggu Cafe").\n• Enter your full Address.\n• Paste a Google Maps link for directions.'
  }
];

const TAB_TOURS: Record<string, { title: string; description: string; proTip: string; dos?: string[]; donts?: string[]; targetId?: string; fallbackId?: string }[]> = {
  store: [
    { 
      title: "Click or drag image (PNG, JPG)", 
      description: "Add logo here.", 
      proTip: "Use a high-resolution logo with a transparent background for the best look.",
      dos: ["Use a clear, transparent PNG.", "Ensure your logo is readable on mobile."],
      donts: ["Don't use low-quality JPEGs.", "Avoid small text inside the logo."],
      targetId: "tour-store-logo"
    },
    { 
      title: "Business Name", 
      description: "Here add the name of the business.", 
      proTip: "Make it memorable and consistent with your brand.",
      dos: ["Use your exact registered brand name.", "Keep it under 3 words if possible."],
      donts: ["Don't use generic names like 'Furniture Store'.", "Don't add 'Inc' or 'LLC' if not needed."],
      targetId: "tour-store-name"
    },
    { 
      title: "WhatsApp Lead Capture", 
      description: "Add WhatsApp no here.", 
      proTip: "Double check this number! If it is wrong, customers cannot reach you.",
      dos: ["Use an active WhatsApp Business number.", "Ensure you have someone monitoring it."],
      donts: ["Don't use personal numbers if possible.", "Don't add spaces or hyphens."],
      targetId: "tour-store-whatsapp"
    }
  ],
  content: [
    { 
      title: "Write a Headline", 
      description: "Write a big, bold sentence that grabs attention immediately. This is the first text visitors see. Explain your main benefit in one line.", 
      proTip: "Focus on emotion and benefit (e.g., 'Transform Your Living Space with Handcrafted Luxury').",
      dos: ["Keep it under 8 words.", "Focus on the primary benefit (e.g., 'Handcrafted Luxury')."],
      donts: ["Don't just say 'Welcome to our store'.", "Avoid industry jargon."],
      targetId: "tour-content-headline"
    },
    { 
      title: "Add a Sub-headline", 
      description: "Explain a bit more about your offer or what makes you special. This text appears right below the big headline to give more context.", 
      proTip: "Keep it short, supportive, and action-oriented.",
      dos: ["Explain exactly what you sell.", "Include a subtle hook or promise."],
      donts: ["Don't write more than 2 sentences.", "Avoid repeating the headline."],
      targetId: "tour-content-subheadline"
    }
  ],
  categories: [
    { 
      title: "Selection Title", 
      description: "This is the main question you ask your customers. What do you want them to pick?", 
      proTip: "Make it action-oriented (e.g., 'What Piece Are You Looking For?').",
      dos: ["Make it a question or a clear prompt.", "Keep it conversational."],
      donts: ["Don't use boring titles like 'Categories'.", "Don't leave it blank."],
      targetId: "tour-categories-global-title"
    },
    { 
      title: "Add Collections", 
      description: "Click here to add product categories like 'Sofas', 'Beds', or 'Dining'.", 
      proTip: "Limit to 1-3 collections. Fewer choices lead to faster buying decisions and less fatigue.",
      dos: ["Create logical groups (e.g., Living Room, Bedroom).", "Use high-quality cover images for categories."],
      donts: ["Don't create more than 4 collections.", "Avoid overlapping category names."],
      targetId: "tour-categories-add-btn"
    },
    { 
      title: "Collection Name", 
      description: "Give your collection a clear name (e.g., 'Luxury Sofas').", 
      proTip: "Keep it simple and descriptive so customers know exactly what's inside.",
      targetId: "tour-categories-name",
      fallbackId: "tour-categories-empty"
    }
  ],
  products: [
    { 
      title: "Add Products", 
      description: "Add items from your catalog. This header holds the product name, category, and main price.", 
      proTip: "Keep the name short. This is what shows up on the main store page.",
      dos: ["Use specific names (e.g., 'Oak Dining Table').", "Add the accurate price."],
      donts: ["Don't use internal SKU numbers as names.", "Don't leave the description empty."],
      targetId: "tour-products-details",
      fallbackId: "tour-products-empty"
    },
    { 
      title: "Storefront Identity", 
      description: "Upload high-quality images and set your Marketing Tier (like 'Most Popular').", 
      proTip: "Use real lifestyle photos of your furniture, not just stock images. Real photos increase buying intent significantly.",
      targetId: "tour-products-storefront",
      fallbackId: "tour-products-empty"
    },
    { 
      title: "Conversion Boosters", 
      description: "Add urgency hooks (e.g., 'Selling Fast') and delivery promises (e.g., 'Ships in 7 Days').", 
      proTip: "A fast delivery promise is the #1 way to prevent cart abandonment.",
      targetId: "tour-products-boosters",
      fallbackId: "tour-products-empty"
    },
    { 
      title: "Elite Narrative", 
      description: "Write a short, engaging story about this piece. Describe the quality and feel.", 
      proTip: "Don't just list features; tell them how it will make their room look and feel.",
      targetId: "tour-products-narrative",
      fallbackId: "tour-products-empty"
    },
    { 
      title: "Premium Specifications", 
      description: "List the exact dimensions, materials, and finish. Customers need this to measure their space.", 
      proTip: "Be extremely accurate here to reduce return rates.",
      targetId: "tour-products-specs",
      fallbackId: "tour-products-empty"
    },
    { 
      title: "Craftsmanship Benefits", 
      description: "Highlight up to 3 key benefits (e.g., 'Solid Teak Wood', 'Water Resistant').", 
      proTip: "Use punchy titles. Buyers scan these bullets before reading the full narrative.",
      targetId: "tour-products-benefits",
      fallbackId: "tour-products-empty"
    }
  ],
  testimonials: [
    { 
      title: "Customer Name & City", 
      description: "Add the customer's name and their city. Local social proof (e.g., 'Rahul S. from Mumbai') feels authentic and builds trust.", 
      proTip: "Always include the city — buyers trust reviews from people in nearby locations.",
      dos: ["Use a real customer's first name and initial.", "Include their city or neighborhood."],
      donts: ["Don't use fake-sounding names like 'John Doe'.", "Don't forget the location context."],
      targetId: "tour-testimonials-name"
    },
    { 
      title: "Write Their Review", 
      description: "Paste what the customer said about your product. Keep it short and genuine — one or two sentences is perfect.", 
      proTip: "Real quotes convert better than polished marketing copy. Use their exact words.",
      dos: ["Highlight specific benefits they experienced.", "Keep it under 3 sentences."],
      donts: ["Don't write overly formal or perfect English if it wasn't what they said.", "Don't make up reviews."],
      targetId: "tour-testimonials-quote"
    },
    { 
      title: "Upload Installation Photo", 
      description: "Upload a real photo of your product installed in the customer's home. This is the single most powerful trust signal.", 
      proTip: "A real room photo beats any studio shot. It proves your product looks great in actual homes.",
      dos: ["Use user-generated content (UGC) photos.", "Show the product in a real, lived-in space."],
      donts: ["Don't reuse the pristine studio shots from the product page.", "Avoid heavily filtered images."],
      targetId: "tour-testimonials-photo"
    }
  ],
  location: [
    { 
      title: "Set Studio Location", 
      description: "Add your physical showroom address or factory location and a Google Maps link. This helps buyers verify your store is real.", 
      proTip: "Even if you are online-only, mentioning your base city or factory location helps establish authenticity.",
      dos: ["Include a valid Google Maps link.", "Add a precise studio or factory address."],
      donts: ["Don't hide your location.", "Don't use a fake address."],
      targetId: "tour-location-fields"
    }
  ],
  layouts: [
    { 
      title: "Design Floor Plans", 
      description: "Map out the exact layout of your residences so buyers can visualize the space.", 
      proTip: "Use the Focus Mode to get a massive full-screen canvas for precise drag-and-drop arrangements.",
      dos: ["Keep rooms proportionate.", "Include measurements."],
      donts: ["Don't crowd the layout.", "Avoid overlapping elements without reason."],
      targetId: "tour-layouts"
    }
  ],
  whatsapp: [
    { 
      title: "Button Appearance", 
      description: "Customize the floating WhatsApp button title, tagline, and call-to-action text.", 
      proTip: "Make it irresistible. Instead of 'Contact Us', use 'Get Best Deal Instantly'.",
      dos: ["Use strong action verbs.", "Focus on immediate value."],
      donts: ["Don't use generic text.", "Don't write paragraphs of text."],
      targetId: "tour-whatsapp-button"
    },
    { 
      title: "Lead Automation", 
      description: "Configure automated WhatsApp messaging to capture intent instantly.", 
      proTip: "Structure your message: Context -> Request -> Next Steps.",
      dos: ["Structure your message: Context -> Request -> Next Steps.", "Use the {product_name} placeholder to know what the buyer is looking at."],
      donts: ["Don't write paragraphs of text, keep it skimmable.", "Avoid asking questions the buyer won't know the answer to."],
      targetId: "tour-whatsapp-automation"
    }
  ]
};

const REAL_ESTATE_TAB_TOURS: Record<string, { title: string; description: string; proTip: string; dos?: string[]; donts?: string[]; targetId?: string; fallbackId?: string }[]> = {
  store: [
    { 
      title: "Construction Company Name", 
      description: "Enter the name of the developer or construction company representing the project.", 
      proTip: "Use the official company name. Consistent developer branding builds instant authority and trust with luxury property buyers.",
      targetId: "tour-store-name"
    },
    { 
      title: "Lead Capture Number", 
      description: "Concierge requests, visitor callbacks, and lead inquiries will route directly to this WhatsApp number.", 
      proTip: "Double check this number! Make sure it is active on WhatsApp so you never miss a high-value real estate lead.",
      targetId: "tour-store-whatsapp"
    }
  ],
  content: [
    { 
      title: "Property Identity", 
      description: "Define the Property Location, Name, and Tagline. This is the first impression visitors see when they land.", 
      proTip: "Sell the lifestyle, not the square footage. Instead of 'New Apartments', try 'A West-Facing Residence Designed for Silence and Light'.",
      dos: ["Use a short, evocative project name.", "Include a high-end tagline (e.g., 'A Signature Residence')."],
      donts: ["Don't use all caps for the name.", "Don't write a long, boring tagline."],
      targetId: "tour-hero-identity"
    },
    { 
      title: "Hero Visual", 
      description: "Upload a high-fidelity rendering or lifestyle photo that showcases the grand scale of the property.", 
      proTip: "Use a premium day or night facade shot to establish an elite luxury feel.",
      dos: ["Use a high-res (1080p+) horizontal image.", "Ensure the image is brightly lit and clear."],
      donts: ["Don't use low-res or blurry photos.", "Avoid images with heavy watermarks."],
      targetId: "tour-hero-visual"
    },
    { 
      title: "Hero Bottom Action Bar", 
      description: "Set the Property Status (e.g. 'Ready to Move') and Starting Price (e.g. '₹ 6.2 Cr').", 
      proTip: "Transparent pricing and status qualify leads early and filter for serious high-net-worth buyers.",
      dos: ["Be fully transparent with the starting price.", "Select an accurate possession status."],
      donts: ["Don't use 'Price on Request' if possible.", "Avoid misleading status labels."],
      targetId: "tour-hero-actionbar"
    },
    { 
      title: "Emotional Storytelling", 
      description: "Write a compelling section title and body describing the luxury living experience.", 
      proTip: "Evoke feelings of status and tranquility (e.g. 'Private decks. Morning light. Quiet elevation...').",
      dos: ["Focus on emotions, lifestyle, and spatial volume.", "Keep sentences short and punchy."],
      donts: ["Don't just list technical specifications here.", "Avoid giant paragraphs of text."],
      targetId: "tour-hero-story"
    }
  ],
  products: [
    { 
      title: "Residence Layouts", 
      description: "Manage your BHK configurations (e.g. 2 BHK Compact, 3 BHK Signature). Add new layouts to showcase different tiers.", 
      proTip: "Group configurations clearly. A structured selection makes comparison seamless for buyers.",
      dos: ["Add distinct options like '2 BHK' or '3 BHK Signature'.", "Keep titles short and punchy."],
      donts: ["Don't create more than 5 options.", "Avoid long, confusing configuration names."],
      targetId: "tour-products-details",
      fallbackId: "tour-products-empty"
    },
    { 
      title: "Residence Identity", 
      description: "Configure the price label, total area, and upload a high-resolution render or photo for this residence configuration.", 
      proTip: "Use premium facade shots or interior renders. Mention specific highlights like 'Sky Deck' or 'Italian Marble' in the image subtitle.",
      targetId: "tour-products-storefront",
      fallbackId: "tour-products-empty"
    },
    { 
      title: "Elite Description", 
      description: "Write an outcome-driven description highlighting the spatial volume, views, and lifestyle experience of the space.", 
      proTip: "Focus on experience: 'Efficiently designed 2-bedroom residence with an open-plan living space and a private balcony.'",
      targetId: "tour-products-narrative",
      fallbackId: "tour-products-empty"
    },
    { 
      title: "Conversion Hooks", 
      description: "Specify an urgency badge (e.g., '5 Units Left') to encourage immediate callbacks.", 
      proTip: "Using realistic numbers adds subtle urgency and speeds up the decision-making process.",
      targetId: "tour-products-boosters",
      fallbackId: "tour-products-empty"
    },
    { 
      title: "Property Details", 
      description: "Add structural metadata like Tenure (Freehold Estate), Possession (Ready to Move), and Parking details.", 
      proTip: "Clear, transparent specifications filter for highly qualified buyers and build instant trust.",
      targetId: "tour-products-specs",
      fallbackId: "tour-products-empty"
    },
    { 
      title: "Inquiry Button CTA", 
      description: "Customize the call-to-action text on the callback button for this specific space.", 
      proTip: "Use action-oriented, premium prompts like 'DISCUSS THIS SPACE' or 'REQUEST SITE VISIT' to maximize conversions.",
      targetId: "tour-products-benefits",
      fallbackId: "tour-products-empty"
    }
  ],
  location: [
    { 
      title: "Building / Project Name", 
      description: "Enter the name of your building or project site (e.g. 'The Aurelia Residences').", 
      proTip: "A premium project name builds strong luxury branding and sets high client expectations.",
      dos: ["Use the exact legal project name.", "Include the developer prefix if applicable."],
      donts: ["Don't abbreviate the project name.", "Avoid informal nicknames."],
      targetId: "tour-location-name"
    },
    { 
      title: "Google Maps URL", 
      description: "Paste your Google Maps link here so prospective buyers can easily generate driving directions.", 
      proTip: "Verifiable map pins improve response rates by over 80% for high-intent visitors.",
      dos: ["Use a direct Google Maps share link.", "Test the link to make sure it opens correctly."],
      donts: ["Don't use generic city links.", "Don't use broken or outdated pins."],
      targetId: "tour-location-link"
    },
    { 
      title: "Building/Site Address", 
      description: "Provide the complete street address of the project site or experience center.", 
      proTip: "Be detailed. Include sector, landmark, or tower numbers to avoid location confusion.",
      dos: ["Include a recognizable landmark.", "Write the full, official address."],
      donts: ["Don't be vague (e.g. 'Near the highway').", "Don't omit the city or zip code."],
      targetId: "tour-location-address"
    },
    { 
      title: "Strategic Connectivity", 
      description: "Highlight key infrastructure and transit hubs (like Highways, Metro, or Airports) near your project.", 
      proTip: "Clear, time-based distances (e.g., 'Metro - 8 min') heavily influence luxury property investment decisions.",
      dos: ["Highlight airports, highways, or major tech parks.", "Use time-based distances (e.g. '5 mins')."],
      donts: ["Don't list irrelevant or unknown locations.", "Don't exaggerate the distance."],
      targetId: "tour-location-connectivity"
    }
  ],
  layouts: [
    { 
      title: "Blueprint Layout Editor", 
      description: "Configure interactive 2D blueprints for each configuration to give buyers a true sense of scale.", 
      proTip: "Start with your primary BHK configuration. Click on any configuration card below to expand its layout canvas.",
      dos: ["Ensure you are editing the correct configuration.", "Use accurate proportions."],
      donts: ["Don't ignore the layout tool—it's highly requested by buyers."],
      targetId: "tour-layouts-details"
    },
    { 
      title: "Canvas Orientation", 
      description: "Set the orientation of the layout (e.g., 'West Facing') to showcase natural lighting and views.", 
      proTip: "Facing direction is a premium attribute. Luxury buyers prioritize sunrise and sunset exposure.",
      dos: ["State the exact primary facing direction.", "Highlight natural light advantages."],
      donts: ["Don't leave this blank.", "Avoid confusing multi-directional terms."],
      targetId: "tour-layouts-canvas"
    },
    { 
      title: "2D Blueprint Designer", 
      description: "Drag, scale, and align rooms on the blueprint canvas. Tap on any room to edit details or adjust placement.", 
      proTip: "Use the 'Focus Mode' (top right of the canvas) for a full-screen editing experience.",
      dos: ["Keep layout proportions highly accurate.", "Use focus mode for complex arrangements."],
      donts: ["Don't crowd the canvas.", "Avoid placing rooms randomly without context."],
      targetId: "tour-layouts-designer"
    },
    { 
      title: "Room List & Dimensions", 
      description: "View and edit each room's name and exact square footage. Expand any row to customize highlights and architectural quotes.", 
      proTip: "Exact dimensions (e.g. 'Sunset Balcony - 450 sqft') make configurations transparent and engaging.",
      dos: ["Provide exact measurements for every room.", "Add a lifestyle quote for key spaces."],
      donts: ["Don't use vague sizes like 'Large'.", "Don't leave the room features blank."],
      targetId: "tour-layouts-rooms"
    },
    { 
      title: "Quick Add Rooms", 
      description: "Insert pre-configured spaces (Living, Kitchen, Bedroom, Balcony, Entrance) into your active blueprint.", 
      proTip: "Include luxury rooms like 'Walk-in Closet' or 'Pooja Room' to enhance the property lifestyle profile.",
      dos: ["Add premium spaces like 'Powder Room'.", "Ensure essential spaces aren't missed."],
      donts: ["Don't add duplicate rooms unnecessarily.", "Avoid generic names for luxury spaces."],
      targetId: "tour-layouts-add"
    }
  ],
  whatsapp: [
    { 
      title: "Button Appearance", 
      description: "Customize the floating WhatsApp button title, tagline, and call-to-action text.", 
      proTip: "Make it irresistible. Instead of 'Contact Us', use 'Get Floor Plan Instantly'.",
      dos: ["Use clear action verbs (e.g., Get, View, Explore).", "Focus on immediate value for the buyer."],
      donts: ["Don't use generic text like 'Contact Us'.", "Avoid long, wordy descriptions."],
      targetId: "tour-whatsapp-button"
    },
    { 
      title: "Concierge Chat Options", 
      description: "Define the intent-based options buyers see when they click the WhatsApp button.", 
      proTip: "Provide exactly 3-4 distinct intent options and keep the {residence} placeholder to maintain context.",
      dos: ["Provide exactly 3-4 distinct intent options.", "Use {residence} to keep the message highly contextual."],
      donts: ["Don't create overlapping or confusing options.", "Don't remove the {company_name} placeholder."],
      targetId: "tour-whatsapp-concierge"
    },
    { 
      title: "Site Visit Options", 
      description: "Set up curated tour experiences for the property (e.g. Morning Tour, Sunset Viewing).", 
      proTip: "Keep the options punchy and experiential to encourage bookings.",
      dos: ["Offer curated time slots or tour experiences.", "Keep the options punchy (e.g., Sunset Viewing)."],
      donts: ["Don't ask them to type their own time.", "Avoid using more than 4 visit options."],
      targetId: "tour-whatsapp-visit"
    },
    { 
      title: "Room Explorer Inquiry", 
      description: "Configure the specific button and pre-filled message used when buyers explore the 3D floorplans.", 
      proTip: "Keep the {room_name} and {residence_name} placeholders intact so your sales team knows exactly what they are looking at.",
      dos: ["Keep the button action-oriented (e.g. Enquire About This Residence).", "Ask for detailed pricing and floorplans in the pre-filled message."],
      donts: ["Don't remove the {room_name} placeholder, it provides critical context.", "Avoid making the button text too long."],
      targetId: "tour-whatsapp-room"
    }
  ]
};

const CAFE_TAB_TOURS: Record<string, { title: string; description: string; proTip: string; dos?: string[]; donts?: string[]; targetId?: string; fallbackId?: string }[]> = {
  store: [
    { 
      title: 'Cafe Name', 
      description: 'Enter the name of your cafe. This appears on the hero, header, and WhatsApp messages.',
      proTip: 'Use your official cafe name. A recognizable brand builds instant trust with diners.',
      dos: ['Use your exact registered cafe name.', 'Keep it short and recognizable.'],
      donts: ["Don't use generic names like 'Coffee Shop'.", "Don't add 'Cafe' if it's already implied."],
      targetId: 'tour-store-name'
    },
    { 
      title: 'Table Reservation Number', 
      description: 'Add your WhatsApp number with country code. Table reservations and menu inquiries will route directly here.',
      proTip: 'Double check this number! If it is wrong, you will miss reservations.',
      dos: ['Use an active WhatsApp Business number.', 'Ensure someone monitors it during cafe hours.'],
      donts: ["Don't use a personal number if possible.", "Don't add spaces or hyphens."],
      targetId: 'tour-store-whatsapp'
    }
  ],
  content: [
    { 
      title: 'Cafe Tagline', 
      description: 'Write a bold, short tagline that captures your cafe\'s identity. This is the first text diners see on the hero page.',
      proTip: 'Focus on heritage, authenticity, or uniqueness (e.g., "The Oldest Eatery in Town").',
      dos: ['Keep it under 8 words.', 'Focus on what makes your cafe special.'],
      donts: ["Don't just say 'Welcome to our cafe'.", 'Avoid generic phrases.'],
      targetId: 'tour-content-headline'
    },
    { 
      title: 'Sub-Tagline', 
      description: 'Add a supporting line below the tagline. Describe what makes your food or experience special.',
      proTip: 'Keep it warm and inviting. Mention tradition, ingredients, or atmosphere.',
      dos: ['Explain your culinary philosophy.', 'Keep it under 2 sentences.'],
      donts: ["Don't repeat the tagline.", 'Avoid listing menu items here.'],
      targetId: 'tour-content-subheadline'
    },
    {
      title: 'Hero Badge',
      description: 'A stylish, cursive floating badge next to your cafe name.',
      proTip: 'Use a short, catchy phrase like "always fresh" or "est. 1914".',
      targetId: 'tour-content-herobadge'
    },
    {
      title: 'Call to Action Buttons',
      description: 'Configure the primary ("Menu") and secondary ("Reserve Table") buttons that drive your diner\'s next step. Add a trust hook like "Dine-in, Takeaway & Delivery".',
      proTip: 'Action-oriented text converts better. "Explore Menu" is stronger than "See More".',
      targetId: 'tour-content-cta'
    }
  ],
  categories: [
    { 
      title: 'Experience Headers', 
      description: 'Set the main heading and subheadings for your cafe atmosphere gallery.',
      proTip: 'Use inviting language like "Feel the Vibe" or "More than just coffee".',
      targetId: 'tour-experience-global-title'
    },
    { 
      title: 'Add Atmosphere Images', 
      description: 'Click to upload up to 7 photos of your cafe\'s interior, seating, or vibe.',
      proTip: 'Use high-quality, well-lit photos. Diners book tables based on the ambiance they see.',
      targetId: 'tour-experience-add-btn'
    }
  ],
  products: [
    { 
      title: 'Curate 3 Specialities', 
      description: 'Add exactly your top 3 signature dishes. We removed categories and limited this to 3 items to ensure maximum visual impact and prevent menu fatigue.',
      proTip: 'Focus only on your absolute best-sellers or highest-margin items.',
      dos: ['Curate exactly 3 signature items.', 'Use specific names (e.g., "Artisanal Caramel Latte").'],
      donts: ["Don't try to upload your full menu.", "Don't leave the description empty."],
      targetId: 'tour-products-details',
      fallbackId: 'tour-products-empty'
    },
    { 
      title: 'Dish Photo & Badge', 
      description: 'Upload a high-quality photo and set a Marketing Badge (like "Bestseller" or "Chef\'s Pick").',
      proTip: 'Use real food photos, not stock images. A real photo of your signature dish can triple reservation intent.',
      targetId: 'tour-products-storefront',
      fallbackId: 'tour-products-empty'
    },
    { 
      title: 'Best Seller Badge', 
      description: 'Highlight your absolute best-sellers with a premium "Best Seller" badge on the live page.',
      proTip: 'Use this badge sparingly to guide your visitor\'s eyes to your highest-margin signature items.',
      targetId: 'tour-products-boosters',
      fallbackId: 'tour-products-empty'
    },
    { 
      title: 'Dish Description', 
      description: 'Write a short, mouth-watering description. Mention key ingredients, flavors, or preparation style.',
      proTip: 'Paint a picture with words: "Smooth espresso, steamed milk, and sea salt caramel."',
      targetId: 'tour-products-narrative',
      fallbackId: 'tour-products-empty'
    }
  ],
  menu: [
    {
      title: 'Section Headers & Titles',
      description: 'Set the kicker and main heading for your full menu section on the landing page.',
      proTip: 'Use a clean kicker like "Our Signature" and a welcoming heading like "Handpicked recommendations just for you".',
      targetId: 'tour-menu-section-text',
      fallbackId: 'tour-menu-categories'
    },
    {
      title: 'Add New Category',
      description: 'Click here to add a new category (such as "Gourmet Sandwiches", "Desserts", or "Mocktails") to organize your menu.',
      proTip: 'A categorized menu helps guests find their preferred items quickly.',
      targetId: 'tour-menu-add-category',
      fallbackId: 'tour-menu-categories'
    },
    {
      title: 'Organize Categories',
      description: 'Click the pencil icon to rename a category, the trash icon to remove it, or the arrow icon to expand and view the items inside.',
      proTip: 'Make sure to expand a category to add or manage the dishes belonging to it.',
      targetId: 'tour-menu-categories',
      fallbackId: 'tour-menu-empty'
    },
    {
      title: 'Add Dishes & Drinks',
      description: 'Once a category is expanded, click "Add Item" to create a new dish or drink under that category.',
      proTip: 'Add as many dishes as needed to complete your menu.',
      targetId: 'tour-menu-add-item',
      fallbackId: 'tour-menu-categories'
    },
    {
      title: 'Dish Details & Pricing',
      description: 'Specify the item\'s name, exact price, and a short description. Mention key ingredients or preparation style.',
      proTip: 'Write mouth-watering descriptions: "Fresh mozzarella, ripe tomatoes, basil pesto, and wild rocket on toasted sourdough."',
      targetId: 'tour-menu-items',
      fallbackId: 'tour-menu-categories'
    },
    {
      title: 'Popular Badge Toggle',
      description: 'Toggle the "Popular Badge" to highlight a dish with a highlighted "POPULAR" badge on the live page.',
      proTip: 'Highlight 1 or 2 high-margin items per category to catch the diner\'s attention.',
      targetId: 'tour-menu-popular-badge',
      fallbackId: 'tour-menu-categories'
    }
  ],
  testimonials: [
    { 
      title: 'Guest Name & Role', 
      description: 'Add the guest\'s name and their role or city (e.g., "Tourist", "Food Blogger", "Local"). This adds authenticity.',
      proTip: 'Reviews from food bloggers or tourists carry extra social weight.',
      dos: ['Use a real guest name.', 'Add their role (Tourist, Local, Food Blogger).'],
      donts: ["Don't use fake-sounding names.", "Don't forget to add a role or city."],
      targetId: 'tour-testimonials-name'
    },
    { 
      title: 'Guest Review Quote', 
      description: 'Paste what the guest said about your cafe. Keep it short and genuine — one or two sentences is perfect.',
      proTip: 'Mention specific dishes or experiences. "The cinnamon rolls are out of this world!" is better than "Great food".',
      dos: ['Mention a specific dish or experience.', 'Keep it under 3 sentences.'],
      donts: ["Don't write overly formal text.", "Don't make up reviews."],
      targetId: 'tour-testimonials-quote'
    }
  ],
  location: [
    { 
      title: 'Cafe Name & Address', 
      description: 'Enter your cafe\'s full name and street address so diners can find you.',
      proTip: 'Include a recognizable landmark or neighborhood name to help first-time visitors.',
      dos: ['Include the full street address.', 'Add nearby landmarks.'],
      donts: ["Don't be vague (e.g., 'Near the park').", "Don't omit the city or postal code."],
      targetId: 'tour-location-fields'
    }
  ],
  whatsapp: [
    { 
      title: 'Reservation Button', 
      description: 'Customize the title and CTA text for the WhatsApp reservation button.',
      proTip: 'Make it action-oriented: "Reserve a Table" is better than "Contact Us".',
      dos: ['Use clear action verbs (Reserve, Book, Inquire).', 'Focus on immediate value.'],
      donts: ["Don't use generic text like 'Contact Us'.", 'Avoid long descriptions.'],
      targetId: 'tour-whatsapp-button'
    },
    { 
      title: 'Reservation Message Template', 
      description: 'Configure the pre-filled WhatsApp message for table reservations and menu inquiries.',
      proTip: 'Keep the {cafe_name} and {party_size} placeholders to maintain context for your staff.',
      dos: ['Structure: Greeting → Request → Details.', 'Use placeholders for personalization.'],
      donts: ["Don't write long paragraphs.", "Don't remove important placeholders."],
      targetId: 'tour-whatsapp-automation'
    }
  ]
};

export default function WizardMode({
  content, funnel, panelRenderer, products,
  onSwitchToAdvanced, onFinish, onReorderSections,
  onResetSection, onResetAll, isCafe, isRealEstate
}: WizardProps & { isCafe?: boolean; isRealEstate?: boolean }) {
  const [stepIdx, setStepIdx] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`wizard_step_${funnel.id}`);
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });
  
  const effectiveFlow = WIZARD_FLOW.filter(tab => {
    if (isRealEstate) {
      return tab.id !== 'categories' && tab.id !== 'testimonials' && tab.id !== 'menu' && tab.id !== 'layouts';
    }
    if (isCafe) {
      return tab.id !== 'layouts';
    }
    return tab.id !== 'layouts' && tab.id !== 'menu';
  });

  const activeTabRaw = effectiveFlow[stepIdx] || effectiveFlow[0];
  const activeTab = {
    ...activeTabRaw,
    label: (isCafe && activeTabRaw.cafeLabel) ? activeTabRaw.cafeLabel : (isRealEstate && activeTabRaw.reLabel) ? activeTabRaw.reLabel : activeTabRaw.label,
    hint: (isCafe && activeTabRaw.cafeHint) ? activeTabRaw.cafeHint : (isRealEstate && activeTabRaw.reHint) ? activeTabRaw.reHint : activeTabRaw.hint,
    proTip: (isCafe && activeTabRaw.cafeProTip) ? activeTabRaw.cafeProTip : (isRealEstate && activeTabRaw.reProTip) ? activeTabRaw.reProTip : activeTabRaw.proTip,
  };
  const isLast = stepIdx === effectiveFlow.length - 1;

  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window !== 'undefined') {
      const shown = localStorage.getItem(`guide_shown_${funnel.id}`);
      return !shown;
    }
    return true;
  });
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fieldHighlight, setFieldHighlight] = useState<any>(null);
  const [completedTours, setCompletedTours] = useState<Set<string>>(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stepsContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!stepsContainerRef.current) return;
    const activeEl = stepsContainerRef.current.children[stepIdx] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [stepIdx]);

  useEffect(() => {
    localStorage.setItem(`wizard_step_${funnel.id}`, stepIdx.toString());
  }, [stepIdx, funnel.id]);

  // Restore and persist scroll position of wizard editing panel
  useEffect(() => {
    const container = document.getElementById('wizard-tour-tabs');
    if (!container) return;

    const savedScroll = localStorage.getItem(`wizard_scroll_${funnel.id}_${activeTab.id}`);
    if (savedScroll) {
      container.scrollTop = parseInt(savedScroll, 10);
    }

    const handleScroll = () => {
      localStorage.setItem(`wizard_scroll_${funnel.id}_${activeTab.id}`, container.scrollTop.toString());
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [activeTab.id, funnel.id]);

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(Math.max(e.clientX, 400), window.innerWidth - 320);
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setIsKeyboardOpen(true);
      }
    };
    const handleFocusOut = () => setIsKeyboardOpen(false);

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // --- GUIDED TOUR LOGIC ---
  const rawTourSteps = (isCafe ? CAFE_TAB_TOURS[activeTab.id] : isRealEstate ? REAL_ESTATE_TAB_TOURS[activeTab.id] : TAB_TOURS[activeTab.id]) || [
    { title: "Fill Details", description: "Follow the fields to complete this step.", proTip: "Keep it simple." }
  ];

  const currentTourSteps = rawTourSteps;

  // Auto-start tour when tab changes, ONLY if not completed and haven't skipped/finished overall onboarding
  useEffect(() => {
    const shown = localStorage.getItem(`guide_shown_${funnel.id}`);
    if (shown) {
      setShowOnboarding(false);
      return;
    }

    if (!completedTours.has(activeTab.id)) {
      setOnboardingStep(1);
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [activeTab.id, completedTours, funnel.id]);

  useEffect(() => {
    if (!showOnboarding) return;
    const step = currentTourSteps[onboardingStep - 1];
    
    if (step && step.targetId) {
      // Small delay to ensure the element is in the DOM before scrolling
      setTimeout(() => {
        let el = document.getElementById(step.targetId!);
        if (!el && step.fallbackId) el = document.getElementById(step.fallbackId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    }

    // Continuously measure position to track the element while scrolling
    const interval = setInterval(() => {
      if (step && step.targetId) {
        let el = document.getElementById(step.targetId!);
        if (!el && step.fallbackId) el = document.getElementById(step.fallbackId);
        
        if (el) {
          const rect = el.getBoundingClientRect();
          const padding = 12;
          setFieldHighlight((prev: any) => {
            const newTop = rect.top - padding;
            const newLeft = rect.left - padding;
            const newWidth = rect.width + padding * 2;
            const newHeight = rect.height + padding * 2;
            
            // Only trigger re-render if position changed significantly
            if (!prev || Math.abs(prev.top - newTop) > 1 || Math.abs(prev.left - newLeft) > 1) {
              return { top: newTop, left: newLeft, width: newWidth, height: newHeight };
            }
            return prev;
          });
        } else {
          setFieldHighlight(null);
        }
      } else {
        setFieldHighlight(null);
      }
    }, 16); // ~60fps
    
    return () => clearInterval(interval);
  }, [onboardingStep, currentTourSteps, showOnboarding, activeTab.id]);

  const markTourCompleted = () => {
    setCompletedTours(prev => {
      const newSet = new Set(prev);
      newSet.add(activeTab.id);
      return newSet;
    });
    localStorage.setItem(`guide_shown_${funnel.id}`, 'true');
  };

  const handleNextTour = () => {
    if (onboardingStep < currentTourSteps.length) {
      setOnboardingStep(prev => prev + 1);
    } else {
      setShowConfetti(true);
      markTourCompleted();
      setTimeout(() => {
        setShowOnboarding(false);
        setOnboardingStep(1);
        setShowConfetti(false);
      }, 1000);
    }
  };

  const handleSkipTour = () => {
    markTourCompleted();
    setShowOnboarding(false);
    setOnboardingStep(1);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Guided Tour Overlay */}
      <AnimatePresence>
        {showOnboarding && (() => {
          const step = currentTourSteps[onboardingStep - 1];
          if (!step) return null;
          
          const c = { bg: 'bg-indigo-500', bgLight: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-400', btn: 'bg-indigo-600', btnHover: 'hover:bg-indigo-700', shadow: 'shadow-indigo-200', ring: 'ring-indigo-400/30' };

          // Always highlight the editing area for field guides
          const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
          let hl: any = { top: 68, left: 200, width: 460, height: windowHeight - 68 };
          let cardStyle: React.CSSProperties = { left: 680, top: '50%', transform: 'translateY(-50%)' };
          let arrowStyle: React.CSSProperties = { position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderRight: '10px solid white' };

          if (fieldHighlight) {
            hl = fieldHighlight;
            
            // Calculate a smart top position so the card doesn't go off-screen
            const cardHeight = 480; // Approximate max card height (with dos/donts)
            let cardTop = hl.top - 20;
            if (cardTop + cardHeight > windowHeight - 20) {
              cardTop = windowHeight - cardHeight - 20;
            }
            if (cardTop < 80) {
              cardTop = 80;
            }
            
            const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
            const isMobile = windowWidth < 1024;
            

            
            if (isMobile) {
              // Smart Flip: If field is in the lower half of screen, dock card to top. Otherwise, dock to bottom.
              if (hl.top > windowHeight / 2 - 50) {
                cardStyle = { left: 16, right: 16, top: 80, bottom: 'auto', transform: 'none' };
              } else {
                cardStyle = { left: 16, right: 16, bottom: 24, top: 'auto', transform: 'none' };
              }
              arrowStyle = { display: 'none' };
            } else {
              let proposedLeft = hl.left + hl.width + 24;
              const cardWidth = 360;
              
              // If card goes off the right edge, move it to the left side of the highlight
              if (proposedLeft + cardWidth > windowWidth - 24) {
                proposedLeft = hl.left - cardWidth - 24;
                
                // If it goes off the left edge too, center it at the bottom
                if (proposedLeft < 24) {
                  proposedLeft = Math.max(24, (windowWidth - cardWidth) / 2);
                  cardTop = hl.top + hl.height + 24;
                  arrowStyle = { display: 'none' };
                } else {
                  // Point arrow to the right if card is on the left
                  let arrowTop = (hl.top + (hl.height / 2)) - cardTop - 10;
                  arrowTop = Math.max(20, Math.min(arrowTop, cardHeight - 40));
                  arrowStyle = { position: 'absolute', right: -8, top: arrowTop, width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '10px solid white' };
                }
              } else {
                // Point arrow to the left if card is on the right
                let arrowTop = (hl.top + (hl.height / 2)) - cardTop - 10;
                arrowTop = Math.max(20, Math.min(arrowTop, cardHeight - 40));
                arrowStyle = { position: 'absolute', left: -8, top: arrowTop, width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderRight: '10px solid white' };
              }
              
              // Final clamp: ensure card bottom doesn't exceed viewport
              const maxTop = windowHeight - 120; // Leave room for the pinned footer
              if (cardTop > maxTop) cardTop = maxTop;
              
              cardStyle = { left: proposedLeft, top: cardTop, width: cardWidth };
            }
          }

          return (
            <div className="fixed inset-0 z-[200]">
              {/* Dim overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
                onClick={handleSkipTour}
              >
                <div className="absolute top-0 left-0 right-0 bg-black/40" style={{ height: hl.top }} />
                <div className="absolute left-0 right-0 bottom-0 bg-black/40" style={{ top: hl.top + hl.height }} />
                <div className="absolute bg-black/40" style={{ top: hl.top, left: 0, width: hl.left, height: hl.height }} />
                <div className="absolute bg-black/40" style={{ top: hl.top, left: hl.left + hl.width, right: 0, height: hl.height }} />
              </motion.div>

              {/* Highlight border */}
              <motion.div
                layoutId="guide-highlight"
                className={`absolute z-[201] pointer-events-none border-2 ${c.border} ring-4 ${c.ring}`}
                style={hl}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              />

              {/* Tooltip Card */}
              <motion.div
                key={onboardingStep}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: 'spring', damping: 28, stiffness: 280, delay: 0.1 }}
                className="fixed z-[210] w-[calc(100%-32px)] lg:w-[360px]"
                style={cardStyle}
              >
                <div style={arrowStyle} />
                <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col max-h-[80vh]">
                  <div className={`h-1 shrink-0 ${c.bg}`} />
                  {/* Scrollable content area */}
                  <div className="p-5 pb-3 overflow-y-auto overflow-x-hidden flex-1 min-h-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${c.bgLight} ${c.text}`}>
                        <HelpCircle size={10} />
                        Step {onboardingStep} of {currentTourSteps.length}
                      </div>
                      <span className="text-[10px] font-bold text-slate-300">{activeTab.label}</span>
                    </div>
                    <h3 className="text-[28px] leading-[1.1] text-slate-900 mb-3" style={{ fontFamily: "'Tanker', serif" }}>{step.title}</h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed mb-4">{step.description}</p>
                    <div className={`p-3.5 rounded-xl ${c.bgLight} mb-4`}>
                      <p className="text-[12px] font-semibold text-slate-700 leading-snug">{step.proTip}</p>
                    </div>
                    
                    {(step.dos || step.donts) && (
                      <div className="space-y-3 text-[10px] leading-relaxed border-t border-slate-100 pt-3">
                        {step.dos && (
                          <div>
                            <p className="font-bold text-emerald-600 mb-1 flex items-center gap-1"><CheckCircle2 size={10} /> DO THIS</p>
                            <ul className="list-disc pl-3 text-slate-600 space-y-1">
                              {step.dos.map((d: string, i: number) => <li key={i}>{d}</li>)}
                            </ul>
                          </div>
                        )}
                        {step.donts && (
                          <div>
                            <p className="font-bold text-rose-500 mb-1 flex items-center gap-1"><X size={10} /> AVOID</p>
                            <ul className="list-disc pl-3 text-slate-600 space-y-1">
                              {step.donts.map((d: string, i: number) => <li key={i}>{d}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Pinned footer — always visible */}
                  <div className="shrink-0 px-5 py-3 border-t border-slate-100 bg-white rounded-b-2xl flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {currentTourSteps.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-400 ${i < onboardingStep - 1 ? `w-1.5 ${c.bg} opacity-40` : i === onboardingStep - 1 ? `w-6 ${c.bg}` : 'w-1.5 bg-slate-200'}`} />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handleSkipTour} className="px-3 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-colors">Skip</button>
                      <button onClick={handleNextTour} className={`px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white transition-all active:scale-95 flex items-center gap-1.5 ${c.btn} ${c.btnHover} shadow-md ${c.shadow}`}>
                        {onboardingStep === currentTourSteps.length ? "Done" : "Next"}
                        <ChevronRight size={12} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Header — same as Advanced but with Wizard badge */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <span className="shrink-0 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-indigo-600 bg-indigo-50 px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-indigo-100">Wizard Mode</span>
          <div className="shrink-0 h-4 md:h-5 w-px bg-slate-200" />
          <div className="min-w-0 truncate">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400 truncate">Editor</p>
            <p className="text-sm md:text-base font-semibold text-slate-900 truncate">{funnel?.welcome_title ?? (isCafe ? 'Cafe Funnel' : isRealEstate ? 'Property Funnel' : 'Furniture Funnel')}</p>
          </div>
        </div>
        
        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {onResetAll && (
            <button
              onClick={onResetAll}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-rose-600 hover:bg-rose-100 transition-all active:scale-95 shadow-sm hover:shadow-md"
              title="Reset Entire Funnel"
            >
              <RotateCcw size={14} strokeWidth={2.5} />
              Reset All
            </button>
          )}
          <button onClick={onSwitchToAdvanced} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            Switch to Advanced →
          </button>
          <button
            onClick={() => { if (isLast) onFinish(); else setStepIdx(s => s + 1); }}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold shadow-lg transition-all active:scale-95 ${
              isLast ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-900 text-white hover:bg-black'
            }`}
          >
            {isLast ? <><Rocket className="h-4 w-4 text-orange-400" /> Publish & Go Live</> : <>Next Step <ChevronRight className="h-4 w-4" /></>}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden flex items-center justify-center p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-[73px] left-0 right-0 z-[100] bg-white border-b border-slate-200 shadow-2xl p-4 flex flex-col gap-3"
          >
            <button 
              onClick={() => {
                onSwitchToAdvanced();
                setIsMobileMenuOpen(false);
              }} 
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Switch to Advanced →
            </button>
            {onResetAll && (
              <button
                onClick={() => {
                  onResetAll();
                  setIsMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-[10px] font-black uppercase tracking-wider text-rose-600 hover:bg-rose-100 transition-all active:scale-95"
              >
                <RotateCcw size={14} strokeWidth={2.5} />
                Reset Entire Funnel
              </button>
            )}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (isLast) onFinish(); else setStepIdx(s => s + 1);
              }}
              className={`flex w-full items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold shadow-lg transition-all active:scale-95 ${
                isLast ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-900 text-white hover:bg-black'
              }`}
            >
              {isLast ? <><Rocket className="h-4 w-4 text-orange-400" /> Publish & Go Live</> : <>Next Step <ChevronRight className="h-4 w-4" /></>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="wizard-mobile-scroll-layout" className="flex flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory lg:overflow-hidden lg:flex-row w-full scrollbar-none scroll-smooth">
        {/* Sidebar */}
        <div 
          className={`flex h-full w-full shrink-0 snap-center flex-col border-r border-slate-200 bg-white shadow-xl relative z-40 lg:z-auto transition-all ${isResizing ? 'duration-0' : 'duration-300'}`}
          style={isDesktop ? { width: sidebarWidth ? `${sidebarWidth}px` : (activeTab.id === 'layouts' ? '900px' : '660px') } : undefined}
        >
          {/* Resizer Handle */}
          <div
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 cursor-col-resize z-50 items-center justify-center group"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
            }}
          >
            <div className={`flex items-center justify-center h-8 w-4 rounded-full bg-white border shadow-sm transition-all ${isResizing ? 'border-indigo-500 text-indigo-500 scale-110 shadow-md' : 'border-slate-200 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-400'}`}>
              <GripVertical size={12} strokeWidth={2.5} />
            </div>
          </div>

          <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
            {/* Nav Column */}
            <div className={`flex w-full md:w-[260px] shrink-0 flex-col border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50 ${isKeyboardOpen ? 'hidden md:flex' : ''}`}>
              <div className="flex-1 overflow-y-auto p-4 scrollbar-none">
                {/* Progress bar */}
                <div className="mb-5">
                  <div className="flex gap-1 mb-2">
                    {effectiveFlow.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${i <= stepIdx ? 'bg-slate-900' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">Step {stepIdx + 1} of {effectiveFlow.length}</p>
                </div>

                {/* Step buttons */}
                <div ref={stepsContainerRef} className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none snap-x">
                  {effectiveFlow.map((tab, i) => {
                    const isActive = i === stepIdx;
                    const isDone = i < stepIdx;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setStepIdx(i)}
                        className={`group shrink-0 flex md:w-full items-center justify-between rounded-xl border px-3 py-3 transition-all snap-start ${
                          isActive ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                          : isDone ? 'border-emerald-200 bg-emerald-50/60 text-emerald-700 hover:bg-emerald-50'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 whitespace-nowrap">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                            isActive ? 'bg-white/10' : isDone ? 'bg-emerald-100' : 'bg-slate-100 group-hover:bg-slate-200'
                          }`}>
                            {isDone ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-black">{i + 1}</span>}
                          </div>
                          <span className="text-xs font-bold">{(isCafe && tab.cafeLabel) ? tab.cafeLabel : (isRealEstate && tab.reLabel) ? tab.reLabel : tab.label}</span>
                        </div>
                        <ChevronRight size={12} className={`ml-2 ${isActive ? 'text-white/40' : 'text-slate-300'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Editing Column */}
            <div id="wizard-tour-tabs" className={`flex-1 overflow-y-auto bg-slate-50/30 p-4 md:p-6 pb-24 ${isKeyboardOpen ? 'pb-[50vh]' : ''}`}>
              {/* Wizard guidance banner */}
              <div className="relative flex flex-col gap-3 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 mb-6 pr-14">
                <button 
                  onClick={() => {
                    localStorage.removeItem(`guide_shown_${funnel.id}`);
                    setOnboardingStep(1);
                    setShowOnboarding(true);
                  }}
                  className="absolute top-4 right-4 flex items-center justify-center h-8 w-8 rounded-full bg-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-200 text-indigo-500 hover:bg-indigo-50 transition-all hover:scale-110 active:scale-95 animate-pulse ring-4 ring-indigo-500/20"
                  title="Show Guide"
                >
                  <HelpCircle size={16} />
                </button>
                <div className="flex items-start gap-3">
                  <Info size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Step {stepIdx + 1} — {(isCafe && activeTab.cafeLabel) ? activeTab.cafeLabel : activeTab.label}</p>
                    <p className="text-xs text-indigo-700 leading-relaxed font-medium">{(isCafe && activeTab.cafeHint) ? activeTab.cafeHint : activeTab.hint}</p>
                  </div>
                </div>
                {((isCafe && activeTab.cafeProTip) || activeTab.proTip) && (
                  <div className="mt-1 p-3 rounded-xl bg-white/80 border border-indigo-50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">💡 Pro Tip</p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{(isCafe && activeTab.cafeProTip) ? activeTab.cafeProTip : activeTab.proTip}</p>
                  </div>
                )}

              </div>

              {/* Render the exact same panel component as Advanced mode */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {panelRenderer(activeTab.id)}
                  
                  {activeTab.id !== 'layouts' && activeTab.id !== 'store' && onResetSection && (
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => onResetSection(activeTab.id as SectionId)}
                        className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-100 transition-all active:scale-95 shadow-sm hover:shadow-md"
                      >
                        <RotateCcw size={14} strokeWidth={2.5} />
                        Reset This Section
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer — Previous / Next */}
          <div className={`border-t border-slate-200 bg-slate-50/80 p-4 backdrop-blur-sm flex items-center justify-between ${isKeyboardOpen ? 'hidden md:flex' : ''}`}>
            <button
              onClick={() => stepIdx > 0 && setStepIdx(s => s - 1)}
              disabled={stepIdx === 0}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-600 transition-all hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3 w-3" /> Previous
            </button>
            <button
              onClick={() => { if (isLast) onFinish(); else setStepIdx(s => s + 1); }}
              className={`flex items-center gap-1.5 rounded-lg px-6 py-2 text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${
                isLast ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-900 text-white hover:bg-black'
              }`}
            >
              {isLast ? <><Rocket className="h-3 w-3" /> Publish</> : <>Continue <ChevronRight className="h-3 w-3" /></>}
            </button>
          </div>
          
          {/* Floating Mobile Action (Editor -> Preview) */}
          <div className={`lg:hidden absolute bottom-24 right-6 z-50 ${isKeyboardOpen ? 'hidden' : ''}`}>
            <button 
              onClick={() => {
                document.getElementById('wizard-mobile-scroll-layout')?.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl shadow-slate-900/30 font-bold text-xs active:scale-95 transition-transform"
            >
              <Eye size={16} />
              Preview
              <ArrowRight size={14} className="ml-1 opacity-50" />
            </button>
          </div>
        </div>

        {/* Live Preview — exact same PreviewPane as Advanced */}
        <div className="w-full h-full shrink-0 snap-center lg:w-auto lg:flex-1 relative">
          <PreviewPane
            funnel={funnel}
            content={content}
            products={products}
            previewMode="mobile"
            onEditSection={(sectionId) => {
              const idx = effectiveFlow.findIndex(tab => tab.id === sectionId);
              if (idx !== -1) setStepIdx(idx);
            }}
            activeSectionId={activeTab.id}
          />
          
          {/* Floating Mobile Action (Preview -> Editor) */}
          <div className="lg:hidden absolute bottom-6 left-6 z-50">
            <button 
              onClick={() => {
                document.getElementById('wizard-mobile-scroll-layout')?.scrollTo({ left: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-5 py-3 rounded-full shadow-2xl font-bold text-xs active:scale-95 transition-transform"
            >
              <ChevronLeft size={14} className="mr-1 opacity-50" />
              <Edit2 size={16} />
              Editor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
