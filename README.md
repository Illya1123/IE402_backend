# IE402 Backend Project

## Giới thiệu

Đây là repository của nhóm 8 cho phần backend của dự án Ứng dụng quản lý tour cho công ty du lịch, được xây dựng bằng Node.js và Express. Dự án sử dụng cơ sở dữ liệu PostgreSQL để quản lý dữ liệu và tích hợp Swagger cho tài liệu API.

## Thành viên nhóm

| STT | Họ và Tên       | MSSV      | Vai trò        | Email                |
|-----|------------------|-----------|----------------|----------------------|
| 1   | Lê Quốc Anh | 21520565    | nhóm trưởng      | 21520565@gm.uit.edu.vn              |
| 2   | Trịnh Hoài Nam | 21521167    | thành viên      | 21521167@gm.uit.edu.vn              |
| 3   | Nguyễn Tấn Phát | 21521260    | thành viên      | 21521260@gm.uit.edu.vn              |
| 4   | Nguyễn Đoàn Nhật Khánh | 21522207    | thành viên      | 21522207@gm.uit.edu.vn              |
| 5   | Nguyễn Anh Kiệt | 21522822    | thành viên      | 21522822@gm.uit.edu.vn              |
| 6   | Đào Nguyên Nhật Minh | 21522824    | thành viên      | 21522824@gm.uit.edu.vn              |
| 7   | Đỗ Đức Phú | 22521098    | thành viên      | 22521098@gm.uit.edu.vn              |

> **Ghi chú**: Email riêng của tôi: lequocanh0101@gmail.com

## Cài đặt và cấu hình

### Bước 1: Sao chép repository

```bash
git clone https://github.com/Illya1123/IE402_backend.git
cd IE402_backend
```
### Bước 2: Cài đặt các gói cần thiết

```bash
npm install
```
### Bước 3: Cấu hình môi trường

```bash
PORT =
NODE_ENV =
DB_USER =
DB_PASSWORD =
DB_HOST =
DB_PORT =
DB_NAME =
JWT_SECRET_KEY=
JWT_EXPIRES_IN=
DATABASE_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=

TOUR_GUIDE_EMAIL=
TOUR_GUIDE_PASSWORD=

STAFF_EMAIL=
STAFF_PASSWORD=

CUSTOMER_EMAIL=
CUSTOMER_PASSWORD=

```
### Bước 4: lệnh khởi tạo các table cho PostgreSQL
```bash
npm run migrate
npm run seed:all

```

### Bước 4: Chạy server kiểu develop
```bash
npm run start:dev

```