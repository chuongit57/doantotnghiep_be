const fs = require("fs").promises;
const bcrypt = require('bcrypt');
const User = require('./../models/user');

let userModel = new User();

const getUserByEmail = async(email) => {
    return await userModel.getUserByEmail(email);
}

const getUserById = async(id) => {
    return await userModel.getUserById(id);
}

const updateTokenUserById = async(id, token) => {
    return await userModel.updateTokenUserById(id, token);
}

const register = async(avatar, name, email, password) => {
    let user = {};
    user.avatar = avatar;
    user.name = name;
    user.email = email;
    user.password = password;
    user.verification = 1;
    user.status = 1;
    user.login_at = new Date();
    let userCheck = await userModel.getUserByEmail(email);
    if (userCheck && userCheck.id) {
        return {
            success: false,
            status: 401,
            message: 'Email này đã được sử dụng rồi',
        }
    }

    user.password = await bcrypt.hash(user.password, Number(process.env.SALT_ROUNDS));
    user = await userModel.addUser(user);
    delete user.password;
    if (user && user.id) {
        return {
            success: true,
            status: 200,
            message: 'Đăng ký thành công',
            result: {
                user: user
            }
        }
    } else {
        return {
            success: false,
            status: 401,
            message: 'Đăng ký không thành công',
        }
    }
}

const updateUser = async(id, user) => {
    let userUpdate = {}
    Object.keys(user).forEach(function(key) {
        if (key !== 'id') {
            userUpdate[key] = user[key];
        }
    });
    userUpdate = await userModel.updateUser(id, userUpdate);
    delete userUpdate.password;
    delete userUpdate.token;
    return { user: userUpdate }
}

const updateAvatar = async(id, email, file, endFile) => {
    const contents = await fs.readFile(file.path, { encoding: 'base64' });
    let nameFile = id.toString() + '_' + email.toString() + '.' + endFile;


    let pathNew = 'public/images/avatar/' + nameFile;
    await fs.writeFile(pathNew, contents, { encoding: 'base64' }, async function(err) {
        if (err) throw err;
    });
    await fs.unlink(file.path, function(err) {
        if (err) throw err;
    });

    return pathNew;
}

module.exports = {
    getUserByEmail,
    getUserById,
    updateTokenUserById,
    register,
    updateUser,
    updateAvatar
};