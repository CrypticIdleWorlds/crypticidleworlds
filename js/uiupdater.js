// uiUpdater.js

import playerData from './playerData.js';

const uiUpdater = {
    updateSkills() {
        for (const skill in playerData.skills) {
            const skillElement = document.getElementById(`${skill}-info`);
            if (skillElement) {
                const { level, xp } = playerData.skills[skill];
                skillElement.textContent = `Level ${level} | XP: ${xp}`;
            }
        }
    },
    updateInventory() {
        const inventoryElement = document.getElementById('inventory-info');
        if (inventoryElement) {
            inventoryElement.textContent = `Gold: ${playerData.inventory.gold} | Items: ${playerData.inventory.items.length}`;
        }
    },
    updateAll() {
        this.updateSkills();
        this.updateInventory();
        // Add more update functions here as needed
    }
};

export default uiUpdater;
