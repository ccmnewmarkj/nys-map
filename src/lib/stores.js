import { writable, derived } from "svelte/store";

export let map = writable();
export let popup = writable(); // Map popup

export let directoryData = writable([]); // Raw directory data
export let filteredDirectory = writable([]); // Filtered directory data

export let countyPolygons = writable(); // County polygons
export let regionPolygons = writable(); // Region polygons

// Panels
export let aboutPanelVisible = writable(true);
export let searchPanelVisible = writable(false);
export let outletPanelVisible = writable(false);

// Filters
export let selectedCommunity = writable(); // Selected community
export let selectedLanguage = writable(); // Selected language
export let selectedFormat = writable(); // Selected type
export let selectedOutlet = writable(); // Selected outlet