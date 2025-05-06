// game.js

let xpTable = [];
let combatStyles = {};
let playerSkills = {}; // Full skills object (combat + non-combat)

async function loadGameData() {
    // Load XP table
    const xpRes = await fetch('/data/xp_table.json');
    const xpData = await xpRes.json();
    xpTable = xpData.levels;

    // Load combat styles
    const combatRes = await fetch('/data/combat.json');
    const combatData = await combatRes.json();
    combatStyles = combatData.combat_styles;

    // Init skills (combat + non-combat)
    playerSkills = JSON.parse(localStorage.getItem("playerSkills")) || {
        // Combat
        attack: { xp: 0, level: 1 },
        strength: { xp: 0, level: 1 },
        defense: { xp: 0, level: 1 },
        magic: { xp: 0, level: 1 },
        ranged: { xp: 0, level: 1 },
        // Non-combat
        slayer: { xp: 0, level: 1 },
        cryptomining: { xp: 0, level: 1 },
        datafishing: { xp: 0, level: 1 },
        codecraft: { xp: 0, level: 1 },
        forgentics: { xp: 0, level: 1 },
        systemHacking: { xp: 0, level: 1 }
    };

    console.log('✅ Game data loaded:', { xpTable, combatStyles, playerSkills });
}

// Add XP + check level
function addXP(skillName, amount) {
    if (!playerSkills[skillName]) {
        console.error(`Skill ${skillName} does not exist.`);
        return;
    }
    playerSkills[skillName].xp += amount;
    const newLevel = getLevelFromXP(playerSkills[skillName].xp);
    if (newLevel > playerSkills[skillName].level) {
        playerSkills[skillName].level = newLevel;
        showLevelUp(skillName, newLevel);
    }
    updateSkillUI(skillName);
    saveGameData();
}

// Get level from XP (RuneScape style)
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

// UI update placeholder
function updateSkillUI(skillName) {
    // Add your logic to update XP bar or skill UI here
    console.log(`🔄 Updated UI for ${skillName}: Lv.${playerSkills[skillName].level} (${playerSkills[skillName].xp} XP)`);
}

// Show level up message
function showLevelUp(skillName, newLevel) {
    alert(`🎉 Level up! ${skillName} is now level ${newLevel}!`);
}

// Save to localStorage
function saveGameData() {
    localStorage.setItem("playerSkills", JSON.stringify(playerSkills));
}

// Expose to global so combat + skill systems can use it
window.addXP = addXP;
window.getLevelFromXP = getLevelFromXP;
window.saveGameData = saveGameData;

// Run on load
document.addEventListener('DOMContentLoaded', async () => {
    await loadGameData();
});
