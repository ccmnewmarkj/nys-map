import { writable } from "svelte/store";

export let map = writable();

export let directoryData = writable([]); // Raw directory data

// Panels
export let aboutPanelVisible = writable(true);
export let searchPanelVisible = writable(false);
export let outletPanelVisible = writable(false);