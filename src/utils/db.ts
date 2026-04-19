/**
 * Simple IndexedDB wrapper to handle high-quality media storage
 * without hitting the 5MB localStorage limit.
 */

const DB_NAME = 'DalaliAppDB';
const STORE_NAME = 'properties';

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('chats')) {
        db.createObjectStore('chats', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('agents')) {
        db.createObjectStore('agents', { keyPath: 'id' });
      }
    };
  });
};

export const saveProperties = async (properties: any[]) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  
  // Clear and re-save (simplistic approach for this context)
  store.clear();
  properties.forEach(p => store.add(p));
  
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

export const getProperties = async (): Promise<any[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveChats = async (chats: any[]) => {
  const db = await initDB();
  const tx = db.transaction('chats', 'readwrite');
  const store = tx.objectStore('chats');
  store.clear();
  chats.forEach(c => store.add(c));
  return new Promise((resolve) => {
    tx.oncomplete = () => resolve(true);
  });
};

export const getChats = async (): Promise<any[]> => {
  const db = await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction('chats', 'readonly');
    const store = tx.objectStore('chats');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });
};

export const saveAgent = async (agent: any) => {
  const db = await initDB();
  const tx = db.transaction('agents', 'readwrite');
  const store = tx.objectStore('agents');
  store.add(agent);
  return new Promise((resolve) => {
    tx.oncomplete = () => resolve(true);
  });
};

export const getAgents = async (): Promise<any[]> => {
  const db = await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction('agents', 'readonly');
    const store = tx.objectStore('agents');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Compresses images to ensure smooth performance
 */
export const compressImage = (base64Str: string, maxWidth = 1200, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
  });
};
