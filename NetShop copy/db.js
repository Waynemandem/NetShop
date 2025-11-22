// IndexedDB configuration
const DB_NAME = 'netshop_db';
const DB_VERSION = 2;
const STORES = {
    IMAGES: 'product_images',
    ORDERS: 'orders',
    WISHLIST: 'wishlist',
    ADDRESSES: 'addresses',
    RETURNS: 'returns',
    SELLER_ORDERS: 'seller_orders'
};

// Database Access Helper
async function getStore(storeName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            resolve(store);
        };
    });
}

// Account Management Database Operations
async function getOrders() {
    const store = await getStore(STORES.ORDERS);
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getWishlist() {
    const store = await getStore(STORES.WISHLIST);
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getAddresses() {
    const store = await getStore(STORES.ADDRESSES);
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getReturns() {
    const store = await getStore(STORES.RETURNS);
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getSellerOrders() {
    const store = await getStore(STORES.SELLER_ORDERS);
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function saveAddressToDb(address) {
    const store = await getStore(STORES.ADDRESSES);
    
    // If this is a default address, remove default status from other addresses
    if (address.isDefault) {
        const addresses = await getAddresses();
        for (let addr of addresses) {
            if (addr.isDefault && addr.id !== address.id) {
                addr.isDefault = false;
                await new Promise((resolve, reject) => {
                    const request = store.put(addr);
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });
            }
        }
    }

    return new Promise((resolve, reject) => {
        const request = store.put(address);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function saveReturnToDb(returnRequest) {
    const store = await getStore(STORES.RETURNS);
    return new Promise((resolve, reject) => {
        const request = store.put(returnRequest);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function updateOrderStatus(orderId, status) {
    const store = await getStore(STORES.ORDERS);
    const order = await new Promise((resolve, reject) => {
        const request = store.get(orderId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

    if (order) {
        order.status = status;
        return new Promise((resolve, reject) => {
            const request = store.put(order);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

async function removeFromWishlist(productId) {
    const store = await getStore(STORES.WISHLIST);
    return new Promise((resolve, reject) => {
        const request = store.delete(productId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function makeDefaultAddress(addressId) {
    const store = await getStore(STORES.ADDRESSES);
    const addresses = await getAddresses();
    
    for (let address of addresses) {
        if (address.id === addressId) {
            address.isDefault = true;
        } else if (address.isDefault) {
            address.isDefault = false;
        }
        await new Promise((resolve, reject) => {
            const request = store.put(address);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

class ImageDB {
    static async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create stores if they don't exist
                if (!db.objectStoreNames.contains(STORES.IMAGES)) {
                    db.createObjectStore(STORES.IMAGES);
                }
                if (!db.objectStoreNames.contains(STORES.ORDERS)) {
                    db.createObjectStore(STORES.ORDERS, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(STORES.WISHLIST)) {
                    db.createObjectStore(STORES.WISHLIST, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(STORES.ADDRESSES)) {
                    db.createObjectStore(STORES.ADDRESSES, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(STORES.RETURNS)) {
                    db.createObjectStore(STORES.RETURNS, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(STORES.SELLER_ORDERS)) {
                    db.createObjectStore(STORES.SELLER_ORDERS, { keyPath: 'id' });
                }
            };
        });
    }

    static async saveImage(productId, imageDataUrl) {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORES.IMAGES], 'readwrite');
            const store = transaction.objectStore(STORES.IMAGES);
            
            const request = store.put(imageDataUrl, productId);
            
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    static async getImage(productId) {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORES.IMAGES], 'readonly');
            const store = transaction.objectStore(STORES.IMAGES);
            
            const request = store.get(productId);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    static async deleteImage(productId) {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORES.IMAGES], 'readwrite');
            const store = transaction.objectStore(STORES.IMAGES);
            
            const request = store.delete(productId);
            
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }
}

window.ImageDB = ImageDB; // Make available globally