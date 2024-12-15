'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let password = process.env.TOUR_GUIDE_PASSWORD;
        const hashPassword = bcrypt.hashSync(password, 10);
        const userId = uuidv4();
        
        // Insert user into 'user' table
        await queryInterface.bulkInsert('user', [
            {
                id: userId,
                userType: '2',
                firstName: 'Quốc Anh',
                lastName: 'Lê',
                email: process.env.TOUR_GUIDE_EMAIL,
                sdt: '0123456789',
                password: hashPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        // Insert guide information into 'guide' table
        await queryInterface.bulkInsert('guide', [
            {
                id: uuidv4(),
                userId: userId,
                birthdate: '2024-12-14',
                language: 'tiếng Việt',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('guide', { userId: { [Sequelize.Op.ne]: null } }, {});
        await queryInterface.bulkDelete('user', { userType: '2' }, {});
    },
};
