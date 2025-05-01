// /js/items.js

let itemsData = {};
let playerEquipment = {
  head: null,
  body: null,
  legs: null,
  hands: null,
  feet: null,
  cape: null,
  ring: null,
  neck: null,
  aura: null,
  weapon: null
};

// Load items.json and cache it
async function loadItemsData() {
  const res = await fetch('data/items.json');
  itemsData = await res.json();

  // Try to load equipped gear from localStorage
  const saved = localStorage.getItem('playerEquipment');
  if (saved) {
    playerEquipment = JSON.parse(saved);
  }
}

// Get item data by ID
function getItem(itemId) {
  return itemsData[itemId] || null;
}

// Equip an item
function equipItem(itemId) {
  const item = getItem(itemId);
  if (!item) {
    console.error('Item not found:', itemId);
    return;
  }

  const slot = item.slot;
  if (!playerEquipment.hasOwnProperty(slot)) {
    console.error('Invalid slot:', slot);
    return;
  }

  playerEquipment[slot] = itemId;
  saveEquippedGear();
}

// Unequip an item
function unequipItem(slot) {
  if (playerEquipment.hasOwnProperty(slot)) {
    playerEquipment[slot] = null;
    saveEquippedGear();
  }
}

// Save equipped gear to localStorage
function saveEquippedGear() {
  localStorage.setItem('playerEquipment', JSON.stringify(playerEquipment));
}

// Get total stats from all equipped gear
function getEquippedStats() {
  const total = {
    attack: 0,
    defense: 0,
    magic: 0,
    ranged: 0,
    strength: 0
  };

  for (const slot in playerEquipment) {
    const itemId = playerEquipment[slot];
    if (itemId) {
      const item = getItem(itemId);
      if (item && item.stats) {
        total.attack += item.stats.attack || 0;
        total.defense += item.stats.defense || 0;
        total.magic += item.stats.magic || 0;
        total.ranged += item.stats.ranged || 0;
        total.strength += item.stats.strength || 0;
      }
    }
  }

  return total;
}

// Call this on page load for any page using items.js
loadItemsData();
