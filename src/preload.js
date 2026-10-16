'use strict';
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('arcade', { loadState:()=>ipcRenderer.invoke('state:load'), saveState:(state)=>ipcRenderer.invoke('state:save',state), factory:()=>ipcRenderer.invoke('state:factory'), generate:(prompt,current)=>ipcRenderer.invoke('cartridge:generate',prompt,current), export:(cartridge)=>ipcRenderer.invoke('cartridge:export',cartridge), import:()=>ipcRenderer.invoke('cartridge:import') });
