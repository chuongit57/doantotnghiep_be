const express = require("express");
const router = express.Router();
const asyncHandler = require('express-async-handler')
const { validate, Joi } = require('express-validation')
const multer = require('multer');

const UserController = require('../controller/user.controller');
const ProductController = require('../controller/product.controller');
const authService = require('../service/auth.service');
const authMiddleware = require('./../common/authentication/auth/auth.middlewares')

module.exports = () => {
    const loginValidation = {
        body: Joi.object({
            email: Joi.string()
                .email()
                .required(),
            password: Joi.string()
                .required(),
        }),
    }

    const registerValidation = {
        body: Joi.object({
            name: Joi.string()
                .required(),
            email: Joi.string()
                .email()
                .required(),
            password: Joi.string()
                .required(),
        }),
    }

    const storageAvatar = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './uploads');
        },
        filename: function(req, file, cb) {
            cb(null, new Date().toISOString() + file.originalname);
        }
    });

    const fileFilter = (req, file, cb) => {
        // reject a file
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };

    const uploadAvatar = multer({
        storage: storageAvatar,
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
    });


    let userController = new UserController();
    let productController = new ProductController();

    router.post("/login", validate(loginValidation), asyncHandler(userController.login));

    router.post("/register", validate(registerValidation), asyncHandler(userController.register));

    router.post("/update-user", [authMiddleware.isAuthUser, uploadAvatar.single('avatar')], asyncHandler(userController.updateUser));

    router.post('/refresh', authService.refreshTokenUser);

    router.post("/products", authMiddleware.isAuthUser, asyncHandler(productController.getLstProduct));
    return router;
}