const fs = require("fs").promises;
var pathX = require('path');
const bcrypt = require('bcrypt');
const Category = require("../models/category");
const Product = require("../models/product");

let categoryModel = new Category();
let productModel = new Product();

const getProductById = async(id, isAttribute) => {
    return await productModel.getProductById(id, isAttribute);
}

const getProductSearch = async(paramSearch, isAttribute) => {
    return await productModel.getProductSearch(paramSearch, isAttribute);
}

const getAllProduct = async(paramSearch, isAttribute) => {
    return await productModel.getAllProduct(paramSearch, isAttribute);
}

const add = async(product, fileImage) => {
    let category = await categoryModel.getCategoryById(product.category_id);
    if (category && category.id) {
        let productCheck = await productModel.getProductByCode(product.product_code);
        if (!productCheck) {
            product.category_id = category.id;
            product.status = 1;
            if (fileImage) {
                product.image = await uploadProductImage(product.product_code, fileImage)
                product.image = 'http://localhost:3000/' + product.image;
            }
            product = await productModel.add(product);
            if (product && product.id) {
                return {
                    success: true,
                    status: 200,
                    message: `Thêm mới sản phẩm thành công`,
                    result: {
                        product: product
                    }
                }
            } else {
                return {
                    success: false,
                    status: 401,
                    message: `Thêm mới sản phẩm thất bại`,
                }
            }
        } else {
            return {
                success: false,
                status: 401,
                message: `Product Code này đã sử dụng`,
            }
        }
    } else {
        return {
            success: false,
            status: 401,
            message: `Loại sản phảm không tồn tại`,
        }
    }
}

const update = async(product, fileImage) => {
    let productOld = await productModel.getProductAttributeById(product.id);
    if (productOld && productOld.id) {
        let category = null;
        if (product.category_id) {
            category = await categoryModel.getCategoryById(product.category_id, false);
        } else {
            category = productOld.category;
        }
        if (category && category.id) {
            product.category_id = category.id;
            product.status = 1;

            if (fileImage) {
                product.image = await uploadProductImage(productOld.product_code, fileImage);
                product.image = 'http://localhost:3000/' + product.image;
            }
            product = await productModel.update(productOld.id, product);
            if (product && product.id) {
                return {
                    success: true,
                    status: 200,
                    message: `Cập nhât sản phẩm thành công`,
                    result: {
                        product: product
                    }
                }
            } else {
                return {
                    success: false,
                    status: 401,
                    message: `Cập nhât sản phẩm thất bại`,
                }
            }
        } else {
            return {
                success: false,
                status: 401,
                message: `Loại sản phảm không tồn tại`,
            }
        }
    } else {
        return {
            success: false,
            status: 401,
            message: `Sản phẩm không tồn tại`,
        }
    }
}

const uploadProductImage = async(code, file) => {
    const contents = await fs.readFile(file.path, { encoding: 'base64' });
    let nameFile = code + '.' + file.mimetype.split('/')[1];
    let pathNew = 'public/images/product/' + nameFile;
    await fs.writeFile(pathNew, contents, { encoding: 'base64' }, async function(err) {
        if (err) throw err;
    });
    await fs.unlink(file.path, function(err) {
        if (err) throw err;
    });
    return pathNew;
}

const removeImage = async(file) => {
    await fs.unlink(file.path, function(err) {
        if (err) throw err;
    });
}

const remove = async(id, path) => {
    path = path.split('http://localhost:3000/')[1]
    let isRemove = await productModel.remove(id);
    if (isRemove) {
        await fs.unlink(path, function(err) {
            if (err) throw err;
        });
        return {
            success: true,
            status: 200,
            message: `Xoá sản phẩm thành công`,
            result: {

            }
        }
    } else {
        return {
            success: false,
            status: 401,
            message: `Xoá sản phẩm thất bại`,
        }
    }
}

module.exports = {
    getProductById,
    getAllProduct,
    getProductSearch,
    add,
    update,
    remove,
    removeImage
};