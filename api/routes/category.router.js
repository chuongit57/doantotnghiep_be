const express = require("express");
const router = express.Router();
const asyncHandler = require('express-async-handler')
const { validate, Joi } = require('express-validation')
const multer = require('multer');

const CategoryController = require('../controller/category.controller');

module.exports = () => {
    let categoryController = new CategoryController()

    router.get("", asyncHandler(categoryController.get));
    router.get("/search", asyncHandler(categoryController.search));
    return router;
}