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
  try {
    const res = await fetch('data/items.json');
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    itemsData = await res.json();
    console.log('Items data loaded:', itemsData);
  } catch (err) {
    console.error('Failed to load items.json:', err);
    itemsData = {};
  }

  // Load equipped gear after items are ready
  const saved = localStorage.getItem('playerEquipment');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (typeof parsed === 'object') {
        playerEquipment = parsed;
        console.log('Loaded equipped gear:', playerEquipment);
      }
    } catch (e) {
      console.warn('Failed to parse playerEquipment:', e);
    }
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
  if (!slot) {
    console.error(`Item ${itemId} is missing a slot property.`);
    return;
  }
  if (!playerEquipment.hasOwnProperty(slot)) {
    console.error(`Invalid slot: ${slot} for item ${itemId}`);
    return;
  }

  playerEquipment[slot] = itemId;
  console.log(`Equipped ${item.name} (${itemId}) to ${slot}`);
  saveEquippedGear();
}

// Unequip an item
function unequipItem(slot) {
  if (playerEquipment.hasOwnProperty(slot)) {
    console.log(`Unequipped item from ${slot}`);
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

// Expose to window (optional but useful for debugging)
window.playerEquipment = playerEquipment;
window.getItem = getItem;
window.getEquippedStats = getEquippedStats;

// Call this on page load for any page using items.js
loadItemsData();
