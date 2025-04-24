import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Nhận form data từ request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Không tìm thấy file' },
        { status: 400 }
      );
    }

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File phải là hình ảnh' },
        { status: 400 }
      );
    }

    // Kiểm tra kích thước file (tối đa 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Kích thước file không được vượt quá 10MB' },
        { status: 400 }
      );
    }

    // Tạo form data mới để gửi đến Cloudflare Images API
    const cloudflareFormData = new FormData();
    cloudflareFormData.append('file', file);
    
    // Lấy thông tin xác thực từ biến môi trường
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    
    if (!accountId || !apiToken) {
      console.error('Thiếu thông tin xác thực Cloudflare');
      return NextResponse.json(
        { error: 'Lỗi cấu hình server' },
        { status: 500 }
      );
    }

    // Gửi request đến Cloudflare Images API
    const uploadResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`
        },
        body: cloudflareFormData
      }
    );

    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok) {
      console.error('Lỗi tải ảnh lên Cloudflare:', uploadResult);
      return NextResponse.json(
        { error: 'Lỗi khi tải ảnh lên' },
        { status: 500 }
      );
    }

    // Trả về URL của ảnh đã tải lên
    return NextResponse.json({
      success: true,
      url: uploadResult.result.variants[0],
      id: uploadResult.result.id
    });
  } catch (error) {
    console.error('Lỗi xử lý tải ảnh lên:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
