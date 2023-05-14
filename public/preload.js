// import { contextBridge, ipcRenderer } from 'electron';
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("API", {
  //CONTROL BUTTONS
  minimize: async () => await ipcRenderer.send("minimize"),
  toggleFullscreen: () => {
    ipcRenderer.send("toggle-fullscreen");
  },
  close: async () => await ipcRenderer.send("close"),

  //USER API
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

  //CUSTOMERS API
  customersFetch: async (customers) => {
    let data = await ipcRenderer.invoke("customers:load", customers);
    return data;
  },
  customerCreate: async (customer) => {
    let data = await ipcRenderer.invoke("customer:create", customer);
    return data;
  },
  customerUpdate: async (customer) => {
    let data = await ipcRenderer.invoke("customer:update", customer);
    return data;
  },
  customerDelete: async (customer) => {
    let data = await ipcRenderer.invoke("customer:delete", customer);
    return data;
  },

  //CATEGORY API
  categoriesFetch: async (categories) => {
    let data = await ipcRenderer.invoke("categories:load", categories);
    return data;
  },
  categoryCreate: async (category) => {
    let data = await ipcRenderer.invoke("category:create", category);
    return data;
  },
  categoryUpdate: async (category) => {
    let data = await ipcRenderer.invoke("category:update", category);
    return data;
  },
  categoryDelete: async (category) => {
    let data = await ipcRenderer.invoke("category:delete", category);
    return data;
  },

  //PRODUCT API
  productsFetch: async (products) => {
    let data = await ipcRenderer.invoke("products:load", products);
    return data;
  },
  productCreate: async (product) => {
    let data = await ipcRenderer.invoke("product:create", product);
    return data;
  },
  productUpdate: async (product) => {
    let data = await ipcRenderer.invoke("product:update", product);
    return data;
  },
  productDelete: async (product) => {
    let data = await ipcRenderer.invoke("product:delete", product);
    return data;
  },

  //INVOICE API
  invoicesFetch: async (invoices) => {
    let data = await ipcRenderer.invoke("invoices:load", invoices);
    return data;
  },

  invoiceCreate: async (invoice) => {
    let data = await ipcRenderer.invoke("invoice:create", invoice);
    return data;
  },

  invoiceUpdate: async (invoice) => {
    let data = await ipcRenderer.invoke("invoice:update", invoice);
    return data;
  },

  invoiceDelete: async (invoice) => {
    let data = await ipcRenderer.invoke("invoice:delete", invoice);
  },
});
