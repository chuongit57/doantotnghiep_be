const Admin = require('./../models/admin');

let adminModel = new Admin();

const getAdminById = async(id) => {
    return await adminModel.getAdminById(id);
}

const getAdminByEmail = async(email) => {
    return await adminModel.getAdminByEmail(email);
}

const updateTokenAdminById = async(id, token) => {
    return await adminModel.updateTokenAdminById(id, token);
}

module.exports = {
    getAdminById,
    getAdminByEmail,
    updateTokenAdminById
};