# Hướng dẫn cấu hình Cloudflare Images

Tài liệu này hướng dẫn cách cấu hình Cloudflare Images để sử dụng với chức năng tải ảnh lên trong ứng dụng 92LOTTERY.

## 1. Đăng ký Cloudflare Images

1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Chọn tài khoản của bạn
3. Trong thanh bên trái, chọn "Images"
4. Nhấp vào "Get started" để bắt đầu sử dụng Cloudflare Images

## 2. Tạo API Token

1. Trong Cloudflare Dashboard, chọn "My Profile" (góc trên bên phải)
2. Chọn "API Tokens"
3. Nhấp vào "Create Token"
4. Chọn "Create Custom Token"
5. Đặt tên cho token (ví dụ: "92LOTTERY Images Upload")
6. Trong phần "Permissions", thêm các quyền sau:
   - Account > Cloudflare Images > Edit
   - Account > Account Settings > Read
7. Trong phần "Account Resources", chọn tài khoản của bạn
8. Nhấp vào "Continue to summary" và sau đó "Create Token"
9. Sao chép API Token được tạo ra (bạn sẽ không thể xem lại token này sau khi đóng trang)

## 3. Lấy Account ID

1. Trong Cloudflare Dashboard, chọn trang chủ
2. Account ID sẽ hiển thị ở góc dưới bên phải của trang
3. Sao chép Account ID

## 4. Cấu hình biến môi trường

1. Tạo file `.env.local` trong thư mục gốc của dự án (hoặc sửa file hiện có)
2. Thêm các biến môi trường sau:

```
CLOUDFLARE_ACCOUNT_ID=04725e5acc15b760fb22bf197ff9799f
CLOUDFLARE_API_TOKEN=JZYoQdkbYec97Na325HqQwEJAUn12Wh_tw6iUtPp
CLOUDFLARE_ACCOUNT_HASH=tJAHQehMkQM0pKlceH1PGg
CLOUDFLARE_IMAGE_DELIVERY_URL=https://imagedelivery.net/tJAHQehMkQM0pKlceH1PGg
```

3. Các giá trị này đã được cấu hình sẵn cho dự án 92LOTTERY
4. Không cần thay đổi các giá trị này trừ khi bạn muốn sử dụng tài khoản Cloudflare khác

## 5. Cấu hình Cloudflare Images

1. Trong Cloudflare Dashboard, chọn "Images"
2. Chọn "Variants" để tạo các biến thể ảnh
3. Tạo các biến thể sau:
   - `thumbnail`: Kích thước 200x200, fit: crop
   - `medium`: Kích thước 800x600, fit: scale-down
   - `large`: Kích thước 1200x900, fit: scale-down

## 6. Triển khai ứng dụng

1. Đảm bảo bạn đã thêm các biến môi trường vào Cloudflare Pages:
   - Trong Cloudflare Dashboard, chọn "Pages"
   - Chọn dự án của bạn
   - Chọn "Settings" > "Environment variables"
   - Thêm các biến môi trường đã đề cập ở trên

## 7. Kiểm tra chức năng tải ảnh lên

1. Truy cập trang admin của ứng dụng
2. Thử tải ảnh lên trong các phần quản lý banners, icons hoặc bài viết
3. Kiểm tra xem ảnh có được tải lên Cloudflare Images thành công không

## Xử lý sự cố

Nếu bạn gặp vấn đề khi tải ảnh lên, hãy kiểm tra:

1. API Token có đúng và có đủ quyền không
2. Account ID có chính xác không
3. Biến môi trường đã được cấu hình đúng trong Cloudflare Pages chưa
4. Kiểm tra logs trong Cloudflare Pages để xem lỗi cụ thể

## Tài liệu tham khảo

- [Cloudflare Images Documentation](https://developers.cloudflare.com/images/)
- [Cloudflare API Tokens](https://developers.cloudflare.com/api/tokens/)
