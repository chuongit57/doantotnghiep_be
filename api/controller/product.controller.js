const commonService = require('../common/common.service');
const productService = require('../service/product.service');

module.exports = class {

    async search(req, res, next) {
        try {
            let params = req.query;

            let paramSearch = {
                status: params.status,
                product_code: params.productCode,
                product_name: params.productName,
            }
            let isAttribute = params.isAttribute && params.isAttribute == 1 ? true : false;
            return await commonService.responseSuccess(res, 'Ok', await productService.getProductSearch(paramSearch, isAttribute));
        } catch (e) {
            return commonService.responseErrorCatch(res, e);
        }
    }

    async get(req, res, next) {
        try {
            let params = req.query;
            let paramSearch = {
                status: params.status,
                id: params.id,
                product_code: params.productCode,
                product_name: params.productName,
                category_id: params.categoryId,
            }
            let isAttribute = params.isAttribute && params.isAttribute == 1 ? true : false;
            return await commonService.responseSuccess(res, 'Ok', await productService.getAllProduct(paramSearch, isAttribute));

        } catch (e) {
            return commonService.responseErrorCatch(res, e);
        }
    }

    async add(req, res, next) {
        try {
            let errorCatch = null;
            let params = req.body;

            let productAdd = {};
            productAdd.category_id = params.categoryId
            productAdd.product_code = params.productCode;
            productAdd.product_name = params.productName;
            productAdd.description = params.description;
            productAdd.quantity = params.quantity;
            productAdd.image = '';
            productAdd = await productService.add(productAdd, req.file).catch(e => errorCatch = e);

            if (errorCatch) {
                try {
                    await productService.removeImage(req.file);
                } catch (e2) {

                }
                return commonService.responseErrorCatch(res, errorCatch);
            }

            if (productAdd.success) {
                return commonService.responseSuccess(res, productAdd.message, productAdd.result);
            } else {
                try {
                    await productService.removeImage(req.file);
                } catch (e2) {

                }
                return commonService.responseError(res, productAdd.status, productAdd.message);
            }
        } catch (e) {
            try {
                await productService.removeImage(req.file);
            } catch (e2) {

            }
            return commonService.responseErrorCatch(res, e);
        }
    }

    async update(req, res, next) {
        try {
            let errorCatch = null;
            let params = req.body;

            let productAdd = {};
            productAdd.id = params.productId;
            productAdd.category_id = params.categoryId
            productAdd.product_name = params.productName;
            productAdd.description = params.description;
            productAdd.quantity = params.quantity;
            productAdd = await productService.update(productAdd, req.file).catch(e => errorCatch = e);

            if (errorCatch) {
                try {
                    await productService.removeImage(req.file);
                } catch (e2) {

                }
                return commonService.responseErrorCatch(res, errorCatch);
            }

            if (productAdd.success) {
                return commonService.responseSuccess(res, productAdd.message, productAdd.result);
            } else {
                try {
                    await productService.removeImage(req.file);
                } catch (e2) {

                }
                return commonService.responseError(res, productAdd.status, productAdd.message);
            }
        } catch (e) {
            try {
                await productService.removeImage(req.file);
            } catch (e2) {

            }
            return commonService.responseErrorCatch(res, e);
        }
    }

    async remove(req, res, next) {
        try {
            let errorCatch = null;
            let params = req.query;

            let productId = params.id;
            let product = await productService.getProductById(productId, false);
            if (product) {
                let remove = await productService.remove(product.id, product.image).catch(e => errorCatch = e);
                if (errorCatch) {
                    return commonService.responseErrorCatch(res, errorCatch);
                }
                if (remove.success) {
                    return commonService.responseSuccess(res, remove.message, remove.result);
                } else {
                    return commonService.responseError(res, remove.status, remove.message);
                }
            } else {
                return commonService.responseError(res, 400, 'Sản phẩm không tồn tại');
            }
        } catch (e) {
            return commonService.responseErrorCatch(res, e);
        }
    }

}