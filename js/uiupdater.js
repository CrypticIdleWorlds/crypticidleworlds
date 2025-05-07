// uiUpdater.js

import playerData from './playerData.js';

const uiUpdater = {
    updateSkills() {
        for (const skill in playerData.skills) {
            const skillObj = playerData.skills[skill];
            const skillElement = document.getElementById(`${skill}-info`);
            if (skillElement) {
                skillElement.textContent = `Level ${skillObj.level} | XP: ${skillObj.xp}`;
            }
        }
    },

    updateInventory() {
        const inventoryElement = document.getElementById('inventory-info');
        if (inventoryElement) {
            inventoryElement.textContent = `Gold: ${playerData.inventory.gold} | Items: ${playerData.inventory.items.length}`;
        }
    },

    updateEquipment() {
        const equipmentElement = document.getElementById('equipment-info');
        if (equipmentElement) {
            const weapon = playerData.equipment.weapon || 'None';
            const armor = playerData.equipment.armor || 'None';
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
