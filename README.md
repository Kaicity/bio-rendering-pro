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

## ⚡ Hướng Dẫn Deploy Lên Vercel (Miễn Phí)

Dự án đã được cấu hình sẵn file `vercel.json` và serverless handler `api/index.js` để chạy hoàn hảo trên nền tảng **Vercel Serverless**.

### 1. Chuẩn bị Cơ sở dữ liệu Cloud (MongoDB Atlas)
> ⚠️ **Lưu ý quan trọng:** Trên Vercel (môi trường Serverless), hệ thống file cục bộ là tạm thời (ephemeral), do đó bạn **cần sử dụng MongoDB Atlas** (miễn phí) để lưu dữ liệu vĩnh viễn:
1. Đăng ký tài khoản miễn phí tại [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Tạo một **M0 Free Cluster**.
3. Vào mục **Database Access** tạo User và Password.
4. Vào mục **Network Access** chọn **Add IP Address** -> chọn **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Vào **Clusters** -> nhấn **Connect** -> chọn **Drivers (Node.js)** để lấy Connection String:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/bio-rendering?retryWrites=true&w=majority
   ```

### 2. Chuẩn bị Token UploadThing
1. Đăng nhập [https://uploadthing.com/](https://uploadthing.com/).
2. Tạo App và vào mục **API Keys** copy token (`ufs_...`).

### 3. Deploy qua Vercel Dashboard (Khuyên dùng)
1. Đẩy mã nguồn dự án lên GitHub:
   ```bash
   git add .
   git commit -m "Deploy bio-rendering to Vercel"
   git push origin main
   ```
2. Đăng nhập [Vercel](https://vercel.com/) và chọn **Add New...** -> **Project**.
3. Chọn repository GitHub vừa đẩy lên và nhấn **Import**.
4. Mở phần **Environment Variables** và thêm 2 biến:
   - `MONGODB_URI`: Điền connection string MongoDB Atlas của bạn.
   - `UPLOADTHING_TOKEN`: Điền token UploadThing của bạn (`ufs_...`).
5. Nhấn nút **Deploy**! Chỉ mất khoảng 30 giây là trang web sẽ online với tên miền dạng `https://ten-du-an.vercel.app/`.

### 4. Deploy nhanh bằng Vercel CLI
Nếu muốn deploy trực tiếp từ máy tính bằng dòng lệnh:
```bash
# Cài Vercel CLI (nếu chưa có)
npm install -g vercel

# Đăng nhập và deploy
vercel

# Thêm biến môi trường
vercel env add MONGODB_URI
vercel env add UPLOADTHING_TOKEN

# Deploy lên bản Production chính thức
vercel --prod
```

---

## 🚀 Hướng Dẫn Deploy Lên Render.com (Miễn Phí)

Dự án này là một ứng dụng **Express Node.js hoàn chỉnh**, kết hợp cả Frontend lẫn Backend, vì vậy triển khai dưới dạng **Web Service** trên Render.com chạy rất mượt và không gặp giới hạn Serverless.

### Cách 1: Deploy thủ công qua Render Dashboard (Đơn giản nhất)
1. Đẩy code lên GitHub:
   ```bash
   git add .
   git commit -m "Add render config"
   git push origin main
   ```
2. Đăng nhập [Render.com](https://dashboard.render.com/) và nhấn nút **New +** -> chọn **Web Service**.
3. Chọn repository GitHub chứa dự án và nhấn **Connect**.
4. Thiết lập thông số:
   - **Name**: `bio-rendering` (hoặc tên tuỳ ý)
   - **Region**: Chọn gần Việt Nam (như `Singapore`)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Thêm các biến môi trường (**Environment Variables**):
   - `NODE_VERSION` = `20`
   - `MONGODB_URI` = `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/bio-rendering?retryWrites=true&w=majority`
   - `UPLOADTHING_TOKEN` = `ufs_...` (Token lấy từ uploadthing.com)
   - `APP_URL` = `https://<ten-service-render>.onrender.com`
6. Nhấn **Deploy Web Service** và chờ 1-2 phút là website online!

### Cách 2: Deploy qua Blueprint (`render.yaml`)
Dự án đã có sẵn file `render.yaml`.
1. Trên Render Dashboard, nhấn **New +** -> **Blueprint**.
2. Chọn repo GitHub của bạn -> Render sẽ tự động đọc cấu hình trong `render.yaml`.
3. Điền các biến `MONGODB_URI` và `UPLOADTHING_TOKEN` khi được yêu cầu, sau đó bấm **Apply**.

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
