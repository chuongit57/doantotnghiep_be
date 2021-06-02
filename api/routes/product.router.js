const express = require("express");
const router = express.Router();
const asyncHandler = require('express-async-handler')
const { validate, Joi } = require('express-validation')
const multer = require('multer');

const ProductController = require('../controller/product.controller');

module.exports = () => {
    let productController = new ProductController()

    router.get("", asyncHandler(productController.get));
    router.get("/search", asyncHandler(productController.search));
    return router;
}