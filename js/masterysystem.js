// masterySystem.js

// CONFIG: Define base mastery XP rate (e.g., 10% of main XP)
const MASTERY_XP_MULTIPLIER = 0.1;

// Example: Define mastery data structure for each skill
window.masteryData = {
    woodcutting: { xp: 0, level: 1 },
    mining: { xp: 0, level: 1 },
    combat: { xp: 0, level: 1 },
    // Add other skills here
};

// Level thresholds (basic example: you can make this more complex)
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
    if (!masteryData[skill]) return;

    masteryData[skill].xp += amount;
    const newLevel = getMasteryLevel(masteryData[skill].xp);

    if (newLevel > masteryData[skill].level) {
        masteryData[skill].level = newLevel;
        alert(`Mastery Level Up! ${skill} reached Mastery Level ${newLevel}`);

        // OPTIONAL: Apply perk here based on level
        // Example: if (newLevel === 25) grantPerk(skill, '+5% yield');
    }

    // Update mastery bar UI if exists
    updateMasteryUI(skill);
}

function gainSkillXp(skill, baseXp) {
    // Add main XP (you probably already have this)
    if (window.playerSkills && window.playerSkills[skill]) {
        playerSkills[skill].xp += baseXp;
    }

    // Add mastery XP
    const masteryXp = baseXp * MASTERY_XP_MULTIPLIER;
    addMasteryXp(skill, masteryXp);
}

function updateMasteryUI(skill) {
    const masteryBar = document.getElementById(`${skill}-mastery-bar`);
    if (masteryBar) {
        const level = masteryData[skill].level;
        const xp = masteryData[skill].xp;
        masteryBar.textContent = `Mastery Lvl ${level} (${xp} XP)`;
    }
}

// Initialize mastery bars on page load
document.addEventListener('DOMContentLoaded', () => {
    for (const skill in masteryData) {
        updateMasteryUI(skill);
    }
});
