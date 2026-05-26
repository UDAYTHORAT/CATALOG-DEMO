export const defaultRooms2BHK = [
  { id: 'foyer', name: 'Entry Foyer', area: '60 sqft', atmosphere: 'Arrival sequence', note: 'Gallery transition space separating public and private zones.', details: ["Art wall", "Concealed storage", "Transition lighting"], x: 40, y: 75, w: 20, h: 25, type: 'entrance' },
  { id: 'living', name: 'Living Room', area: '320 sqft', atmosphere: 'Open plan living', note: 'Extended volume flowing directly into the main terrace.', details: ["Acoustic glass", "Seamless floor transition", "Natural light"], x: 15, y: 35, w: 35, h: 40, type: 'living', highlight: true },
  { id: 'deck', name: 'Main Terrace', area: '140 sqft', atmosphere: 'City view', note: 'Deep cantilevered deck serving as an outdoor room.', details: ["Teak decking", "Glass balustrade", "City views"], x: 10, y: 10, w: 45, h: 25, type: 'balcony' },
  { id: 'dining', name: 'Dining Area', area: '120 sqft', atmosphere: 'Gathering space', note: 'Central dining node connecting kitchen and living.', details: ["Feature lighting", "Open flow"], x: 50, y: 35, w: 20, h: 30, type: 'dining' },
  { id: 'kitchen', name: 'Open Kitchen', area: '150 sqft', atmosphere: 'Functional elegance', note: 'Integrated appliances and minimal cabinetry.', details: ["Integrated appliances", "Stone countertops"], x: 70, y: 35, w: 25, h: 30, type: 'kitchen' },
  { id: 'master', name: 'Master Suite', area: '260 sqft', atmosphere: 'Quiet corner', note: 'Private suite tucked away from the main entertainment zones.', details: ["Walk-in closet", "Ensuite bath", "Sound insulation"], x: 60, y: 65, w: 35, h: 35, type: 'bedroom' },
  { id: 'guest', name: 'Guest Room', area: '180 sqft', atmosphere: 'Flexible space', note: 'Adaptable secondary room for guests or home office.', details: ["Large windows", "Built-in wardrobe"], x: 5, y: 75, w: 30, h: 25, type: 'bedroom' }
];

export const defaultRooms3BHK = [
  { id: 'foyer', name: 'Gallery Entry', area: '80 sqft', atmosphere: 'Dramatic arrival', note: 'A long gallery wall perfect for art collections.', details: ["Gallery lighting", "Wood paneling", "Concealed entry"], x: 45, y: 75, w: 10, h: 25, type: 'entrance' },
  { id: 'living', name: 'Living Room', area: '450 sqft', atmosphere: 'Corner expanse', note: 'Expansive corner volume maximizing natural light and views.', details: ["Corner glazing", "Double aspect views", "Premium flooring"], x: 10, y: 35, w: 35, h: 40, type: 'living', highlight: true },
  { id: 'deck', name: 'Sunset Deck', area: '180 sqft', atmosphere: 'Outdoor lounge', note: 'Wide terrace seamlessly extending the living space.', details: ["Seamless transition", "Evening sun", "Wind screening"], x: 5, y: 10, w: 45, h: 25, type: 'balcony' },
  { id: 'dining', name: 'Dining Room', area: '180 sqft', atmosphere: 'Formal dining', note: 'Dedicated dining space with independent light wells.', details: ["Formal setting", "Direct kitchen access"], x: 45, y: 40, w: 20, h: 35, type: 'dining' },
  { id: 'kitchen', name: 'Open Kitchen', area: '210 sqft', atmosphere: 'Culinary center', note: 'Professional-grade kitchen with hidden utility access.', details: ["Chef appliances", "Island counter", "Hidden utility"], x: 65, y: 40, w: 25, h: 35, type: 'kitchen' },
  { id: 'master', name: 'Private Suite', area: '320 sqft', atmosphere: 'Absolute privacy', note: 'Secluded master wing with extensive wardrobe space.', details: ["Deep wardrobe", "Private bath", "Corner window"], x: 60, y: 5, w: 35, h: 35, type: 'bedroom' },
  { id: 'corner', name: 'Corner Suite', area: '220 sqft', atmosphere: 'Secondary master', note: 'Large secondary bedroom with dedicated bathroom.', details: ["Ensuite", "Morning light"], x: 5, y: 75, w: 30, h: 25, type: 'bedroom' },
  { id: 'study', name: 'Study / Guest', area: '150 sqft', atmosphere: 'Quiet retreat', note: 'Compact room ideal for a home office or nursery.', details: ["Soundproofed", "Direct network wiring"], x: 65, y: 75, w: 30, h: 25, type: 'bedroom' }
];

export const defaultRooms4BHK = [
  { id: 'gallery', name: 'Gallery Entry', area: '120 sqft', atmosphere: 'Grand arrival', note: 'Imposing double-width gallery setting the tone for the penthouse.', details: ["Stone floors", "Art walls", "Powder room access"], x: 40, y: 70, w: 20, h: 30, type: 'entrance' },
  { id: 'living', name: 'Double-Height Living', area: '650 sqft', atmosphere: 'Vertical volume', note: 'Breathtaking double-height space anchoring the residence.', details: ["20ft ceiling", "Curtain wall glass", "Sculptural staircase"], x: 15, y: 30, w: 45, h: 40, type: 'living', highlight: true },
  { id: 'terrace', name: 'Dramatic Terrace', area: '350 sqft', atmosphere: 'Sky garden', note: 'Massive outdoor entertainment zone wrapping the living area.', details: ["Plunge pool provision", "Landscaped edges", "Panoramic views"], x: 5, y: 5, w: 60, h: 25, type: 'balcony' },
  { id: 'dining', name: 'Formal Dining', area: '250 sqft', atmosphere: 'Banquet space', note: 'Independent dining volume designed for hosting.', details: ["Wine display", "10-seater capacity"], x: 60, y: 30, w: 35, h: 20, type: 'dining' },
  { id: 'kitchen', name: 'Chef Kitchen', area: '280 sqft', atmosphere: 'Professional prep', note: 'Divided into wet/dry zones for seamless entertaining.', details: ["Wet/dry separation", "Walk-in pantry", "Staff access"], x: 60, y: 50, w: 35, h: 20, type: 'kitchen' },
  { id: 'master', name: 'Master Retreat', area: '450 sqft', atmosphere: 'Private sanctuary', note: 'A sprawling suite occupying its own dedicated wing.', details: ["Boutique walk-in", "Spa bathroom", "Private lounge"], x: 65, y: 5, w: 30, h: 25, type: 'bedroom' },
  { id: 'suite1', name: 'Guest Suite', area: '240 sqft', atmosphere: 'Independent suite', note: 'Private guest quarters with dedicated entry.', details: ["Private access", "Ensuite"], x: 5, y: 70, w: 35, h: 25, type: 'bedroom' },
  { id: 'suite2', name: 'Corner Suite', area: '240 sqft', atmosphere: 'Dual aspect', note: 'Corner bedroom with cross-ventilation and expansive views.', details: ["Cross-ventilation", "City skyline"], x: 65, y: 70, w: 30, h: 30, type: 'bedroom' }
];
