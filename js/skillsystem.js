// skillsSystem.js

// Define your non-combat skills
const skills = {
    slayer: { xp: 0, level: 1, active: false },
    cryptomining: { xp: 0, level: 1, active: false },
    datafishing: { xp: 0, level: 1, active: false },
    codecraft: { xp: 0, level: 1, active: false },
    forgentics: { xp: 0, level: 1, active: false },
    systemHacking: { xp: 0, level: 1, active: false },
};

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

// Start training a skill
function startSkill(skill) {
    if (!skills[skill] || skills[skill].active) return;
    skills[skill].active = true;
    logSkillEvent(`${capitalize(skill)} training started.`);
    trainSkill(skill);
}

// Stop training a skill
function stopSkill(skill) {
    if (!skills[skill]) return;
    skills[skill].active = false;
    logSkillEvent(`${capitalize(skill)} training stopped.`);
}

// Core training loop
function trainSkill(skill) {
    if (!skills[skill].active) return;
    const cfg = skillConfigs[skill];
    if (!cfg) return;

    setTimeout(() => {
        if (!skills[skill].active) return;

        // Award XP and item
        skills[skill].xp += cfg.xpPerAction;
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

    tracker.innerHTML = Object.keys(skills).map(skill => {
        const s = skills[skill];
        const percent = getXpPercent(s.xp, s.level);
        return `
            <div class="skill-entry ${s.active ? 'active-skill' : ''}">
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

// Calculate XP percent (basic placeholder logic)
function getXpPercent(xp, level) {
    const nextLevelXp = (level + 1) * 100; // Example curve
    const currentLevelXp = level * 100;
    return Math.min(100, ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100).toFixed(1);
}

document.addEventListener('DOMContentLoaded', () => {
    updateGlobalSkillUI();
});
