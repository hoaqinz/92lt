import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware này sẽ chạy trên các route admin
export function middleware(request: NextRequest) {
  console.log('Middleware running for path:', request.nextUrl.pathname);

  // Lấy cookie adminAuth
  const adminAuth = request.cookies.get('adminAuth')?.value;
  console.log('Cookie found:', adminAuth ? 'Yes' : 'No');

  // Kiểm tra nếu đường dẫn bắt đầu bằng /admin và không phải là /admin/login
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')
  ) {
    console.log('Protected route detected');

    // Nếu không có cookie adminAuth, chuyển hướng đến trang đăng nhập
    if (!adminAuth) {
      console.log('No auth cookie, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Phân tích cookie để kiểm tra tính hợp lệ
      const authData = JSON.parse(adminAuth);
      console.log('Auth data parsed:', authData);

      // Kiểm tra xem cookie có chứa thông tin đăng nhập không
      if (!authData.isLoggedIn) {
        console.log('Not logged in, redirecting to login');
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      // Kiểm tra thời gian hết hạn (24 giờ)
      const now = new Date().getTime();
      const expirationTime = 24 * 60 * 60 * 1000; // 24 giờ tính bằng mili giây

      if (now - authData.timestamp > expirationTime) {
        console.log('Session expired, redirecting to login');
        // Cookie đã hết hạn, xóa cookie và chuyển hướng đến trang đăng nhập
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('adminAuth');
        return response;
      }

      console.log('Auth valid, proceeding');
    } catch (error) {
      console.error('Error parsing auth data:', error);
      // Nếu có lỗi khi phân tích cookie, chuyển hướng đến trang đăng nhập
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  } else {
    console.log('Public route or login page, proceeding');
  }

  // Cho phép tiếp tục nếu đã xác thực hoặc đang truy cập trang đăng nhập
  return NextResponse.next();
}

// Chỉ áp dụng middleware cho các route admin
export const config = {
  matcher: '/admin/:path*',
};
