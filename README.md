# 92LOTTERY

92LOTTERY là nền tảng xổ số, casino và cá cược trực tuyến hàng đầu Việt Nam.

## Tính năng

- Xổ số trực tuyến (WinGo, K3 lotre, 5D lotre)
- Slots games
- Casino trực tuyến
- Cá cược thể thao
- Game bài
- Bắn cá
- Mini games
- Hệ thống khuyến mãi
- Blog tin tức

## Công nghệ sử dụng

- Next.js 14
- TypeScript
- SCSS Modules
- Cloudflare Pages (hosting)
- Cloudflare Images (lưu trữ hình ảnh)

## Cài đặt và chạy

### Yêu cầu

- Node.js 18.18.0 hoặc cao hơn
- npm 9.8.0 hoặc cao hơn

### Cài đặt

```bash
# Clone repository
git clone https://github.com/hoaqinz/92lt.git
cd 92lt

# Cài đặt dependencies
npm install
```

### Chạy ứng dụng

```bash
# Chạy môi trường development
npm run dev

# Build ứng dụng
npm run build

# Chạy môi trường production
npm start
```

### Triển khai lên Cloudflare Pages

```bash
# Build cho Cloudflare Pages
npm run cloudflare-build
```

## Cấu hình Cloudflare Images

Ứng dụng sử dụng Cloudflare Images để lưu trữ và quản lý hình ảnh. Để cấu hình:

1. Sao chép file `.env.local.example` thành `.env.local`
2. Cập nhật các biến môi trường với thông tin Cloudflare của bạn
3. Xem hướng dẫn chi tiết tại [docs/cloudflare-images-setup.md](docs/cloudflare-images-setup.md)

## Quản trị viên

Truy cập trang quản trị tại `/admin/login` với thông tin đăng nhập:
- Tên đăng nhập: `admin92lottery`
- Mật khẩu: `secure_password_123`

## Tối ưu hóa SEO

Ứng dụng đã được tối ưu hóa SEO cho từ khóa "92lottery" với:
- Thẻ meta title, description và keywords
- Thẻ Open Graph và Twitter Card
- Cấu trúc URL thân thiện với SEO
- Ngôn ngữ tiếng Việt (vi)

## Giấy phép

© 2023 92LOTTERY. Đã đăng ký bản quyền.
