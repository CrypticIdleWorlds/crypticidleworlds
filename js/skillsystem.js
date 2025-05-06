// skillsSystem.js

// Skill mechanics configuration (creative + unique)
const skillConfigs = {
    cryptomining: {
        actionTime: 5, // seconds per mining attempt
        itemGained: 'Crypto Coin',
        xpPerAction: 20,
    },
    datafishing: {
        actionTime: 4,
        itemGained: 'Data Packet',
        xpPerAction: 15,
    },
    codecraft: {
        actionTime: 6,
        itemGained: 'Script Module',
        xpPerAction: 25,
    },
    forgentics: {
        actionTime: 8,
        itemGained: 'Forged Keycard',
        xpPerAction: 30,
    },
    systemHacking: {
        actionTime: 10,
        itemGained: 'Exploit Kit',
        xpPerAction: 35,
    },
    slayer: {
        actionTime: 0, // tied to combat tasks
        xpPerAction: 50, // reward per task
    }
};

// Track active skills (instead of a full local skills object)
const activeSkills = {};

// Start training a skill
function startSkill(skill) {
    if (!playerSkills[skill] || activeSkills[skill]) return;
    activeSkills[skill] = true;
    logSkillEvent(`${capitalize(skill)} training started.`);
    trainSkill(skill);
}

// Stop training a skill
function stopSkill(skill) {
    if (!playerSkills[skill]) return;
    activeSkills[skill] = false;
    logSkillEvent(`${capitalize(skill)} training stopped.`);
}

// Core training loop
function trainSkill(skill) {
    if (!activeSkills[skill]) return;
    const cfg = skillConfigs[skill];
    if (!cfg) return;

    setTimeout(() => {
        if (!activeSkills[skill]) return;

        // ✅ Award XP globally
        addXP(skill, cfg.xpPerAction);

        // Award item to inventory
        if (window.playerInventory) {
            if (!playerInventory[cfg.itemGained]) playerInventory[cfg.itemGained] = 0;
            playerInventory[cfg.itemGained]++;
        }

        logSkillEvent(`+${cfg.xpPerAction} XP & Gained 1 ${cfg.itemGained}`);
        updateGlobalSkillUI();

        // Loop again
        trainSkill(skill);
    }, cfg.actionTime * 1000);
}

// Logging skill events
function logSkillEvent(message) {
    console.log(`[Skill Log] ${message}`);
}

// Update global skill tracker UI
function updateGlobalSkillUI() {
    const tracker = document.getElementById('global-skill-tracker');
    if (!tracker) return;

    tracker.innerHTML = Object.keys(skillConfigs).map(skill => {
        const s = playerSkills[skill];
        const percent = getXpPercent(s.xp, s.level);
        return `
            <div class="skill-entry ${activeSkills[skill] ? 'active-skill' : ''}">
                <strong>${capitalize(skill)}</strong>: Level ${s.level} - ${percent}% to next level
                <div class="xp-bar"><div style="width:${percent}%"></div></div>
            </div>
        `;
    }).join('');
}

// Utility to capitalize skill names
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// ✅ Real XP percent based on XP table
function getXpPercent(xp, level) {
    if (!window.xpTable || xpTable.length === 0) return 0;
    const currentLevelXP = xpTable.find(x => x.level === level)?.xp || 0;
    const nextLevelXP = xpTable.find(x => x.level === level + 1)?.xp || currentLevelXP;
    const percent = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.min(100, Math.max(0, percent)).toFixed(1);
}

document.addEventListener('DOMContentLoaded', () => {
    updateGlobalSkillUI();
});
