// progressManager.js

import unifiedSaveManager from './unifiedSaveManager.js';

const progressManager = (() => {
  const defaultData = {
    skills: {
      attack: { xp: 0, level: 1 },
      strength: { xp: 0, level: 1 },
      defense: { xp: 0, level: 1 },
      magic: { xp: 0, level: 1 },
      ranged: { xp: 0, level: 1 },
      slayer: { xp: 0, level: 1 },
      cryptomining: { xp: 0, level: 1 },
      datafishing: { xp: 0, level: 1 },
      codecraft: { xp: 0, level: 1 },
      forgenetics: { xp: 0, level: 1 },
      system_hacking: { xp: 0, level: 1 }
    },
    bankInventory: {},
    playerEquipment: {},
    lastSave: Date.now()
  };

  const xpTable = Array(100).fill(0).map((_, lvl) => {
    let xp = 0;
    for (let i = 1; i < lvl; i++) xp += Math.floor(i + 300 * Math.pow(2, i / 7));
    return Math.floor(xp / 4);
  });

  let playerData = unifiedSaveManager.getPlayerData();

  function save() {
    playerData.lastSave = Date.now();
    unifiedSaveManager.savePlayerData(playerData);
    console.log('[SAVE] Player data saved.');
  }

  function addXP(skill, amount) {
    if (!playerData.skills[skill]) return;
    playerData.skills[skill].xp += amount;

    while (playerData.skills[skill].level < xpTable.length &&
           playerData.skills[skill].xp >= xpTable[playerData.skills[skill].level]) {
      playerData.skills[skill].level++;
      console.log(`[LEVEL UP] ${skill} reached level ${playerData.skills[skill].level}`);
    }

    save();
  }

  function addItem(item, qty = 1) {
    if (!playerData.bankInventory[item]) playerData.bankInventory[item] = 0;
    playerData.bankInventory[item] += qty;
    console.log(`[ITEM ADDED] ${qty}x ${item}`);
    save();
  }

  function startAutoSave(interval = 30000) {
    setInterval(() => {
      save();
      console.log('[AUTO SAVE] Player progress saved.');
    }, interval);
  }

  function getElapsedSinceLastSave() {
    return Math.floor((Date.now() - playerData.lastSave) / 1000);
  }

  function syncUI(renderFunction) {
    setInterval(() => {
      playerData = unifiedSaveManager.getPlayerData();
      renderFunction(playerData);
      const el = document.getElementById('last-save-time');
      if (el) el.innerText = `Time since last save: ${getElapsedSinceLastSave()}s`;
    }, 1000);
  }

  function getXpTable() {
    return xpTable;
  }

  function getSkillList() {
    return {
      attack: 'Striker Protocol',
      strength: 'Force Module',
      defense: 'Barrier Matrix',
      magic: 'Neurohex',
      ranged: 'Synapsis Bowline',
      slayer: 'Slayer',
      cryptomining: 'Cryptomining',
      datafishing: 'Datafishing',
      codecraft: 'Codecraft',
      forgenetics: 'Forgentics',
      system_hacking: 'System Hacking'
    };
  }

  function getSkillConfigs() {
    return {
      cryptomining: {
        actionTime: 5,
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
      forgenetics: {
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
        actionTime: 0,
        xpPerAction: 50,
      }
    };
  }

  return {
    save,
    addXP,
    addItem,
    startAutoSave,
    syncUI,
    getData: () => playerData,
    getXpTable,
    getSkillList,
    getSkillConfigs
  };
})();
