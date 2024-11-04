const {Sequelize} = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('./config');

const sequelize = new Sequelize(config[env]);

sequelize.authenticate()
    .then(() => {
        console.log('Kết nối cơ sở dữ liệu thành công!');
    })
    .catch((error) => {
        console.error('Kết nối cơ sở dữ liệu thất bại:', error);
    });


module.exports = sequelize;