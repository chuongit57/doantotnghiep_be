'use strict';
const Main = require('./AllModel');
const Sequelize = require('sequelize');


module.exports = class Category extends Main {

    constructor() {
        super();
        this.tCategory = this.tableCategory();
        this.tProduct = this.tableProduct();
        this.tCategory.hasMany(this.tProduct, { foreignKey: 'category_id' });
    }

    async getCategorySearch(params, isAttribute) {
        let objectWhere = {
            where: {}
        }
        if (isAttribute) {
            objectWhere.include = [{
                model: this.tProduct
            }]
        }
        Object.keys(params).forEach(function(key) {
            if (params[key]) {
                if (key === 'category_code') {
                    objectWhere.where.category_code = {
                        [Sequelize.Op.substring]: params[key]
                    }
                }

                if (key === 'category_name') {
                    objectWhere.where.category_name = {
                        [Sequelize.Op.substring]: params[key]
                    }
                }

                if (key === 'status') {
                    objectWhere.where.status = params[key]
                }
            }
        });

        return await this.tCategory.findAll(
            objectWhere
        );
    }


    async getAllCategory(params, isAttribute) {
        let objectWhere = {
            where: {}
        }
        if (isAttribute) {
            objectWhere.include = [{
                model: this.tProduct
            }]
        }
        Object.keys(params).forEach(function(key) {
            if (params[key] || params[key] >= 0) {
                if (key === 'category_code') {
                    objectWhere.where.category_code = params[key]
                }

                if (key === 'category_name') {
                    objectWhere.where.category_name = params[key]
                }

                if (key === 'id') {
                    objectWhere.where.id = params[key]
                }

                if (key === 'status') {
                    objectWhere.where.status = params[key]
                }
            }
        });

        return await this.tCategory.findAll(
            objectWhere
        );
    }

    async getCategoryById(id, isAttribute) {
        let category = null;
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

        if (id || id >= 0) {
            category = await this.tCategory.findOne(objectWhere);
        }

        if (category) {
            let result = category.dataValues;
            return result;
        } else {
            return null;
        }
    }

    async getCategoryByCode(code) {
        let category = await this.tCategory.findOne({
            where: {
                category_code: code
            }
        });

        if (category) {
            let result = category.dataValues;
            return result;
        } else {
            return null;
        }
    }

    async addCategory(category) {
        if (category) {
            category = await this.tCategory.create(category);
            return category;
        } else {
            return null;
        }
    }

    async updateCategory(id, categoryUpdate) {
        if (categoryUpdate) {
            categoryUpdate = await this.tCategory.update(categoryUpdate, {
                where: {
                    id: id
                }
            });

            return await this.getCategoryById(id, false);
        } else {
            return null;
        }
    }

    async removeCategory(id) {
        if (id || id >= 0) {
            await this.tCategory.destroy({
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