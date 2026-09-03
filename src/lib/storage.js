// Items live in the browser's localStorage only. Nothing leaves the device.
// Every call is wrapped because storage can be unavailable (private mode,
// blocked site data) and the prototype must still run from the demo seed.

const KEY = 'sharefridge.v2.items';

export function loadItems() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
}

export function saveItems(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable — keep running in memory */
  }
}

export function clearItems() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
