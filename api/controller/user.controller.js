const commonService = require('../common/common.service');
const authService = require('../service/auth.service');
const userService = require('../service/user.service');

module.exports = class {

    async login(req, res, next) {
        try {
            let errorCatch = null;
            let params = req.body;
            let email = params.email;
            let password = params.password;

            let loginUser = await authService.loginUser(email, password, res).catch(e => errorCatch = e);
            if (errorCatch) {
                return commonService.responseErrorCatch(res, errorCatch);
            }
            if (loginUser.success) {
                return commonService.responseSuccess(res, loginUser.message, loginUser.result);
            } else {
                return commonService.responseError(res, loginUser.status, loginUser.message);
            }
        } catch (e) {
            return commonService.responseErrorCatch(res, e);
        }
    }

    async register(req, res, next) {
        try {
            let errorCatch = null;
            let params = req.body;

            let avatar = '';
            let name = params.name;
            let email = params.email;
            let password = params.password;

            let register = await userService.register(avatar, name, email, password).catch(e => errorCatch = e);
            if (errorCatch) {
                return commonService.responseErrorCatch(res, errorCatch);
            }
            if (register.success) {
                return commonService.responseSuccess(res, register.message, register.result);
            } else {
                return commonService.responseError(res, register.status, register.message);
            }
        } catch (e) {
            return commonService.responseErrorCatch(res, e);
        }
    }

    async updateUser(req, res, next) {
        try {
            let errorCatch = null;
            let params = req.body;

            let userOld = req.user;
            let userUpdate = {};
            userUpdate.id = userOld.id;
            if (params && params.name) {
                userUpdate.name = params.name;
            }

            let avatar = req.file;
            if (avatar) {
                userUpdate.avatar = await userService.updateAvatar(userOld.id, userOld.email, avatar, avatar.mimetype.split('/')[1]);
            }

            userUpdate = await userService.updateUser(userOld.id, userUpdate);
            return commonService.responseSuccess(res, 'Cập nhật thành công', userUpdate);
        } catch (e) {
            return commonService.responseErrorCatch(res, e);
        }
    }

}