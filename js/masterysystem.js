// masterySystem.js (updated for unifiedSaveManager)

import unifiedSaveManager from './unifiedSaveManager.js';
import uiUpdater from './uiUpdater.js';
import playerData from './playerData.js';

const MASTERY_XP_MULTIPLIER = 0.1;

if (!playerData.mastery) {
    playerData.mastery = {
        woodcutting: { xp: 0, level: 1 },
        mining: { xp: 0, level: 1 },
        combat: { xp: 0, level: 1 }
        // Add other skills here
    };
}

function getMasteryLevel(xp) {
    if (xp >= 13034431) return 99;
    if (xp >= 61512) return 50;
    if (xp >= 27331) return 40;
    if (xp >= 13363) return 30;
    if (xp >= 7424) return 20;
    if (xp >= 4116) return 15;
    if (xp >= 1333) return 10;
    if (xp >= 83) return 5;
    return 1;
}

function addMasteryXp(skill, amount) {
    if (!playerData.mastery[skill]) return;

    playerData.mastery[skill].xp += amount;
    const newLevel = getMasteryLevel(playerData.mastery[skill].xp);

    if (newLevel > playerData.mastery[skill].level) {
        playerData.mastery[skill].level = newLevel;
        alert(`Mastery Level Up! ${skill} reached Mastery Level ${newLevel}`);

        // OPTIONAL: Apply perk or bonus here
    }

    updateMasteryUI(skill);
    unifiedSaveManager.save();
}

function gainSkillXp(skill, baseXp) {
    if (playerData.skills[skill]) {
        playerData.skills[skill].xp += baseXp;
    }

    const masteryXp = baseXp * MASTERY_XP_MULTIPLIER;
    addMasteryXp(skill, masteryXp);
    uiUpdater.updateSkills();
}

function updateMasteryUI(skill) {
    const masteryBar = document.getElementById(`${skill}-mastery-bar`);
    if (masteryBar) {
        const level = playerData.mastery[skill].level;
        const xp = playerData.mastery[skill].xp;
        masteryBar.textContent = `Mastery Lvl ${level} (${xp} XP)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    for (const skill in playerData.mastery) {
        updateMasteryUI(skill);
    }
});

export { addMasteryXp, gainSkillXp, updateMasteryUI };
