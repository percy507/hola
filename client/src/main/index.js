const { app, BrowserWindow, ipcMain, dialog } = require('electron');

// load global variable
require('./service/global');

// hold window instance
let mainWindow = null;

// main process handle the event from render process
ipcMain.on('save-user-data', function(event, data) {
  // encrypt data
  global.store.set(data);
});

ipcMain.on('show-error-dialog', function(event, msg) {
  dialog.showErrorBox(msg.title, msg.content);
});

ipcMain.on('login', function() {
  // here add setTimeout , avoid conflict with closed event
  setTimeout(() => {
    mainWindow.close();

    global.isAllowLogin = true;

    // open new window
    openHomeWindow();
  }, 100);
});

ipcMain.on('logout', function() {
  // here add setTimeout , avoid conflict with closed event
  setTimeout(() => {
    mainWindow.close();

    global.isAllowLogin = false;

    // open new window
    openLoginWindow();
  }, 100);
});

app.on('ready', () => {
  // require('./service/menu').setMenu();
  const uid = global.store.get('uid');

  if (uid) {
    global.socket.emit('is-allow-login', uid, data => {
      if (data.isAllowLogin) {
        global.isAllowLogin = true;
        openHomeWindow();
      } else {
        openLoginWindow();
      }
    });
  } else {
    openLoginWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('open-file', e => {
  e.preventDefault();
});

app.on('open-url', e => {
  e.preventDefault();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

function openLoginWindow() {
  createWindow({
    width: 280,
    height: 400
  });
}

function openHomeWindow() {
  createWindow({
    width: 885,
    height: 550
  });
}

// create main window
function createWindow(configObj) {
  const devServer = 'http://localhost:9080';
  const winURL =
    process.env.NODE_ENV === 'development'
      ? devServer
      : `file://${__dirname}/index.html`;

  const config = Object.assign(
    {
      width: 280,
      height: 400,
      useContentSize: true,
      resizable: false,
      maximizable: false,
      fullscreen: false,
      titleBarStyle: 'hidden'
    },
    configObj ? configObj : {}
  );

  mainWindow = new BrowserWindow(config);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // disable page zoom
  mainWindow.webContents.on('did-finish-load', function() {
    this.setZoomFactor(1);
    this.setVisualZoomLevelLimits(1, 1);
    this.setLayoutZoomLevelLimits(0, 0);
  });

  mainWindow.loadURL(winURL);
  mainWindow.show();
}
