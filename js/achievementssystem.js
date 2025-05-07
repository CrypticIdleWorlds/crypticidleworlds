// achievementsSystem.js (updated for unifiedSaveManager)

import playerData from './playerData.js';
import unifiedSaveManager from './unifiedSaveManager.js';
import uiUpdater from './uiUpdater.js';

// Define your achievements list inside playerData (if not already)
if (!playerData.achievements) {
    playerData.achievements = [
        { id: 'chop_1000_logs', name: 'Lumberjack', desc: 'Chop 1000 logs', completed: false },
        { id: 'kill_500_mobs', name: 'Beast Slayer', desc: 'Defeat 500 monsters', completed: false },
        { id: 'earn_1m_gold', name: 'Gold Digger', desc: 'Earn 1,000,000 gold', completed: false },
        { id: 'reach_lvl_50_combat', name: 'Warlord', desc: 'Reach level 50 Combat', completed: false }
        // Add more achievements here
    ];
}

// Function to check all achievements
function checkAchievements() {
    playerData.achievements.forEach(ach => {
        if (ach.completed) return;

        switch (ach.id) {
            case 'chop_1000_logs':
                if (playerData.stats?.logsChopped >= 1000) unlockAchievement(ach);
                break;
            case 'kill_500_mobs':
                if (playerData.stats?.mobsKilled >= 500) unlockAchievement(ach);
                break;
            case 'earn_1m_gold':
                if (playerData.inventory.gold >= 1000000) unlockAchievement(ach);
                break;
            case 'reach_lvl_50_combat':
                if (playerData.skills.combat.level >= 50) unlockAchievement(ach);
                break;
            // Add more cases here
        }
    });
}

// Unlock function
function unlockAchievement(ach) {
    ach.completed = true;
    alert(`Achievement Unlocked: ${ach.name}! - ${ach.desc}`);

    // OPTIONAL: Add reward logic here
    // Example: playerData.inventory.gold += 10000;

    unifiedSaveManager.save();
    updateAchievementsUI();
}

// Update achievements UI
function updateAchievementsUI() {
    const container = document.getElementById('achievements-list');
    if (!container) return;

    container.innerHTML = playerData.achievements.map(ach => `
        <div class="achievement ${ach.completed ? 'completed' : ''}">
            <h4>${ach.name}</h4>
            <p>${ach.desc}</p>
            <p>Status: ${ach.completed ? '✅ Completed' : '❌ In Progress'}</p>
        </div>
    `).join('');
}

// Hook into page load to render achievements
document.addEventListener('DOMContentLoaded', () => {
    updateAchievementsUI();
});

export { checkAchievements, updateAchievementsUI };
