import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware này sẽ xử lý các yêu cầu prefetch để tránh lỗi 404
export function middleware(request: NextRequest) {
  // Xử lý các yêu cầu prefetch từ Next.js để tránh lỗi 404
  if (request.nextUrl.search.includes('_rsc') || 
      request.nextUrl.search.includes('_next') ||
      request.nextUrl.pathname.endsWith('.txt')) {
    // Trả về phản hồi trống với mã trạng thái 200 thay vì để nó đi đến 404
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  }

  // Cho phép yêu cầu tiếp tục như bình thường
  return NextResponse.next();
}

// Áp dụng middleware cho tất cả các đường dẫn ngoại trừ các tệp tĩnh và API
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
