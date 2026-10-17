export const PAINT_PRESETS = [
  {
    id: 'graphite',
    name: 'Graphite Metallic',
    finish: 'Metallic Tri-Coat',
    hex: '#4b5056',
    accent: '#d4af37',
    filter: 'none',
    default: true
  },
  {
    id: 'obsidian',
    name: 'Obsidian Black',
    finish: 'Deep Gloss Piano',
    hex: '#111215',
    accent: '#8e97a4',
    filter: 'brightness(0.68) contrast(1.22)'
  },
  {
    id: 'titanium',
    name: 'Titanium Silver',
    finish: 'Liquid Metal High-Gloss',
    hex: '#b8c0c8',
    accent: '#5bc0be',
    filter: 'brightness(1.35) contrast(1.08) saturate(0.85)'
  },
  {
    id: 'racing_yellow',
    name: 'Racing Yellow',
    finish: 'Track Gloss Solid',
    hex: '#e2b312',
    accent: '#f5c518',
    filter: 'sepia(0.75) hue-rotate(10deg) saturate(2.6) brightness(1.02)'
  },
  {
    id: 'deep_rosso',
    name: 'Deep Rosso',
    finish: 'Pearl Tint-Coat',
    hex: '#82111a',
    accent: '#ff2a2a',
    filter: 'sepia(0.85) hue-rotate(318deg) saturate(2.7) brightness(0.88)'
  },
  {
    id: 'midnight_blue',
    name: 'Midnight Blue',
    finish: 'Metallic Pearl Indigo',
    hex: '#142c4b',
    accent: '#00b4d8',
    filter: 'sepia(0.8) hue-rotate(190deg) saturate(2.4) brightness(0.92)'
  },
  {
    id: 'frozen_white',
    name: 'Frozen White',
    finish: 'Satin Matte Velvet',
    hex: '#e2e7ec',
    accent: '#ffffff',
    filter: 'brightness(1.55) contrast(0.94) saturate(0.25)'
  }
];

export const EXPERIENCE_THEMES = [
  {
    id: 'carbon_night',
    name: 'Carbon Night',
    bg: '#050505',
    textColor: '#ffffff',
    uiMuted: '#6e7681',
    accent: '#e5b80b',
    mood: 'Flagship Launch'
  },
  {
    id: 'titanium_studio',
    name: 'Titanium Studio',
    bg: '#12151a',
    textColor: '#f0f4f8',
    uiMuted: '#798899',
    accent: '#5bc0be',
    mood: 'Engineering Laboratory'
  },
  {
    id: 'rosso_track',
    name: 'Rosso Track',
    bg: '#130809',
    textColor: '#ffffff',
    uiMuted: '#875b5f',
    accent: '#ff2442',
    mood: 'Track-Focused'
  },
  {
    id: 'midnight_blue',
    name: 'Midnight Blue',
    bg: '#070e1a',
    textColor: '#f0f6ff',
    uiMuted: '#58739a',
    accent: '#00d2ff',
    mood: 'Night Driving'
  },
  {
    id: 'light_atelier',
    name: 'Light Atelier',
    bg: '#e8ecf1',
    textColor: '#121418',
    uiMuted: '#67717d',
    accent: '#9e7d3b',
    mood: 'Design Studio'
  }
];

export const WHEEL_OPTIONS = [
  {
    id: 'forged',
    name: 'Performance Forged',
    type: 'Monoblock Forged Aluminum',
    spec: '20" F / 21" R Staggered',
    weight: '8.4 kg per corner'
  },
  {
    id: 'aero',
    name: 'Aero Multi-Spoke',
    type: 'Carbon-Insert Hybrid Flow-Form',
    spec: '20" F / 21" R Staggered',
    weight: '8.9 kg per corner'
  },
  {
    id: 'track',
    name: 'Track Lightweight',
    type: 'Billet Magnesium Alloy',
    spec: '19" F / 20" R Competition Spec',
    weight: '7.1 kg per corner'
  }
];

export const WHEEL_FINISHES = [
  { id: 'black', name: 'Gloss Black', hex: '#161719' },
  { id: 'graphite', name: 'Satin Graphite', hex: '#3e4349' },
  { id: 'silver', name: 'Machined Silver', hex: '#b0b8c2' }
];

export const BRAKE_CALIPERS = [
  { id: 'yellow', name: 'Racing Yellow', hex: '#f0c808', default: true },
  { id: 'red', name: 'Performance Red', hex: '#d90429' },
  { id: 'blue', name: 'Electric Blue', hex: '#0077b6' },
  { id: 'black', name: 'Shadow Black', hex: '#1c1e21' }
];

export const INTERIOR_TRIMS = [
  { id: 'carbon', name: 'Twill Carbon Fiber', finish: 'Matte Open-Pore', hex: '#222325' },
  { id: 'leather', name: 'Black Nappa Leather', finish: 'Precision Perforated', hex: '#18191b' },
  { id: 'alcantara', name: 'Suede Alcantara', finish: 'Grip Suede Competition', hex: '#2b2c30' },
  { id: 'aluminum', name: 'Billet Aluminum', finish: 'Brushed Micro-Texture', hex: '#8a929a' }
];

export const AMBIENT_LIGHTING = [
  { id: 'amber', name: 'Amber Glow', hex: '#ff9e00', default: true },
  { id: 'ice_blue', name: 'Ice Blue', hex: '#48cae4' },
  { id: 'red', name: 'Track Crimson', hex: '#e63946' },
  { id: 'white', name: 'Pure Lumen', hex: '#f8f9fa' },
  { id: 'violet', name: 'Electric Violet', hex: '#9d4edd' }
];

export const DRIVE_MODES = [
  {
    id: 'road',
    name: 'ROAD',
    label: 'Refined Gran Turismo',
    rpmLimit: 6800,
    accent: '#ffffff',
    soundPitch: 1.0,
    desc: 'Calm adaptive damping, refined acoustic suppression, effortless daily precision.'
  },
  {
    id: 'sport',
    name: 'SPORT',
    label: 'Dynamic Engagement',
    rpmLimit: 7400,
    accent: '#f5c518',
    soundPitch: 1.25,
    desc: 'Sharper throttle mapping, active exhaust flaps 50% open, increased steering resistance.'
  },
  {
    id: 'track',
    name: 'TRACK',
    label: 'Pure Telemetry',
    rpmLimit: 7800,
    accent: '#ff2442',
    soundPitch: 1.5,
    desc: 'Exhaust bypass fully open, traction slip allowance elevated, telemetry logging active.'
  }
];

export const LIGHTING_MODES = [
  { id: 'daylight', name: 'DAYLIGHT', icon: 'sun' },
  { id: 'night', name: 'NIGHT', icon: 'moon' },
  { id: 'welcome', name: 'WELCOME', icon: 'sparkles' },
  { id: 'hazard', name: 'HAZARD', icon: 'alert-triangle' }
];
