# Hệ Thống Bio Cá Nhân & Trang Quản Trị (Admin Dashboard)

Dự án mở rộng trang Bio cá nhân tĩnh thành hệ thống Bio linh hoạt với **Node.js Express backend**, cơ sở dữ liệu **MongoDB** (hỗ trợ Mongoose) và lưu trữ ảnh đại diện trên đám mây **UploadThing** (https://uploadthing.com/).

---

## 🌟 Tính Năng Nổi Bật

### 1. Trang Hiển Thị Bio (`http://localhost:3000/`)
- Giữ nguyên thiết kế thẩm mỹ cao cấp, phong cách tối giản hiện đại (chuẩn font *Be Vietnam Pro*).
- Hiển thị linh hoạt theo hồ sơ mặc định hoặc theo từng người dùng qua đường dẫn vanity URL: `/u/:slug` (ví dụ: `/u/ngoc-phu`, `/u/hoang-nam`).
- Cập nhật dữ liệu động từ backend: Họ tên, chức danh, đơn vị, nút gọi điện nhanh, nút gửi email, thông tin liên hệ và các mạng xã hội bổ sung.
- Có nút điều hướng nhanh sang **Trang Quản Trị** ở góc trên.

### 2. Trang Quản Trị Admin (`http://localhost:3000/admin`)
- **Live Preview thời gian thực (Side-by-side)**: Mọi thao tác gõ họ tên, đổi chức danh, đổi màu nền hay upload avatar đều được phản ánh ngay lập tức trên thẻ Bio xem trước.
- **Quản lý đa hồ sơ**:
  - Tạo mới nhiều hồ sơ Bio độc lập.
  - Đặt một hồ sơ làm mặc định (`⭐ Đặt làm mặc định`).
  - Xóa hồ sơ không dùng đến.
- **Tích hợp tải ảnh đại diện với UploadThing (https://uploadthing.com/)**:
  - Tải ảnh trực tiếp lên Cloud CDN của UploadThing siêu nhanh và an toàn.
  - Tự động điền URL ảnh sau khi upload.
  - Cơ chế dự phòng thông minh: Nếu chưa cấu hình token UploadThing, hệ thống tạm lưu vào thư mục `public/uploads/` để bạn có thể thử nghiệm ngay lập tức.
- **Tùy biến màu nền (Cover Theme)**: Lựa chọn 6 tông màu chuyển sắc (Ocean Blue, Deep Navy, Emerald Green, Sunset Coral, Purple Aurora, Charcoal Dark).
- **Thêm liên kết bổ sung không giới hạn**: Cho phép thêm các dòng liên hệ kèm icon trực quan (Zalo, Facebook, LinkedIn, Website, Địa chỉ văn phòng, Số máy lẻ...).

### 3. Backend Node.js & MongoDB
- Xây dựng bằng **Express 5** với ES Modules hiện đại.
- Kết nối **MongoDB** thông qua Mongoose.
- **Cơ chế Hybrid Fallback**: Nếu MongoDB chưa khởi động hoặc chưa cấu hình URI, hệ thống tự động kích hoạt bộ nhớ dự phòng file `data/bios.json` giúp ứng dụng luôn hoạt động 100% thời gian mà không bị lỗi gián đoạn.
- Đầy đủ bộ RESTful API cho Bio và UploadThing route handler.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt các thư viện cần thiết
```bash
npm install
```

### 2. Cấu hình biến môi trường (`.env`)
Mở file `.env` và điều chỉnh các thông số:

```env
PORT=3000

# Kết nối MongoDB (Local hoặc MongoDB Atlas Cloud)
MONGODB_URI=mongodb://127.0.0.1:27017/bio-rendering

# Token UploadThing (Lấy tại https://uploadthing.com/dashboard -> API Keys)
UPLOADTHING_TOKEN=ufs_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Cách lấy Token UploadThing:**
> 1. Truy cập [https://uploadthing.com/](https://uploadthing.com/) và đăng nhập/đăng ký miễn phí.
> 2. Nhấn **Create App** đặt tên ứng dụng (VD: `my-bio-app`).
> 3. Vào mục **API Keys** copy giá trị token (bắt đầu bằng `ufs_...`) và dán vào `UPLOADTHING_TOKEN` trong `.env`.

### 3. Chạy ứng dụng
- **Chế độ phát triển (Tự động tải lại khi sửa code):**
  ```bash
  npm run dev
  ```
- **Chế độ chạy thông thường:**
  ```bash
  npm start
  ```

---

## 📌 Các Đường Dẫn Truy Cập

| Đường dẫn | Mô tả |
| :--- | :--- |
| `http://localhost:3000/` | Trang hiển thị Bio người dùng mặc định |
| `http://localhost:3000/u/:slug` | Trang Bio của từng người dùng cụ thể (VD: `/u/ngoc-phu`) |
| `http://localhost:3000/admin` | Trang Quản trị cập nhật thông tin & tải avatar |
| `http://localhost:3000/api/bios` | REST API danh sách các hồ sơ Bio |
| `http://localhost:3000/api/system/status` | Kiểm tra trạng thái MongoDB & UploadThing |

---

## 📁 Cấu Trúc Thư Mục

```text
bio-rendering/
├── assets/                  # Ảnh gốc và tài nguyên tĩnh
│   └── images/avatar.jpg
├── data/                    # Thư mục lưu dữ liệu dự phòng (bios.json)
├── public/                  # Giao diện người dùng
│   ├── css/
│   │   ├── bio.css          # Giao diện thẻ Bio cá nhân
│   │   └── admin.css        # Giao diện Dashboard Admin
│   ├── js/
│   │   ├── bio.js           # Xử lý render Bio động & icons
│   │   └── admin.js         # Logic Admin, Live Preview & Upload
│   ├── uploads/             # Thư mục chứa ảnh avatar tạm khi chưa có token
│   ├── index.html           # Trang Bio chính
│   └── admin.html           # Trang Quản trị
├── src/                     # Backend Source Code
│   ├── config/
│   │   └── db.js            # Kết nối MongoDB & Mongoose
│   ├── models/
│   │   └── Bio.js           # Mongoose Schema hồ sơ Bio
│   ├── routes/
│   │   ├── bioRoutes.js     # Router REST API cho Bio
│   │   └── uploadRoutes.js  # Router upload avatar & UploadThing
│   ├── services/
│   │   ├── bioService.js    # Nghiệp vụ xử lý dữ liệu hồ sơ
│   │   └── uploadService.js # Xử lý UploadThing UTApi & local storage
│   └── server.js            # Express Server chính
├── .env                     # File biến môi trường
├── .env.example             # File mẫu biến môi trường
├── package.json             # Khai báo packages & scripts
└── README.md                # Hướng dẫn sử dụng
```
