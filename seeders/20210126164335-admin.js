'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('admin', [{
            name: 'Admin',
            email: 'admin',
            password: '$2b$10$9MqbXSEa5aXXqkIch./Z4eHKoQX9VIt2P1o0edmSRXMIxhE95w1/e',
            token: null,
            login_at: new Date(),
            created_at: new Date(),
            updated_at: new Date()
        }]);
    },

    down: async(queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};