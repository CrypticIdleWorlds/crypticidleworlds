// achievementsSystem.js

// Define your achievements list
const achievements = [
    { id: 'chop_1000_logs', name: 'Lumberjack', desc: 'Chop 1000 logs', completed: false },
    { id: 'kill_500_mobs', name: 'Beast Slayer', desc: 'Defeat 500 monsters', completed: false },
    { id: 'earn_1m_gold', name: 'Gold Digger', desc: 'Earn 1,000,000 gold', completed: false },
    { id: 'reach_lvl_50_combat', name: 'Warlord', desc: 'Reach level 50 Combat', completed: false },
    // Add more achievements here
];

// Function to check all achievements
function checkAchievements() {
    achievements.forEach(ach => {
        if (ach.completed) return;

        switch (ach.id) {
            case 'chop_1000_logs':
                if (playerStats.logsChopped >= 1000) unlockAchievement(ach);
                break;
            case 'kill_500_mobs':
                if (playerStats.mobsKilled >= 500) unlockAchievement(ach);
                break;
            case 'earn_1m_gold':
                if (playerStats.goldEarned >= 1000000) unlockAchievement(ach);
                break;
            case 'reach_lvl_50_combat':
                if (playerSkills.combat.level >= 50) unlockAchievement(ach);
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
    // Example: playerInventory['Gold Coins'] += 10000;

    updateAchievementsUI();
}

// Update achievements UI
function updateAchievementsUI() {
    const container = document.getElementById('achievements-list');
    if (!container) return;

    container.innerHTML = achievements.map(ach => `
        <div class="achievement ${ach.completed ? 'completed' : ''}">
            <h4>${ach.name}</h4>
            <p>${ach.desc}</p>
            <p>Status: ${ach.completed ? '✅ Completed' : '❌ In Progress'}</p>
        </div>
    `).join('');
}

// Hook into XP gain and other events
document.addEventListener('DOMContentLoaded', () => {
    updateAchievementsUI();
});
