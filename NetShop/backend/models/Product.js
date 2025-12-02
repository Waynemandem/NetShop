const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/products.json');

class Product {
    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(dataPath, 'utf8', (err, data) => {
                if (err) {
                    if (err.code === 'ENOENT') return resolve([]);
                    return reject(err);
                }
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    resolve([]);
                }
            });
        });
    }

    static getById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const products = await Product.getAll();
                const product = products.find(p => p.id === id);
                resolve(product);
            } catch (error) {
                reject(error);
            }
        });
    }

    static create(productData) {
        return new Promise(async (resolve, reject) => {
            try {
                const products = await Product.getAll();
                const newProduct = {
                    id: uuidv4(),
                    ...productData,
                    createdAt: new Date().toISOString()
                };
                products.push(newProduct);
                fs.writeFile(dataPath, JSON.stringify(products, null, 2), (err) => {
                    if (err) reject(err);
                    resolve(newProduct);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static update(id, productData) {
        return new Promise(async (resolve, reject) => {
            try {
                const products = await Product.getAll();
                const index = products.findIndex(p => p.id === id);
                if (index === -1) {
                    return resolve(null);
                }
                const updatedProduct = { ...products[index], ...productData, updatedAt: new Date().toISOString() };
                products[index] = updatedProduct;
                fs.writeFile(dataPath, JSON.stringify(products, null, 2), (err) => {
                    if (err) reject(err);
                    resolve(updatedProduct);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static delete(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const products = await Product.getAll();
                const filteredProducts = products.filter(p => p.id === id);
                if (filteredProducts.length === products.length) {
                    return resolve(false); // Not found
                }
                const newProducts = products.filter(p => p.id !== id);
                fs.writeFile(dataPath, JSON.stringify(newProducts, null, 2), (err) => {
                    if (err) reject(err);
                    resolve(true);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = Product;
