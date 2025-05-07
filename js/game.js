// game.js (updated for unifiedSaveManager)

import unifiedSaveManager from './unifiedSaveManager.js';
import uiUpdater from './uiUpdater.js';
import playerData from './playerData.js';

let xpTable = [];
let combatStyles = {};

async function loadGameData() {
    const xpRes = await fetch('/data/xp_table.json');
    const xpData = await xpRes.json();
    xpTable = xpData.levels;

    const combatRes = await fetch('/data/combat.json');
    const combatData = await combatRes.json();
    combatStyles = combatData.combat_styles;

    console.log('✅ Game data loaded:', { xpTable, combatStyles, playerData });
}

function addXP(skillName, amount) {
    if (!playerData.skills[skillName]) {
        console.error(`Skill ${skillName} does not exist.`);
        return;
    }
    playerData.skills[skillName].xp += amount;
    const newLevel = getLevelFromXP(playerData.skills[skillName].xp);
    if (newLevel > playerData.skills[skillName].level) {
        playerData.skills[skillName].level = newLevel;
        showLevelUp(skillName, newLevel);
    }
    uiUpdater.updateSkills();
    unifiedSaveManager.save();
}

function getLevelFromXP(xp) {
    let level = 1;
    for (let i = xpTable.length - 1; i >= 0; i--) {
        if (xp >= xpTable[i].xp) {
            level = xpTable[i].level;
            break;
        }
    }
    return level;
}

function showLevelUp(skillName, newLevel) {
    alert(`🎉 Level up! ${skillName} is now level ${newLevel}!`);
}

// Expose to global so combat + skill systems can use it
window.addXP = addXP;
window.getLevelFromXP = getLevelFromXP;
window.saveGameData = unifiedSaveManager.save;

// Run on load
document.addEventListener('DOMContentLoaded', async () => {
    await loadGameData();
});
