const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const routes = require('./routes/routes');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError').default;
const globalErrorHandler = require('./controllers/errorController');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger-ui/swagger_output.json');

const app = express();
const PORT = process.env.PORT || 5000;

// Kiểm tra và tạo thư mục 'uploads' nếu nó chưa tồn tại
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình Multer
const storage = multer.diskStorage({
    destination: function (req, file, res) {
        res(null, './uploads'); // Thư mục lưu trữ ảnh
    },
    filename: function (req, file, res) {
        // Lưu với tên gốc của file
        res(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Middleware
// Apply CORS before your routes
app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware phục vụ file tĩnh trong thư mục 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route để upload ảnh
app.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        const Path = `./uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl: Path });
    } else {
        res.status(400).json({ message: 'No file uploaded' });
    }
});

// Avatar upload route
app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    if (req.file) {
        const avatarPath = `./uploads/${req.file.filename}`;
        res.status(200).json({ avatarUrl: avatarPath });
    } else {
        res.status(400).json({ message: 'No file uploaded' });
    }
});

// Route GET để lấy avatar từ đường dẫn đầy đủ
app.get('/photo', (req, res) => {
    const filePath = req.query.path; // Lấy đường dẫn từ query parameter
    
    // Kiểm tra đường dẫn hợp lệ và giới hạn trong thư mục 'uploads'
    if (filePath && filePath.startsWith('./uploads/')) {
        const avatarPath = path.join(__dirname, filePath);
        
        res.sendFile(avatarPath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(404).json({ message: 'Avatar not found' });
            }
        });
    } else {
        res.status(400).json({ message: 'Invalid file path' });
    }
});

// Test route
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'It works hà há',
    });
});

// API routes
app.use('/', routes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Handle unknown routes
app.use(
    '*',
    catchAsync(async (req, res, next) => {
        throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    }),
);

// Global error handler
app.use(globalErrorHandler);

// Start server
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
