const fs = require("fs")
const bcrypt = require('bcrypt');
const Category = require("../models/category");

let categoryModel = new Category();

const getCategoryById = async(id, isAttribute) => {
    return await categoryModel.getCategoryById(id, isAttribute);
}

const getCategoryByCode = async(code) => {
    return await categoryModel.getCategoryByCode(code);
}

const getAllCategory = async(paramSearch, isAttribute) => {
    return await categoryModel.getAllCategory(paramSearch, isAttribute);
}

const getCategorySearch = async(params, isAttribute) => {
    return await categoryModel.getCategorySearch(params, isAttribute);
}
const add = async(categoryCode, categoryName) => {
    let category = {}

    category.category_code = categoryCode;
    category.category_name = categoryName;
    category.status = 1;

    let categoryCheck = await categoryModel.getCategoryByCode(category.category_code);
    if (categoryCheck && categoryCheck.id) {
        return {
            success: false,
            status: 401,
            message: 'category_code này đã được sử dụng rồi',
        }
    }

    category = await categoryModel.addCategory(category);
    if (category && category.id) {
        return {
            success: true,
            status: 200,
            message: `Thêm mới loại sản phẩm mới thành công`,
            result: {
                category: category
            }
        }
    } else {
        return {
            success: false,
            status: 401,
            message: `Thêm mới loại sản phẩm thất bại`,
        }
    }
}

const update = async(id, category) => {
    let categoryUpdate = {}
    Object.keys(category).forEach(function(key) {
        if (key !== 'id' || key !== 'category_code') {
            categoryUpdate[key] = category[key];
        }
    });
    categoryUpdate = await categoryModel.updateCategory(id, categoryUpdate);
    return { category: categoryUpdate }
}

const remove = async(id) => {
    let isRemove = await categoryModel.removeCategory(id);
    if (isRemove) {
        return {
            success: true,
            status: 200,
            message: `Xoá loại sản phẩm thành công`,
            result: {

            }
        }
    } else {
        return {
            success: false,
            status: 401,
            message: `Xoá loại sản phẩm thất bại`,
        }
    }
}

module.exports = {
    getCategoryById,
    getCategoryByCode,
    getAllCategory,
    getCategorySearch,
    add,
    update,
    remove
};