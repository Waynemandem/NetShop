const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/orders.json');

class Order {
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

    static create(orderData) {
        return new Promise(async (resolve, reject) => {
            try {
                const orders = await Order.getAll();
                const newOrder = {
                    id: uuidv4(),
                    ...orderData,
                    status: 'Pending',
                    createdAt: new Date().toISOString()
                };
                orders.push(newOrder);
                fs.writeFile(dataPath, JSON.stringify(orders, null, 2), (err) => {
                    if (err) reject(err);
                    resolve(newOrder);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static getByUser(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const orders = await Order.getAll();
                const userOrders = orders.filter(o => o.user === userId);
                resolve(userOrders);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = Order;
