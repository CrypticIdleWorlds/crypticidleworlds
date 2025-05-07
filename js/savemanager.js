// saveManager.js

import playerData from './playerData.js';

const saveKey = 'crypticIdleSave';

const saveManager = {
    save() {
        localStorage.setItem(saveKey, JSON.stringify(playerData));
        console.log('Game saved to localStorage.');
    },
    load() {
        const savedData = localStorage.getItem(saveKey);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            Object.assign(playerData, parsedData);
            console.log('Game loaded from localStorage.');
        } else {
            console.log('No local save found. Starting fresh.');
        }
    },
    downloadSave() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(playerData));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', 'cryptic_idle_save.json');
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
    },
    importSave(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const importedData = JSON.parse(e.target.result);
            Object.assign(playerData, importedData);
            saveManager.save();
            window.location.reload();
        };
        reader.readAsText(file);
    }
};

export default saveManager;
