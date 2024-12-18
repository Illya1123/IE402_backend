const routeDestinate = require('../db/models/routedestinate');
const route = require('../db/models/route');
const destination = require('../db/models/destination');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Haversine formula to calculate distance between two latitude/longitude points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371; // Radius of the Earth in km

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c; // Returns the distance in kilometers
};

// Helper function to convert degrees to radians
const degreesToRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
};

const createRouteDestinate = catchAsync(async (req, res, next) => {
    const { route_id } = req.body;

    // Tìm route bằng id
    const foundRoute = await route.findOne({
        where: { id: route_id }  // Tìm bằng id thay vì route_id nếu đó là tên trường trong cơ sở dữ liệu
    });

    if (!foundRoute) {
        return next(new AppError('Route not found', 404));
    }

    // Lấy thông tin tọa độ bắt đầu và kết thúc từ route
    const { startLatitude, startLongitude, endLatitude, endLongitude } = foundRoute;

    // Tìm tất cả các điểm đến
    const destinations = await destination.findAll();

    // Tính toán khoảng cách từ điểm bắt đầu của route đến các điểm đến
    const sortedDestinations = destinations.map((dest, index) => {
        const distance = calculateDistance(startLatitude, startLongitude, dest.latitude, dest.longitude);
        return {
            ...dest.dataValues,
            distance, // Thêm khoảng cách vào mỗi destination
        };
    });

    // Sắp xếp các điểm đến theo khoảng cách từ điểm bắt đầu
    sortedDestinations.sort((a, b) => a.distance - b.distance);

    let order = 1;
    let reachedDestination = false;  // Biến để kiểm tra khi nào đã đến điểm cuối cùng

    for (const destinationData of sortedDestinations) {
        // Kiểm tra xem đã đến điểm đích chưa
        if (reachedDestination) {
            break;  // Nếu đã đến điểm đích, không cần tiếp tục tìm các điểm khác
        }

        // Nếu khoảng cách đến điểm cuối của route nhỏ hơn một ngưỡng cho phép, xem như đã đến đích
        const distanceToEnd = calculateDistance(destinationData.latitude, destinationData.longitude, endLatitude, endLongitude);
        if (distanceToEnd < 1) { // Giả sử khoảng cách < 1km xem như đã đến đích
            reachedDestination = true;  // Đánh dấu là đã đến đích
        }

        const newRouteDestinate = await routeDestinate.create({
            route_id,                    // ID của route
            destinate_id: destinationData.id,  // ID của destination
            order,                        // Thứ tự dựa trên khoảng cách
            longitude: destinationData.longitude,
            latitude: destinationData.latitude,
        });

        order++;
    }

    return res.status(201).json({
        status: 'success',
        message: 'RouteDestinate created with ordered destinations',
    });
});



module.exports = { createRouteDestinate };
