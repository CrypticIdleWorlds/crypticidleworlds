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
    forgenetics: {  // ✅ fixed name typo here
        actionTime: 8,
        itemGained: 'Forged Keycard',
        xpPerAction: 30,
    },
    system_hacking: {
        actionTime: 10,
        itemGained: 'Exploit Kit',
        xpPerAction: 35,
    },
    slayer: {
        actionTime: 0, // tied to combat tasks
        xpPerAction: 50, // reward per task
    }
};

// Active skill trackers
const activeSkills = {};

// Load or initialize playerSkills from localStorage
let playerSkills = JSON.parse(localStorage.getItem('skillData')) || {};
Object.keys(skillConfigs).forEach(skill => {
    if (!playerSkills[skill]) {
        playerSkills[skill] = { xp: 0, level: 1 };
    }
});

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

// Add XP + handle level-ups
function addXP(skill, amount) {
    const s = playerSkills[skill];
    s.xp += amount;

    for (let i = s.level; i < xpTable.length; i++) {
        if (s.xp >= xpTable[i]) {
            s.level = i + 1;
        }
    }

    // ✅ Save immediately so other pages see the change
    localStorage.setItem('skillData', JSON.stringify(playerSkills));
}

// Logging
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

// Capitalize utility
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ');
}

// Calculate XP percent based on xpTable
function getXpPercent(xp, level) {
    const currentLevelXP = xpTable[level - 1] || 0;
    const nextLevelXP = xpTable[level] || currentLevelXP + 100;
    const percent = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.min(100, Math.max(0, percent)).toFixed(1);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateGlobalSkillUI();
});
