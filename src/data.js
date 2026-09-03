import { addDaysISO } from './lib/date.js';

export const HOUSEHOLD = 'West End House';
export const CURRENT_USER = 'Kingsley';

// Each housemate gets a fixed colour, the way people put a coloured
// sticker or a name in marker on their food in a real shared fridge.
export const HOUSEMATES = [
  { name: 'Kingsley', color: '#1E6B3F' },
  { name: 'Alex', color: '#2D5BA8' },
  { name: 'Emma', color: '#6F3FA3' },
  { name: 'Mia', color: '#0F7C86' },
];

export const CATEGORIES = [
  { id: 'Dairy', emoji: '🥛' },
  { id: 'Meat', emoji: '🍗' },
  { id: 'Vegetables', emoji: '🥕' },
  { id: 'Fruit', emoji: '🍓' },
  { id: 'Bakery', emoji: '🍞' },
  { id: 'Drinks', emoji: '🧃' },
  { id: 'Leftovers', emoji: '🍱' },
  { id: 'Condiments', emoji: '🫙' },
  { id: 'Other', emoji: '📦' },
];

export const STORAGE_LOCATIONS = [
  'Top shelf',
  'Middle shelf',
  'Bottom shelf',
  'Door',
  'Crisper drawer',
  'Freezer',
];

export function housemateColor(name) {
  return HOUSEMATES.find((h) => h.name === name)?.color ?? '#556670';
}

export function categoryEmoji(id) {
  return CATEGORIES.find((c) => c.id === id)?.emoji ?? '📦';
}

// Demo items are dated relative to the day they are (re)seeded, so the
// urgency labels always read as designed for the evaluation tasks:
// Chicken Breast = Use today, Milk = 2 days, Carrots = 5 days, Yoghurt = 7 days.
export function seedItems() {
  return [
    { id: 'seed-chicken', name: 'Chicken Breast', category: 'Meat', owner: 'Alex', shared: true, expiry: addDaysISO(0), storage: 'Top shelf' },
    { id: 'seed-milk', name: 'Milk', category: 'Dairy', owner: 'Emma', shared: false, expiry: addDaysISO(2), storage: 'Door' },
    { id: 'seed-carrots', name: 'Carrots', category: 'Vegetables', owner: 'Kingsley', shared: true, expiry: addDaysISO(5), storage: 'Crisper drawer' },
    { id: 'seed-yoghurt', name: 'Greek Yoghurt', category: 'Dairy', owner: 'Mia', shared: true, expiry: addDaysISO(7), storage: 'Middle shelf' },
  ];
}
