
const { resolve } = require('path')
const electron = require('electron')

const BrowserWindow = electron.BrowserWindow
const app = electron.app

process.env.NODE_ENV = process.env.NODE_ENV || 'production'
var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit()
  }
})

app.on('ready', function() {
  mainWindow = new BrowserWindow({ autoHideMenuBar: true })

  if (process.env.NODE_ENV == 'production') {
    mainWindow.loadURL('file://' + resolve(__dirname, '../dist/index.html'))
  } else {
    mainWindow.loadURL('http://localhost:8080')
    mainWindow.webContents.openDevTools() 
  }
  

  mainWindow.on('closed', function() {
    mainWindow = null
  })
})