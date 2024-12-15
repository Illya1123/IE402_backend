'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let password = process.env.STAFF_PASSWORD;
        const hashPassword = bcrypt.hashSync(password, 10);
        const userId = uuidv4();
        
        // Insert user into 'user' table
        await queryInterface.bulkInsert('user', [
            {
                id: userId,
                userType: '3',
                firstName: 'Quốc Anh staff',
                lastName: 'Lê',
                email: process.env.STAFF_EMAIL,
                sdt: '0123456789',
                password: hashPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        // Insert guide information into 'guide' table
        await queryInterface.bulkInsert('staff', [
            {
                id: uuidv4(),
                userId: userId,
                role: 'dev',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('staff', { userId: { [Sequelize.Op.ne]: null } }, {});
        await queryInterface.bulkDelete('user', { userType: '3' }, {});
    },
};
