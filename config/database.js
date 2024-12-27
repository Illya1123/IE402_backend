const { Sequelize } = require('sequelize');
require('dotenv').config();

// Bỏ qua kiểm tra chứng chỉ SSL (không an toàn, chỉ dùng trong phát triển)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error('POSTGRES_URL không được cấu hình trong tệp .env!');
  process.exit(1);
}

const sequelize = new Sequelize(POSTGRES_URL, {
  dialect: 'postgres',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Kết nối cơ sở dữ liệu thành công!');
  })
  .catch((error) => {
    console.error('Kết nối cơ sở dữ liệu thất bại:', error);
  });

module.exports = sequelize;
