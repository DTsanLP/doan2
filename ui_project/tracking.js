function processCoordinate(coord) {
    let direction = coord.slice(-1);  // Lấy kí tự cuối cùng (N/S hoặc E/W)
    let value = parseFloat(coord);  // Lấy giá trị số

    if (direction === 'S' || direction === 'W') {
        value = -value;  // Nếu là S hoặc W thì âm
    }

    return value;
}
let marker = [];

function displayTracking(map, xe_Id) {
    const xeId = vehiclesArray.find(vehicle => vehicle.id === xe_Id);
    var lat = processCoordinate(xeId.lat);
    var long = processCoordinate(xeId.long);
    
    // Nếu marker chưa tồn tại cho xe này, tạo mới
    if (!marker[xe_Id]) {
        marker[xe_Id] = new H.map.Marker({ lat: lat, lng: long });
        map.addObject(marker[xe_Id]);
    } else {
        // Nếu marker đã tồn tại, chỉ cập nhật vị trí
        marker[xe_Id].setGeometry({ lat: lat, lng: long });
    }
}

// Thêm hàm mới để xử lý click event
function zoomToVehicle(map, xe_Id) {
    const xeId = vehiclesArray.find(vehicle => vehicle.id === xe_Id);
    var lat = processCoordinate(xeId.lat);
    var long = processCoordinate(xeId.long);
    
    map.setCenter({ lat: lat, lng: long });
    map.setZoom(16);  // Chỉ set zoom khi người dùng click
}