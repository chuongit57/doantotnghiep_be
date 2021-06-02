'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../../helper/Database');

module.exports = class AllModel {

    constructor() {
        this.Op = Sequelize.Op;
    }

    tableAdmin() {
        class Admin extends Sequelize.Model {}
        Admin.init({
            id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.STRING,
            token: Sequelize.STRING,
            login_at: Sequelize.DATE,
            created_at: {
                field: 'created_at',
                type: Sequelize.DATE,
                defaultValue: new Date(),

            },
            updated_at: {
                field: 'updated_at',
                type: Sequelize.DATE,
                defaultValue: new Date(),
            }
        }, {
            sequelize,
            modelName: 'admin',
            tableName: 'admin',
            timestamps: false,
            charset: 'utf8',
            collate: 'utf8_unicode_ci'
        });

        return Admin;
    }

    tableUser() {
        class User extends Sequelize.Model {}
        User.init({
            id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
            avatar: Sequelize.STRING,
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.STRING,
            token: Sequelize.STRING,
            status: Sequelize.INTEGER,
            verification: Sequelize.STRING,
            login_at: Sequelize.DATE,
            created_at: {
                field: 'created_at',
                type: Sequelize.DATE,
                defaultValue: new Date(),

            },
            updated_at: {
                field: 'updated_at',
                type: Sequelize.DATE,
                defaultValue: new Date(),
            }
        }, {
            sequelize,
            modelName: 'user',
            tableName: 'user',
            timestamps: false,
            charset: 'utf8',
            collate: 'utf8_unicode_ci'
        });

        return User;
    }

    tableCategory() {
        class Category extends Sequelize.Model {}
        Category.init({
            id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
            category_code: Sequelize.STRING,
            category_name: Sequelize.STRING,
            status: Sequelize.INTEGER,
            created_at: {
                field: 'created_at',
                type: Sequelize.DATE,
                defaultValue: new Date(),

            },
            updated_at: {
                field: 'updated_at',
                type: Sequelize.DATE,
                defaultValue: new Date(),
            }
        }, {
            sequelize,
            modelName: 'category',
            tableName: 'category',
            timestamps: false,
            charset: 'utf8',
            collate: 'utf8_unicode_ci'
        });

        return Category;
    }

    tableProduct() {
        class Product extends Sequelize.Model {}
        Product.init({
            id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
            product_code: Sequelize.STRING,
            product_name: Sequelize.STRING,
            image: Sequelize.STRING,
            description: Sequelize.STRING,
            category_id: Sequelize.INTEGER,
            quantity: Sequelize.INTEGER,
            status: Sequelize.INTEGER,
            created_at: {
                field: 'created_at',
                type: Sequelize.DATE,
                defaultValue: new Date(),

            },
            updated_at: {
                field: 'updated_at',
                type: Sequelize.DATE,
                defaultValue: new Date(),
            }
        }, {
            sequelize,
            modelName: 'product',
            tableName: 'product',
            timestamps: false,
            charset: 'utf8',
            collate: 'utf8_unicode_ci'
        });

        return Product;
    }
}

// ALTER TABLE user MODIFY COLUMN name VARCHAR(255)
// CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;