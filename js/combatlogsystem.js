// combatLogSystem.js

import playerData from './playerData.js';
import saveManager from './saveManager.js';
import uiUpdater from './uiUpdater.js';

const combatLog = [];

// Log a combat event
function logCombatEvent(message) {
    const timestamp = new Date().toLocaleTimeString();
    const entry = `[${timestamp}] ${message}`;
    combatLog.push(entry);

    // Keep log capped to last 50 entries
    if (combatLog.length > 50) combatLog.shift();

    updateCombatLogUI();
}

// Update the combat log UI
function updateCombatLogUI() {
    const logContainer = document.getElementById('combat-log');
    if (!logContainer) return;

    logContainer.innerHTML = combatLog.map(line => `<div class="log-entry">${line}</div>`).join('');
    logContainer.scrollTop = logContainer.scrollHeight; // Auto-scroll to bottom
}

// Show battle summary popup
function showBattleSummary(data) {
    const lootList = data.loot.map(item => `${item.name} x${item.amount}`).join('<br>') || 'None';

    const summaryHTML = `
      <div id="battle-summary" style="background:#222;padding:20px;border-radius:10px;color:#fff;">
        <h3>Battle Summary</h3>
        <p>Total Damage Dealt: <strong>${data.damageDealt}</strong></p>
        <p>Total Damage Taken: <strong>${data.damageTaken}</strong></p>
        <p>XP Gained: <strong>${data.xpGained}</strong></p>
        <p><strong>Loot:</strong><br>${lootList}</p>
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

// Example combat hooks
function playerAttack(target, damage) {
    logCombatEvent(`You hit ${target} for ${damage} damage.`);
}

function enemyAttack(enemy, damage) {
    logCombatEvent(`${enemy} hit you for ${damage} damage.`);
}

function lootDrop(loot) {
    loot.forEach(item => {
        logCombatEvent(`Looted: ${item.name} x${item.amount}`);

        // OPTIONAL: Add loot to player inventory
        if (playerData.inventory.items[item.id]) {
            playerData.inventory.items[item.id] += item.amount;
        } else {
            playerData.inventory.items[item.id] = item.amount;
        }
    });

    saveManager.save();
    uiUpdater.updateInventory();
}

// Example: after battle ends
function onBattleEnd(summaryData) {
    showBattleSummary(summaryData);
    saveManager.save();
    uiUpdater.updateAll();
}

export {
    logCombatEvent,
    updateCombatLogUI,
    showBattleSummary,
    playerAttack,
    enemyAttack,
    lootDrop,
    onBattleEnd
};
