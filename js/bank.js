// bank.js

import playerData from './playerData.js';
import saveManager from './saveManager.js';
import uiUpdater from './uiUpdater.js';

// Initialize bank if not present
if (!playerData.inventory.items) {
    playerData.inventory.items = {};
}

// Add item to the bank (default quantity = 1)
function addItemToBank(itemId, quantity = 1) {
    if (!itemId) {
        console.warn('addItemToBank: itemId is missing');
        return;
    }
    if (playerData.inventory.items[itemId]) {
        playerData.inventory.items[itemId] += quantity; // Unlimited stack
    } else {
        playerData.inventory.items[itemId] = quantity;
    }
    saveManager.save();
    uiUpdater.updateInventory();
}

// Remove item from the bank (default quantity = 1)
function removeItemFromBank(itemId, quantity = 1) {
    if (!playerData.inventory.items[itemId]) return;

    playerData.inventory.items[itemId] -= quantity;
    if (playerData.inventory.items[itemId] <= 0) {
        delete playerData.inventory.items[itemId];
    }
    saveManager.save();
    uiUpdater.updateInventory();
}

// Get total number of a specific item
function getBankItemCount(itemId) {
    return playerData.inventory.items[itemId] || 0;
}

// Get all bank items
function getAllBankItems() {
    return playerData.inventory.items;
}

// Exports
export {
    addItemToBank,
    removeItemFromBank,
    getBankItemCount,
    getAllBankItems
};
