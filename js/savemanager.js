// saveManager.js

import playerData from './playerData.js';

const saveKey = 'crypticIdleSave';

const saveManager = {
    save() {
        try {
            localStorage.setItem(saveKey, JSON.stringify(playerData));
            playerData.lastSave = Date.now();
            console.log('[SaveManager] Game saved locally.');
        } catch (error) {
            console.error('[SaveManager] Save failed:', error);
        }
    },

    load() {
        const saved = localStorage.getItem(saveKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                Object.assign(playerData, parsed);
                console.log('[SaveManager] Save loaded from localStorage.');
            } catch (error) {
                console.error('[SaveManager] Load failed:', error);
            }
        } else {
            console.log('[SaveManager] No local save found.');
        }
    },

    downloadSave() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(playerData));
        const anchor = document.createElement('a');
        anchor.setAttribute("href", dataStr);
        anchor.setAttribute("download", "cryptic_idle_save.json");
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    },

    importSave(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                Object.assign(playerData, data);
                saveManager.save();
                window.location.reload();
            } catch (error) {
                console.error('[SaveManager] Import failed:', error);
            }
        };
        reader.readAsText(file);
    }
};

export default saveManager;
