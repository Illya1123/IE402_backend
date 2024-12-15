'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let password = process.env.CUSTOMER_PASSWORD;
        const hashPassword = bcrypt.hashSync(password, 10);
        const userId = uuidv4();
        
        // Insert user into 'user' table
        await queryInterface.bulkInsert('user', [
            {
                id: userId,
                userType: '1',
                firstName: 'Quốc Anh user',
                lastName: 'Lê',
                email: process.env.CUSTOMER_EMAIL,
                sdt: '0123456789',
                password: hashPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        // Insert guide information into 'guide' table
        await queryInterface.bulkInsert('customer', [
            {
                id: uuidv4(),
                userId: userId,
                birthdate: '2003-01-01',
                address: 'kp3, Thạnh Hoá, Thạnh Hoá, Long An',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('customer', { userId: { [Sequelize.Op.ne]: null } }, {});
        await queryInterface.bulkDelete('user', { userType: '1' }, {});
    },
};
