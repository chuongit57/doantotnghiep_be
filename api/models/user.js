'use strict';
const Main = require('./AllModel');
const Sequelize = require('sequelize');


module.exports = class User extends Main {

    constructor() {
        super();
        this.tUser = this.tableUser();
    }

    async getUserById(id) {
        let user = await this.tUser.findOne({
            where: {
                id: id
            }
        });

        if (user) {
            let result = user.dataValues;
            return result;
        } else {
            return null;
        }
    }

    async getUserByEmail(email) {
        let user = await this.tUser.findOne({
            where: {
                email: email
            }
        });

        if (user) {
            let result = user.dataValues;
            return result;
        } else {
            return null;
        }
    }

    async updateTokenUserById(id, token) {
        await this.tUser.update({ token: token }, { where: { id: id } })
    }

    async addUser(user) {
        if (user) {
            user = await this.tUser.create(user);
            return user;
        } else {
            return null;
        }
    }

    async updateUser(id, userUpdate) {
        if (userUpdate) {
            userUpdate = await this.tUser.update(userUpdate, {
                where: {
                    id: id
                }
            });

            return await this.getUserById(id);
        } else {
            return null;
        }
    }

};