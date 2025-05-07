// progressManager.js

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

  let playerData = {};

  function load() {
    const saved = JSON.parse(localStorage.getItem('playerData'));
    playerData = saved ? saved : structuredClone(defaultData);
    console.log('[LOAD] Player data loaded.');
  }

  function save() {
    playerData.lastSave = Date.now();
    localStorage.setItem('playerData', JSON.stringify(playerData));
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
      load(); // Refresh from localStorage
      renderFunction(playerData); // Custom render hook per page
      const el = document.getElementById('last-save-time');
      if (el) el.innerText = `Time since last save: ${getElapsedSinceLastSave()}s`;
    }, 1000);
  }

  return {
    load,
    save,
    addXP,
    addItem,
    startAutoSave,
    syncUI,
    getData: () => playerData // direct read access if needed
  };
})();
