const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: (queryInterface, Sequelize) => {
        let password = process.env.ADMIN_PASSWORD;
        const hashPassword = bcrypt.hashSync(password, 10);
        return queryInterface.bulkInsert('user', [
            {
                id: uuidv4(),
                userType: '0',
                firstName: 'Super',
                lastName: 'Admin',
                email: process.env.ADMIN_EMAIL,
                password: hashPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('user', { userType: '0' }, {});
    },
};