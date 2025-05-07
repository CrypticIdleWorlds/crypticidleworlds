// offlineProgress.js (updated for unifiedSaveManager)

import unifiedSaveManager from './unifiedSaveManager.js';
import playerData from './playerData.js';
import uiUpdater from './uiUpdater.js';

const OFFLINE_XP_PER_SECOND = 2;
const OFFLINE_LOOT_TABLE = [
    { name: 'Gold Coins', perSecond: 1 },
    { name: 'Ashfang Scale', perSecond: 0.01 }
];

function saveLastActiveTime() {
    localStorage.setItem('lastActiveTime', Date.now());
}

function getOfflineProgress() {
    const lastActive = localStorage.getItem('lastActiveTime');
    if (!lastActive) return null;

    const msAway = Date.now() - parseInt(lastActive);
    const secondsAway = Math.floor(msAway / 1000);
    if (secondsAway < 10) return null;

    const totalXpGained = secondsAway * OFFLINE_XP_PER_SECOND;

    const lootGained = OFFLINE_LOOT_TABLE.map(item => {
        const qty = Math.floor(secondsAway * item.perSecond);
        return qty > 0 ? { name: item.name, amount: qty } : null;
    }).filter(Boolean);

    return {
        secondsAway,
        totalXpGained,
        lootGained
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

    setTimeout(() => container.remove(), 10000);
}

document.addEventListener('DOMContentLoaded', () => {
    const progress = getOfflineProgress();
    if (progress) {
        const combatSkills = ['attack', 'strength', 'defense', 'magic', 'ranged'];
        const xpPerSkill = Math.floor(progress.totalXpGained / combatSkills.length);

        combatSkills.forEach(skill => {
            if (playerData.skills[skill]) {
                playerData.skills[skill].xp += xpPerSkill;
            }
        });

        progress.lootGained.forEach(item => {
            if (!playerData.inventory.items[item.name]) {
                playerData.inventory.items[item.name] = 0;
            }
            playerData.inventory.items[item.name] += item.amount;
        });

        unifiedSaveManager.save();
        uiUpdater.updateAll();
        showOfflineProgressSummary(progress);
    }
});

window.addEventListener('beforeunload', saveLastActiveTime);
