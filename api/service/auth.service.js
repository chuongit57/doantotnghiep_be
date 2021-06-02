const randToken = require('rand-token');
const bcrypt = require('bcrypt');

const adminService = require('./../service/admin.service');
const userService = require('./../service/user.service');
const authMethod = require('./../common/authentication/auth/auth.methods');

const jwtVariable = require('./../../variables/jwt');
const VERIFICATION = require('./../enum/verification')

const commonService = require('./../common/common.service');

exports.loginAdmin = async(email, password, res) => {
    return new Promise(async(resolve, reject) => {
        try {
            let admin = await adminService.getAdminByEmail(email);

            if (!admin) {
                resolve({
                    success: false,
                    status: 401,
                    message: 'Email/Mật khẩu không tồn tại.'
                })
            }
            const isPasswordValid = bcrypt.compareSync(password, admin.password);
            if (!isPasswordValid) {
                resolve({
                    success: false,
                    status: 401,
                    message: 'Email/Mật khẩu không tồn tại.'
                })
            }

            const accessTokenLife =
                process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
            const accessTokenSecret =
                process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

            const dataForAccessToken = {
                adminId: admin.id,
            };
            const accessToken = await authMethod.generateToken(
                dataForAccessToken,
                accessTokenSecret,
                accessTokenLife,
            );

            if (!accessToken) {
                resolve({
                    success: false,
                    status: 401,
                    message: 'Đăng nhập không thành công, vui lòng thử lại.'
                })
            }

            let refreshToken = randToken.generate(jwtVariable.refreshTokenSize); // tạo 1 refresh token ngẫu nhiên
            if (!admin.token) {
                // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
                await adminService.updateTokenAdminById(admin.id, refreshToken);
            } else {
                // Nếu user này đã có refresh token thì lấy refresh token đó từ database
                refreshToken = admin.token;
            }
            delete admin.password;
            resolve({
                success: true,
                message: 'Đăng nhập thành công.',
                result: {
                    accessToken: accessToken,
                    // refreshToken: refreshToken,
                    admin: admin
                }
            })
        } catch (e) {
            reject(e)
        }
    })
};

exports.loginUser = async(email, password, res) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await userService.getUserByEmail(email);

            if (!user) {
                resolve({
                    success: false,
                    status: 401,
                    message: 'Email/Mật khẩu không tồn tại.'
                })
            }

            if (user.verification === VERIFICATION.NOT_VERIFIED) {
                resolve({
                    success: false,
                    status: 401,
                    message: 'Email này chưa được xác minh, vui lòng xác minh Email.'
                })
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                resolve({
                    success: false,
                    status: 401,
                    message: 'Email/Mật khẩu không tồn tại.'
                })
            }

            const accessTokenLife =
                process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
            const accessTokenSecret =
                process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

            const dataForAccessToken = {
                userId: user.id,
            };
            const accessToken = await authMethod.generateToken(
                dataForAccessToken,
                accessTokenSecret,
                accessTokenLife,
            );

            if (!accessToken) {
                resolve({
                    success: false,
                    status: 401,
                    message: 'Đăng nhập không thành công, vui lòng thử lại.'
                })
            }

            let refreshToken = randToken.generate(jwtVariable.refreshTokenSize); // tạo 1 refresh token ngẫu nhiên
            if (!user.token) {
                // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
                await userService.updateTokenUserById(user.id, refreshToken);
            } else {
                // Nếu user này đã có refresh token thì lấy refresh token đó từ database
                refreshToken = user.token;
            }
            delete user.password;
            resolve({
                success: true,
                message: 'Đăng nhập thành công.',
                result: {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    user: user
                }
            })
        } catch (e) {
            reject(e)
        }
    })
};

exports.generateAccessToken = async(user_id) => {
    const accessTokenLife =
        process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
    const accessTokenSecret =
        process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

    const dataForAccessToken = {
        userId: user_id,
    };
    const accessToken = await authMethod.generateToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife,
    );
    return accessToken ? accessToken : null;
}

exports.generateRefreshToken = async() => {
    return randToken.generate(jwtVariable.refreshTokenSize);
}

exports.verifyToken = async(tokenFromClient) => {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
    let verifyToken = await authMethod.verifyToken(tokenFromClient, accessTokenSecret);
    return verifyToken ? true : false;
}


exports.refreshTokenAdmin = async(req, res) => {
    // Lấy access token từ header
    const accessTokenFromHeader = req.headers.x_authorization || req.headers.accesstoken || req.query.accessToken || req.headers.accessToken;
    if (!accessTokenFromHeader) {
        return commonService.responseError(res, 400, 'Không tìm thấy access token.')
    }

    // Lấy refresh token từ body
    const refreshTokenFromBody = req.body.refreshToken;
    if (!refreshTokenFromBody) {
        return commonService.responseError(res, 400, 'Không tìm thấy refresh token.')
    }

    const accessTokenSecret =
        process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
    const accessTokenLife =
        process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

    // Decode access token đó
    const decoded = await authMethod.decodeToken(
        accessTokenFromHeader,
        accessTokenSecret,
    );
    if (!decoded) {
        return commonService.responseError(res, 400, 'Access token không hợp lệ.')
    }

    const adminId = decoded.payload.adminId; // Lấy username từ payload

    const admin = await adminService.getAdminById(adminId);
    if (!admin) {
        return commonService.responseError(res, 400, 'Admin không tồn tại.')
    }

    if (refreshTokenFromBody !== admin.token) {
        return commonService.responseError(res, 400, 'Refresh token không hợp lệ.')
    }

    // Tạo access token mới
    const dataForAccessToken = {
        adminId: adminId,
    };

    const accessToken = await authMethod.generateToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife,
    );
    if (!accessToken) {
        return commonService.responseError(res, 400, 'Tạo access token không thành công, vui lòng thử lại.')
    }
    return commonService.responseSuccess(res, 'Tạo access token thành công ', {
        accessToken,
        admin: admin
    })
};

exports.refreshTokenUser = async(req, res) => {
    // Lấy access token từ header
    const accessTokenFromHeader = req.headers.x_authorization || req.headers.accesstoken || req.query.accessToken || req.headers.accessToken;
    if (!accessTokenFromHeader) {
        return commonService.responseError(res, 400, 'Không tìm thấy access token.')
    }

    // Lấy refresh token từ body
    const refreshTokenFromBody = req.body.refreshToken;
    if (!refreshTokenFromBody) {
        return commonService.responseError(res, 400, 'Không tìm thấy refresh token.')
    }

    const accessTokenSecret =
        process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
    const accessTokenLife =
        process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

    // Decode access token đó
    const decoded = await authMethod.decodeToken(
        accessTokenFromHeader,
        accessTokenSecret,
    );
    if (!decoded) {
        return commonService.responseError(res, 400, 'Access token không hợp lệ.')
    }
    console.log(decoded)
    const userId = decoded.payload.userId;

    const user = await userService.getUserById(userId);
    if (!user) {
        return commonService.responseError(res, 400, 'User không tồn tại.')
    }

    if (refreshTokenFromBody !== user.token) {
        return commonService.responseError(res, 400, 'Refresh token không hợp lệ.')
    }

    // Tạo access token mới
    const dataForAccessToken = {
        userId: userId
    };

    const accessToken = await authMethod.generateToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife,
    );
    if (!accessToken) {
        return commonService.responseError(res, 400, 'Tạo access token không thành công, vui lòng thử lại.')
    }

    delete user.password;
    return commonService.responseSuccess(res, 'Tạo access token thành công ', {
        accessToken,
        user: user
    })
};