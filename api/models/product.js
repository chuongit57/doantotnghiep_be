'use strict';
const Main = require('./AllModel');
const Sequelize = require('sequelize');


module.exports = class Product extends Main {

    constructor() {
        super();
        this.tableProduct = this.tableProduct();
        this.tableCategory = this.tableCategory();
        this.tableProduct.hasOne(this.tableCategory, { foreignKey: 'id', sourceKey: 'category_id' });
    }

    async getProductById(id, isAttribute) {
        let objectWhere = {
            where: {
                id: id
            }
        }
        if (isAttribute) {
            objectWhere.include = [{
                model: this.tProduct
            }]
        }

        let product = null;
        if (id || id >= 0) {
            product = await this.tableProduct.findOne(objectWhere);
        }

        if (product) {
            let result = product.dataValues;
            return result;
        } else {
            return null;
        }
    }

    async getProductAttributeById(id, attribute) {
        let product = null;
        if (id || id >= 0) {
            product = await this.tableProduct.findOne({
                where: {
                    id: id
                },
                include: [{
                    model: this.tableCategory
                }]
            });
        }

        if (product) {
            let result = product.dataValues;
            return result;
        } else {
            return null;
        }
    }

    async getProductByCode(code) {
        let product = null;
        if (code) {
            product = await this.tableProduct.findOne({
                where: {
                    product_code: code
                }
            });
        }

        if (product) {
            let result = product.dataValues;
            return result;
        } else {
            return null;
        }
    }

    async getAllProduct(params, isAttribute) {
        let objectWhere = {
            where: {}
        }
        if (isAttribute) {
            objectWhere.include = [{
                model: this.tableCategory
            }]
        }
        Object.keys(params).forEach(function(key) {
            if (params[key] || params[key] >= 0) {
                if (key === 'id') {
                    objectWhere.where.id = params[key]
                }

                if (key === 'product_code') {
                    objectWhere.where.product_code = params[key]
                }

                if (key === 'product_name') {
                    objectWhere.where.product_name = params[key]
                }

                if (key === 'category_id') {
                    objectWhere.where.category_id = params[key]
                }

                if (key === 'status') {
                    objectWhere.where.status = params[key]
                }
            }
        });
        return await this.tableProduct.findAll(
            objectWhere
        );
    }

    async getProductSearch(params, isAttribute) {
        let objectWhere = {
            where: {}
        }
        if (isAttribute) {
            objectWhere.include = [{
                model: this.tableCategory
            }]
        }
        Object.keys(params).forEach(function(key) {
            if (params[key]) {
                if (key === 'product_code') {
                    objectWhere.where.product_code = {
                        [Sequelize.Op.substring]: params[key]
                    }
                }

                if (key === 'product_name') {
                    objectWhere.where.product_name = {
                        [Sequelize.Op.substring]: params[key]
                    }
                }

                if (key === 'status') {
                    objectWhere.where.status = params[key]
                }
            }

        });
        return await this.tableProduct.findAll(
            objectWhere
        );
    }

    async add(product) {
        if (product) {
            product = await this.tableProduct.create(product);
            return product;
        } else {
            return null;
        }
    }

    async update(id, product) {
        let productUpdate = {};
        Object.keys(product).forEach(function(key) {
            if (key !== 'id' || key !== 'code') {
                productUpdate[key] = product[key]
            }
        });

        if (productUpdate) {
            productUpdate = await this.tableProduct.update(productUpdate, {
                where: {
                    id: id
                }
            });

            return await this.getProductById(id);
        } else {
            return null;
        }
    }

    async remove(id) {
        if (id || id >= 0) {
            await this.tableProduct.destroy({
                where: {
                    id: id
                }
            });
            return true;
        } else {
            return false;
        }
    }

};