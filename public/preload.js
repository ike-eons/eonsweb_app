// import { contextBridge, ipcRenderer } from 'electron';
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("API", {
  minimize: async () => await ipcRenderer.send("minimize"),
  toggleFullscreen: () => {
    ipcRenderer.send("toggle-fullscreen");
  },

  close: async () => await ipcRenderer.send("close"),

  userLogin: async (user) => {
    let data = await ipcRenderer.invoke("user:login", user);
    return data;
  },
  usersFetch: async (users) => {
    let data = await ipcRenderer.invoke("users:load", users);
    return data;
  },
  userCreate: async (user) => {
    let data = await ipcRenderer.invoke("user:create", user);
    return data;
  },
  userUpdate: async (user) => {
    let data = await ipcRenderer.invoke("user:update", user);
    return data;
  },
  userDelete: async (user) => {
    let data = await ipcRenderer.invoke("user:delete", user);
    return data;
  },
  customersFetch: async (users) => {
    let data = await ipcRenderer.invoke("customers:load", customers);
    return data;
  },
  customerCreate: async (user) => {
    let data = await ipcRenderer.invoke("customer:create", customer);
    return data;
  },
  customerUpdate: async (user) => {
    let data = await ipcRenderer.invoke("customer:update", customer);
    return data;
  },
  customerDelete: async (user) => {
    let data = await ipcRenderer.invoke("customer:delete", customer);
    return data;
  },
});
