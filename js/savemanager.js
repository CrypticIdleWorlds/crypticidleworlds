// saveManager.js (updated for unifiedSaveManager)

import unifiedSaveManager from './unifiedSaveManager.js';

const saveManager = {
    save() {
        unifiedSaveManager.save();
        console.log('[SaveManager] Game saved using unified manager.');
    },

    load() {
        unifiedSaveManager.load();
        console.log('[SaveManager] Game loaded using unified manager.');
    },

    downloadSave() {
        unifiedSaveManager.download();
        console.log('[SaveManager] Save downloaded using unified manager.');
    },

    importSave(file) {
        unifiedSaveManager.import(file);
        console.log('[SaveManager] Save imported using unified manager.');
    }
};

export default saveManager;
