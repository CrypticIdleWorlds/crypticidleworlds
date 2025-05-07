// playerData.js

const playerData = {
    skills: {
        attack: { xp: 0, level: 1 },
        strength: { xp: 0, level: 1 },
        defense: { xp: 0, level: 1 },
        magic: { xp: 0, level: 1 },
        ranged: { xp: 0, level: 1 },
        // Add additional skills here as needed, matching your game’s design
    },
    inventory: {
        items: [],    // Array of item IDs or names
        gold: 0
    },
    equipment: {
        weapon: null,        // Could store item IDs or full item objects
        armor: null,
        accessories: []
    },
    settings: {
        sound: true,
        notifications: true
    },
    achievements: {
        unlocked: []
    },
    lastSave: Date.now()
};

export default playerData;
