// Module to create native browser window,
// Module to control application life,
// Module to create native application menus and context menus.
const {BrowserWindow, app, Menu} = require('electron')
const path = require('path')
const url = require('url')
const DEBUG = false;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createMenu(){
    var template = null;
    if (process.platform === 'darwin') {
        template = [{
            label: "Application",
            submenu: [
                { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
            ]}, {
            label: "Edit",
            submenu: [
                { label: "Copy",   accelerator: "CmdOrCtrl+C", selector: "copy:" },
                { label: "Reload", accelerator: "CmdOrCtrl+R", click: function() {mainWindow.reload();} },
            ]}
        ];
    }
    if(template != null)Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    else console.log('Menu is null, platform not supported');
};

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 390, height: 530, titleBarStyle: 'hidden', resizable:false})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '/app/view/index.html'),
      protocol: 'file:',
      slashes: true
  }))

  // Open the DevTools.
  if(DEBUG) mainWindow.webContents.openDevTools()

  // Create the Application's main menu
  createMenu();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
      createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
