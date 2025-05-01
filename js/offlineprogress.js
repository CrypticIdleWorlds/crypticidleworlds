// offlineProgress.js

// CONFIG: Set your baseline XP gain rate and loot table per second here
const OFFLINE_XP_PER_SECOND = 2; // Example: 2 XP per second idle
const OFFLINE_LOOT_TABLE = [
  { name: 'Gold Coins', perSecond: 1 }, // 1 coin per second
  { name: 'Ashfang Scale', perSecond: 0.01 }, // 1 every ~100 sec
];

function saveLastActiveTime() {
    localStorage.setItem('lastActiveTime', Date.now());
}

function getOfflineProgress() {
    const lastActive = localStorage.getItem('lastActiveTime');
    if (!lastActive) return null;

    const msAway = Date.now() - parseInt(lastActive);
    const secondsAway = Math.floor(msAway / 1000);
    if (secondsAway < 10) return null; // Ignore super short times

    // XP calculation
    const totalXpGained = secondsAway * OFFLINE_XP_PER_SECOND;

    // Loot calculation
    const lootGained = OFFLINE_LOOT_TABLE.map(item => {
        const qty = Math.floor(secondsAway * item.perSecond);
        return qty > 0 ? { name: item.name, amount: qty } : null;
    }).filter(Boolean);

    return {
        secondsAway,
        totalXpGained,
        lootGained,
    };
}

function showOfflineProgressSummary(progress) {
    const minutes = Math.floor(progress.secondsAway / 60);
    const seconds = progress.secondsAway % 60;

    const lootList = progress.lootGained.map(item => `${item.name} x${item.amount}`).join('<br>');

    const summaryHTML = `
      <div id="offline-summary" style="background:#222;padding:20px;border-radius:10px;color:#fff;">
        <h3>Welcome Back!</h3>
        <p>You were away for <strong>${minutes}m ${seconds}s</strong>.</p>
        <p>You earned <strong>${progress.totalXpGained}</strong> XP while offline.</p>
        <p><strong>Loot Gained:</strong><br>${lootList || 'None'}</p>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = summaryHTML;
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = 9999;
    container.style.backgroundColor = '#333';

    document.body.appendChild(container);

    // Auto-remove after 10 seconds
    setTimeout(() => container.remove(), 10000);
}

// MAIN: Run on page load
document.addEventListener('DOMContentLoaded', () => {
    const progress = getOfflineProgress();
    if (progress) {
        // Apply XP
        if (window.playerSkills) {
            playerSkills.combat.xp += progress.totalXpGained;
        }

        // Apply loot
        if (window.playerInventory) {
            progress.lootGained.forEach(item => {
                if (!playerInventory[item.name]) {
                    playerInventory[item.name] = 0;
                }
                playerInventory[item.name] += item.amount;
            });
        }

        // Show popup
        showOfflineProgressSummary(progress);
    }
});

// Save on unload
window.addEventListener('beforeunload', saveLastActiveTime);
