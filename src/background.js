'use strict';

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
const isDevelopment = process.env.NODE_ENV !== 'production';
const path = require('path');
require('../database/models/db_connection');

// const User = require('../database/models/Users.js');
import User from '../database/models/Users.js';
import // defaultUser,
// allUsers,
// getTotalUser,
// loginUser,
'../database/controllers/UserController.js';

// Get the path to the extraResources directory
const extraResourcesPath = path.join(app.getAppPath(), 'splash.html');

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
	{ scheme: 'app', privileges: { secure: true, standard: true } },
]);

User.createTable();

let win;
let splash;

function createSplash(){
	//create splash window
	splash =new BrowserWindow({
	  width: 600,
	  height:400,
	  frame:false,
	  backgroundColor: '#099a98',
	  resizable: false,
	  center: true,
	  
	})
  
   //use this for development
   if(isDevelopment){
	 splash.loadFile( path.join(__dirname, './../public/splash.html'))
   }else{
  
	 //use this for production
	 splash.loadFile(extraResourcesPath);
   }
  
	 
  }

  async function createWindow() {
	// Create the browser window.
	 win = new BrowserWindow({
	  width: 800,
	  height: 600,
	  backgroundColor: '#099a98',
	  show:false,
	  frame:false,
	  fullscreen:false,
	//   alwaysOnTop:true,
	  center:true,
	  
	  webPreferences: {
		devTools:false,
		preload: path.join(__static, 'preload.js'),
		// preload: path.join(__dirname, './src/preload.js'),
		nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
		contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
		// enableRemoteModule: false,
		// nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
		// contextIsolation: true,
		// sandbox: false,

	  }
	})
  
	if (process.env.WEBPACK_DEV_SERVER_URL) {
	  //show window once ready, close splash window if open
	  win.once('ready-to-show',()=>{
		win.setFullScreen(true)
		win.show();
		if(splash){
		  splash.close();
		}
	  });
	  // Load the url of the dev server if in development mode
	  await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)

	//   win.webContents.openDevTools({ mode: 'detach' });
	  if (!process.env.IS_TEST) win.webContents.openDevTools()
	} else {
  
	  //create app entery protocol in production
	  createProtocol('app')
	  //show window once ready, close splash window if open
	  win.once('ready-to-show',()=>{
		win.setFullScreen(true)
			win.show();
			if(splash){
			  splash.close();
			}
	   });
	  // Load the index.html when not in development
	  win.loadURL('app://./index.html')
	}
  }

  

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
	if (isDevelopment && !process.env.IS_TEST) {
	  // Install Vue Devtools
	  try {
		await installExtension(VUEJS_DEVTOOLS)
	  } catch (e) {
		console.error('Vue Devtools failed to install:', e.toString())
	  }
	}
  
	createSplash();
	setTimeout(()=>{
		createWindow()
	},4000)
  
  })

ipcMain.on('minimize', () => {
	win.minimize();
});
ipcMain.on('toggle-fullscreen', () => {
	win.setFullScreen(!win.isFullScreen());
});

ipcMain.on('close', () => {
	win.destroy();
});

ipcMain.handle('user:login', async (_, user) => {
	try {
		const stored_user = await User.loginUser(user);
		return stored_user;
	} catch (error) {
		return console.log(error);
	}
});
ipcMain.handle('user:create', saveData);
ipcMain.handle('user:update', updateData);
ipcMain.handle('user:delete', deleteData);
ipcMain.handle('users:load', loadData);

ipcMain.on('users:loadtotal', async (event, users) => {
	try {
		const u = await User.getAll();
		users = u.length;
		win.webContents.send('users:total', users);
		if (!u) {
			return { error: "user doesn't exit" };
		}
		return u;
	} catch (error) {
		console.log(error.message);
	}
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', (data) => {
			if (data === 'graceful-exit') {
				app.quit();
			}
		});
	} else {
		process.on('SIGTERM', () => {
			app.quit();
		});
	}
}

async function saveData(_, data) {
	try {
		// console.log(data);
		const user = await User.insert(data);
		return user;
	} catch (e) {
		console.log(e.message);
	}
}
async function updateData(_, data) {
	try {
		let user = await User.update(data);
		return user;
	} catch (e) {
		console.log(e.message);
	}
}

async function loadData(_, data) {
	try {
		const res = await User.getAll();
		data = res;
		return data;
	} catch (error) {
		console.log(error.message);
		return error.message;
	}
}

async function deleteData(_, data) {
	try {
		const res = await User.delete(data);
		console.log(res);
		return res;
	} catch (error) {
		console.log(error.message);
		return error.message;
	}
}
