const commonService = require('../common/common.service');
const categoryService = require('../service/category.service');

module.exports = class {

    async search(req, res, next) {
        try {
            let params = req.query;

            let paramSearch = {
                status: params.status,
                category_code: params.categoryCode,
                category_name: params.categoryName,
            }
            let isAttribute = params.isAttribute && params.isAttribute == 1 ? true : false;
            return await commonService.responseSuccess(res, 'Ok', await categoryService.getCategorySearch(paramSearch, isAttribute));
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
                category_code: params.categoryCode,
                category_name: params.categoryName,
            }
            let isAttribute = params.isAttribute && params.isAttribute == 1 ? true : false;
            return await commonService.responseSuccess(res, 'Ok', await categoryService.getAllCategory(paramSearch, isAttribute));
        } catch (e) {
            return commonService.responseErrorCatch(res, e);
        }
    }

    async add(req, res, next) {
        try {
            let errorCatch = null;
            let params = req.body;
            let code = params.categoryCode;
            let name = params.categoryName;
            let categoryAdd = await categoryService.add(code, name).catch(e => errorCatch = e);

            if (errorCatch) {
                return commonService.responseErrorCatch(res, errorCatch);
            }

            if (categoryAdd.success) {
                return commonService.responseSuccess(res, categoryAdd.message, categoryAdd.result);
            } else {
                return commonService.responseError(res, categoryAdd.status, categoryAdd.message);
            }
        } catch (e) {
            return commonService.responseErrorCatch(res, e);
        }
    }

    async update(req, res, next) {
        try {
            let errorCatch = null;
            let params = req.body;

            let categoryId = params.id;
            let categoryOld = await categoryService.getCategoryById(categoryId, false);
            if (categoryOld) {
                let categoryUpdate = {};
                if (params && params.categoryName) {
                    categoryUpdate.category_name = params.categoryName;
                }

                categoryUpdate = await categoryService.update(categoryOld.id, categoryUpdate).catch(e => errorCatch = e);
                if (errorCatch) {
                    return commonService.responseErrorCatch(res, errorCatch);
                }
                return commonService.responseSuccess(res, 'Cập nhật thành công', categoryUpdate);
            } else {
                return commonService.responseError(res, 401, 'category không tồn tại');
            }
        } catch (e) {
            return commonService.responseErrorCatch(res, e);
        }
    }

    async remove(req, res, next) {
        try {
            let errorCatch = null;
            let params = req.query;

            let categoryId = params.id;
            let categoryOld = await categoryService.getCategoryById(categoryId, true);
            if (categoryOld.products && categoryOld.products.length > 0) {
                return commonService.responseError(res, 400, 'Danh mục này đang có sản phẩm hoạt động không thế xoá');
            }
            if (categoryOld) {
                let remove = await categoryService.remove(categoryOld.id).catch(e => errorCatch = e);
                if (errorCatch) {
                    return commonService.responseErrorCatch(res, errorCatch);
                }
                if (remove.success) {
                    return commonService.responseSuccess(res, remove.message, remove.result);
                } else {
                    return commonService.responseError(res, remove.status, remove.message);
                }
            } else {
                return commonService.responseError(res, 400, 'category không tồn tại');
            }
        } catch (e) {
            return commonService.responseErrorCatch(res, e);
        }
    }

}