import ElectronStore from 'electron-store';
const Store: typeof ElectronStore = require('electron-store');

export default new Store({
    cwd: process.platform === 'win32' ? process.cwd() : null
});