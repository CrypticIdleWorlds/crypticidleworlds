// playerData.js

const playerData = {
    skills: {
        attack: { xp: 0, level: 1 },
        strength: { xp: 0, level: 1 },
        defense: { xp: 0, level: 1 },
        magic: { xp: 0, level: 1 },
        ranged: { xp: 0, level: 1 },
        // Add any additional skills here
    },
    inventory: {
        items: [],
        gold: 0
    },
    equipment: {
        weapon: null,
        armor: null,
        accessories: []
    },
    settings: {
        sound: true,
        notifications: true
    },
    lastSave: Date.now()
};

export default playerData;
