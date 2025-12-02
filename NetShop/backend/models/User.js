const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dataPath = path.join(__dirname, '../data/users.json');

class User {
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

    static getByEmail(email) {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await User.getAll();
                const user = users.find(u => u.email === email);
                resolve(user);
            } catch (error) {
                reject(error);
            }
        });
    }

    static getById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await User.getAll();
                const user = users.find(u => u.id === id);
                resolve(user);
            } catch (error) {
                reject(error);
            }
        });
    }

    static async create(userData) {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await User.getAll();

                // Hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(userData.password, salt);

                const newUser = {
                    id: uuidv4(),
                    name: userData.name,
                    email: userData.email,
                    password: hashedPassword,
                    role: userData.role || 'user', // user, admin
                    balance: 0,
                    createdAt: new Date().toISOString()
                };

                users.push(newUser);
                fs.writeFile(dataPath, JSON.stringify(users, null, 2), (err) => {
                    if (err) reject(err);
                    resolve(newUser);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static matchPassword(enteredPassword, userPassword) {
        return bcrypt.compare(enteredPassword, userPassword);
    }

    static getSignedJwtToken(userId) {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
    }

    static async addToWishlist(userId, productId) {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await User.getAll();
                const index = users.findIndex(u => u.id === userId);
                if (index === -1) return reject(new Error('User not found'));

                if (!users[index].wishlist) users[index].wishlist = [];

                if (!users[index].wishlist.includes(productId)) {
                    users[index].wishlist.push(productId);
                    fs.writeFile(dataPath, JSON.stringify(users, null, 2), (err) => {
                        if (err) reject(err);
                        resolve(users[index].wishlist);
                    });
                } else {
                    resolve(users[index].wishlist);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    static async removeFromWishlist(userId, productId) {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await User.getAll();
                const index = users.findIndex(u => u.id === userId);
                if (index === -1) return reject(new Error('User not found'));

                if (!users[index].wishlist) users[index].wishlist = [];

                users[index].wishlist = users[index].wishlist.filter(id => id !== productId);

                fs.writeFile(dataPath, JSON.stringify(users, null, 2), (err) => {
                    if (err) reject(err);
                    resolve(users[index].wishlist);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = User;
