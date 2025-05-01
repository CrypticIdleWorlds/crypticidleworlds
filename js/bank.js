// /js/bank.js

let bankInventory = {};

// Load bank from localStorage
function loadBank() {
  const saved = localStorage.getItem('bankInventory');
  if (saved) {
    bankInventory = JSON.parse(saved);
  }
}

// Save bank to localStorage
function saveBank() {
  localStorage.setItem('bankInventory', JSON.stringify(bankInventory));
}

// Add item to the bank
function addItemToBank(itemId, quantity = 1) {
  if (bankInventory[itemId]) {
    bankInventory[itemId] += quantity; // Unlimited stack ✅
  } else {
    bankInventory[itemId] = quantity;
  }
  saveBank();
}

// Remove item from the bank
function removeItemFromBank(itemId, quantity = 1) {
  if (!bankInventory[itemId]) return;

  bankInventory[itemId] -= quantity;
  if (bankInventory[itemId] <= 0) {
    delete bankInventory[itemId];
  }
  saveBank();
}

// Get total number of a specific item
function getBankItemCount(itemId) {
  return bankInventory[itemId] || 0;
}

// Get all bank items
function getAllBankItems() {
  return bankInventory;
}

// Initialize bank on page load
loadBank();
