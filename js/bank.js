// /js/bank.js

// Global bank inventory object
window.bankInventory = {};

// Load bank from localStorage
function loadBank() {
  const saved = localStorage.getItem('bankInventory');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (typeof parsed === 'object' && parsed !== null) {
        window.bankInventory = parsed;
      } else {
        console.warn('Invalid bankInventory data. Resetting.');
        window.bankInventory = {};
      }
    } catch (e) {
      console.error('Failed to parse bankInventory:', e);
      window.bankInventory = {};
    }
  } else {
    window.bankInventory = {};
  }
}

// Save bank to localStorage
function saveBank() {
  localStorage.setItem('bankInventory', JSON.stringify(window.bankInventory));
}

// Add item to the bank (default quantity = 1)
function addItemToBank(itemId, quantity = 1) {
  if (!itemId) {
    console.warn('addItemToBank: itemId is missing');
    return;
  }
  if (window.bankInventory[itemId]) {
    window.bankInventory[itemId] += quantity; // Unlimited stack
  } else {
    window.bankInventory[itemId] = quantity;
  }
  saveBank();
}

// Remove item from the bank (default quantity = 1)
function removeItemFromBank(itemId, quantity = 1) {
  if (!window.bankInventory[itemId]) return;

  window.bankInventory[itemId] -= quantity;
  if (window.bankInventory[itemId] <= 0) {
    delete window.bankInventory[itemId];
  }
  saveBank();
}

// Get total number of a specific item
function getBankItemCount(itemId) {
  return window.bankInventory[itemId] || 0;
}

// Get all bank items
function getAllBankItems() {
  return window.bankInventory;
}

// Initialize bank on page load
loadBank();
