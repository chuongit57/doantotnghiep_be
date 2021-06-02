'use strict';
const Main = require('./AllModel');

module.exports = class Admin extends Main {

    constructor() {
        super();
        this.tAdmin = this.tableAdmin();
    }

    async getAdminById(id) {
        let admin = await this.tAdmin.findOne({
            where: {
                id: id
            }
        });

        if (admin) {
            let result = admin.dataValues;
            delete result.password;
            return result;
        } else {
            return null;
        }
    }

    async getAdminByEmail(email) {
        let admin = await this.tAdmin.findOne({
            where: {
                email: email
            }
        });

        if (admin) {
            let result = admin.dataValues;
            return result;
        } else {
            return null;
        }
    }

    async updateTokenAdminById(id, token) {
        await this.tAdmin.update({ token: token }, { where: { id: id } })
    }


};