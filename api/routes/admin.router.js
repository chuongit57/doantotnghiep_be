const express = require("express");
const router = express.Router();
const asyncHandler = require('express-async-handler')
const { validate, Joi } = require('express-validation')
const multer = require('multer');

const AdminController = require('./../controller/admin.controller');
const ProductController = require('../controller/product.controller');
const CategoryController = require('../controller/category.controller');
const authService = require('../service/auth.service');
const authMiddleware = require('./../common/authentication/auth/auth.middlewares')
var fs = require('fs');
module.exports = () => {
    const loginValidation = {
        body: Joi.object({
            email: Joi.string()
                .required(),
            password: Joi.string()
                .required(),
        }),
    }

    const storageProductImage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './uploads');
          },
          filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now());
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

    const uploadProductImage = multer({
        storage: storageProductImage,
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
    });

    let adminController = new AdminController();
    let productController = new ProductController();
    let categoryController = new CategoryController();

    router.post("/login", validate(loginValidation), asyncHandler(adminController.login));

    const addProductValidation = {
        body: Joi.object({
            productCode: Joi.string()
                .required(),
            productName: Joi.string()
                .required(),
            categoryId: Joi.number()
                .required(),
            price: Joi.number(),
            description: Joi.string()
        }),
    }

    router.post("/product", [authMiddleware.isAuthAdmin, uploadProductImage.single('productImage'), validate(addProductValidation)], asyncHandler(productController.add));
    router.put("/product", [authMiddleware.isAuthAdmin, uploadProductImage.single('productImage')], asyncHandler(productController.update));
    router.delete("/product", authMiddleware.isAuthAdmin, asyncHandler(productController.remove));


    router.get("/category", authMiddleware.isAuthAdmin, asyncHandler(categoryController.get));
    const addCategoryValidation = {
        body: Joi.object({
            categoryCode: Joi.string()
                .required(),
            categoryName: Joi.string()
                .required(),
        }),
    }
    router.post("/category", [authMiddleware.isAuthAdmin, validate(addCategoryValidation)], asyncHandler(categoryController.add));

    const updateCategoryValidation = {
        body: Joi.object({
            id: Joi.number().required(),
            categoryCode: Joi.string(),
            categoryName: Joi.string()
                .required(),
        }),
    }
    router.put("/category", [authMiddleware.isAuthAdmin, validate(updateCategoryValidation)], asyncHandler(categoryController.update));

    const deleteCategoryValidation = {
        body: Joi.object({
            id: Joi.number().required()
        }),
    }
    router.delete("/category", [authMiddleware.isAuthAdmin], asyncHandler(categoryController.remove));

    return router;
}