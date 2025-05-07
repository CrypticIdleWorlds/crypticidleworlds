// === unifiedSaveManager.js ===

// Structure of gameState
const defaultGameState = {
    playerSkills: {
        attack: { xp: 0, level: 1 },
        strength: { xp: 0, level: 1 },
        defense: { xp: 0, level: 1 },
        magic: { xp: 0, level: 1 },
        ranged: { xp: 0, level: 1 },
        slayer: { xp: 0, level: 1 },
        cryptomining: { xp: 0, level: 1 },
        datafishing: { xp: 0, level: 1 },
        codecraft: { xp: 0, level: 1 },
        forgentics: { xp: 0, level: 1 },
        systemHacking: { xp: 0, level: 1 }
    },
    playerInventory: {},
    playerEquipment: {},
    playerGold: 0,
    lastSave: Date.now()
};

// Load game state from localStorage
function loadGameState() {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved) : { ...defaultGameState };
}

// Save game state to localStorage
function saveGameState(state) {
    state.lastSave = Date.now();
    localStorage.setItem("gameState", JSON.stringify(state));
}

// Helper: Get specific part
function getPlayerStat(stat) {
    const state = loadGameState();
    return state.playerSkills[stat];
}

// Helper: Update specific stat
function updatePlayerStat(stat, data) {
    const state = loadGameState();
    state.playerSkills[stat] = data;
    saveGameState(state);
}

// Helper: Get inventory
function getInventory() {
    const state = loadGameState();
    return state.playerInventory;
}

// Helper: Update inventory
function updateInventory(newInventory) {
    const state = loadGameState();
    state.playerInventory = newInventory;
    saveGameState(state);
}

// Expose globally
window.loadGameState = loadGameState;
window.saveGameState = saveGameState;
window.getPlayerStat = getPlayerStat;
window.updatePlayerStat = updatePlayerStat;
window.getInventory = getInventory;
window.updateInventory = updateInventory;

console.log("✅ Unified Save Manager Loaded");
