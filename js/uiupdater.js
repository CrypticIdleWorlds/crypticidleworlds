// ✅ Updated uiUpdater.js
// This version pulls from the unified save system (unifiedSaveManager.js)

import { loadGameState, updatePlayerStat, getInventory, getEquipment } from './unifiedSaveManager.js';

const uiUpdater = {
    updateSkills() {
        const gameState = loadGameState();
        for (const skill in gameState.skills) {
            const skillObj = gameState.skills[skill];
            const skillElement = document.getElementById(`${skill}-info`);
            if (skillElement) {
                skillElement.textContent = `Level ${skillObj.level} | XP: ${skillObj.xp}`;
            }
        }
    },

    updateInventory() {
        const inventory = getInventory();
        const inventoryElement = document.getElementById('inventory-info');
        if (inventoryElement) {
            inventoryElement.textContent = `Gold: ${inventory.gold} | Items: ${inventory.items.length}`;
        }
    },

    updateEquipment() {
        const equipment = getEquipment();
        const equipmentElement = document.getElementById('equipment-info');
        if (equipmentElement) {
            const weapon = equipment.weapon || 'None';
            const armor = equipment.armor || 'None';
            equipmentElement.textContent = `Weapon: ${weapon} | Armor: ${armor}`;
        }
    },

    updateAll() {
        this.updateSkills();
        this.updateInventory();
        this.updateEquipment();
    }
};

export default uiUpdater;
