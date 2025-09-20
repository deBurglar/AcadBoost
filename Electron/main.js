const { app, BrowserWindow, ipcMain } = require('electron');
const bleno = require('bleno');

ipcMain.handle('startBeacon', async () => {
  bleno.on('stateChange', (state) => {
    if (state === 'poweredOn') {
      bleno.startAdvertising('FacultyBeacon', ['1234']);
      console.log("Faculty beacon started ✅");
    } else {
      bleno.stopAdvertising();
    }
  });
});