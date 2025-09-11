# Yêu cầu cài đặt

- **Node.js** [https://nodejs.org/en/download]
- **pnpm** [https://pnpm.io/installation#on-windows]
- **PHP** [https://www.php.net/downloads.php]
- **Composer** - PHP package manager [https://getcomposer.org/download/]
- **MySQL**

# Cài packages

- Đứng ở root project chạy lệnh: `pnpm install`

# Cách chạy Frontend

- Ở root chạy `pnpm fe dev`
- Truy cập ở `http://localhost:5173`

# Cách chạy Backend

- Bước 1: Tạo database trong MySQL.
- Bước 2: Tạo file tên `.env` trong thư mục `packages/backend/`.
- Bước 3: Copy nội dung file `.env.example` vào file `.env`. Sửa giá trị của env `DB_DATABASE` thành cái tên database đã tạo ở bước 1.
- Bước 4: Chạy lệnh tạo bảng với data trong file `packages\backend\database\MyNewDump.sql` (chạy cái này trong trình quản lý database của bạn).
- Bước 5: Ở root chạy `pnpm be dev`.

Truy cập ở `http://localhost:8000` hoặc trang docs API tại `http://localhost:8000/docs/api`
