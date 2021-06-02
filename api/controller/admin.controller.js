const commonService = require('../common/common.service');
const authService = require('../service/auth.service');

module.exports = class {

    async login(req, res, next) {
        try {
            let params = req.body;
            let email = params.email;
            let password = params.password;
            if (!email) {
                return commonService.responseError(res, 200, 'Bạn chưa điền username')
            }

            if (!password) {
                return commonService.responseError(res, 200, 'Bạn chưa điền mật khẩu')
            }
            let authAdmin = await authService.loginAdmin(email, password, res);
            if (authAdmin.success) {
                return commonService.responseSuccess(res, authAdmin.message, authAdmin.result);
            } else {
                return commonService.responseError(res, authAdmin.status, authAdmin.message);
            }
        } catch (e) {
            return commonService.responseErrorCatch(res, e);
        }
    }
    
}