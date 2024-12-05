// Khởi tạo Firebase (đã có trong file của bạn)
var firebaseConfig = {
    apiKey: "AIzaSyBY1Ff7ulpCEZW9FX_KK7tg2mc9CGnVdDw",
    authDomain: "fir-demo-75dcf.firebaseapp.com",
    databaseURL: "https://fir-demo-75dcf-default-rtdb.firebaseio.com",
    projectId: "fir-demo-75dcf",
    storageBucket: "fir-demo-75dcf.firebasestorage.app",
    messagingSenderId: "12915978449",
    appId: "1:12915978449:web:7ad0227052ad3ae31ad5f0",
    measurementId: "G-2V1QH7BD0D"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();
// Lấy dữ liệu người dùng từ Firebase
function loadUsers() {
    const usersRef = firebase.database().ref('users');
    const usersList = document.getElementById('usersList');
    
    usersRef.on('value', (snapshot) => {
        usersList.innerHTML = ''; // Xóa nội dung cũ
        
        snapshot.forEach((userSnapshot) => {
            const userData = userSnapshot.val();
            const userId = userSnapshot.key;
            
            if (userData.name) {
                const userCard = document.createElement('div');
                userCard.className = 'user-card';
                userCard.innerHTML = `
                    <div class="user-header">
                        <span class="user-name">${userData.name }</span>
                        <button class="edit-btn" onclick="openEditModal('${userId}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="user-info">
                        <div class="info-item">
                            <span class="info-label">Số điện thoại</span>
                            <span class="info-value">${userData.phoneNumber || 'Chưa có'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Địa chỉ</span>
                            <span class="info-value">${userData.address || 'Chưa có'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">CCCD</span>
                            <span class="info-value">${userData.idNumber || 'Chưa có'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Mã thẻ</span>
                            <span class="info-value">${userData.cardId || 'Chưa có'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Biển số xe</span>
                            <span class="info-value">${userData.drive || 'Chưa có'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Loại xe</span>
                            <span class="info-value">${userData.vehicleType || 'Chưa có'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Ngày đăng ký</span>
                            <span class="info-value">${userData.registrationDate || 'Chưa có'}</span>
                        </div>
                    </div>
                `;
                
                usersList.appendChild(userCard);
            }
        });
    });
}

// Biến để lưu ID người dùng đang được chỉnh sửa
let currentEditingUserId = null;

// Mở modal chỉnh sửa
function openEditModal(userId) {
    currentEditingUserId = userId;
    const modal = document.getElementById('editModal');
    
    // Lấy thông tin hiện tại của người dùng
    firebase.database().ref('users/' + userId).once('value', (snapshot) => {
        const userData = snapshot.val();
        
        // Điền thông tin vào form
        document.getElementById('editName').value = userData.name || '';
        document.getElementById('editphoneNumber').value = userData.phoneNumber || '';
        document.getElementById('editAddress').value = userData.address || '';
        document.getElementById('editIdNumber').value = userData.idNumber || '';
    });
    
    modal.style.display = 'block';
}

// Đặt tất cả event listeners vào trong DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Load users
    loadUsers();
    
    // Đóng modal
    document.querySelector('.close').onclick = function() {
        document.getElementById('editModal').style.display = 'none';
    }

    // Xử lý form submit
    document.getElementById('editForm').onsubmit = function(e) {
        e.preventDefault();
        
        if (!currentEditingUserId) return;
        
        const updates = {
            name: document.getElementById('editName').value,
            phoneNumber: document.getElementById('editphoneNumber').value,
            address: document.getElementById('editAddress').value,
            idNumber: document.getElementById('editIdNumber').value,
            //cardId: document.getElementById('editCardId').value,
            drive: document.getElementById('editDrive').value,
            vehicleType: document.getElementById('editVehicleType').value,
            registrationDate: document.getElementById('editRegistrationDate').value
        };
        
        // Cập nhật Firebase
        firebase.database().ref('users/' + currentEditingUserId).update(updates)
            .then(() => {
                alert('Cập nhật thành công!');
                document.getElementById('editModal').style.display = 'none';
            })
            .catch((error) => {
                alert('Lỗi: ' + error.message);
            });
    };
}); 