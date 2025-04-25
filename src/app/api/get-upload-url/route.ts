import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Thông tin xác thực Cloudflare
    const accountId = '04725e5acc15b760fb22bf197ff9799f';
    const apiToken = 'JZYoQdkbYec97Na325HqQwEJAUn12Wh_tw6iUtPp';

    // Gửi request đến Cloudflare API để lấy URL tải lên trực tiếp
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify({
          requireSignedURLs: false,
          metadata: {
            source: 'next_api_route'
          }
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Lỗi khi lấy URL tải lên trực tiếp:', result);
      return NextResponse.json(
        { error: 'Lỗi khi lấy URL tải lên trực tiếp', details: result },
        { status: 500 }
      );
    }

    // Trả về URL tải lên trực tiếp
    return NextResponse.json(result);
  } catch (error) {
    console.error('Lỗi xử lý:', error);
    return NextResponse.json(
      { error: 'Lỗi server', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
