import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Lấy thông tin từ environment variables
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      return NextResponse.json(
        { error: 'Cloudflare credentials not configured' },
        { status: 500 }
      );
    }

    // Lấy file từ request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Tạo unique ID cho hình ảnh
    const imageId = uuidv4();

    // Chuyển đổi File thành ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Gửi request đến Cloudflare Images API
    const uploadResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
        body: createFormData(buffer, file.name, imageId),
      }
    );

    const uploadResult = await uploadResponse.json();

    if (!uploadResult.success) {
      console.error('Cloudflare upload error:', uploadResult.errors);
      return NextResponse.json(
        { error: 'Failed to upload image to Cloudflare' },
        { status: 500 }
      );
    }

    // Tạo URL cho hình ảnh đã tải lên
    const imageUrl = `https://imagedelivery.net/${accountId}/${uploadResult.result.id}/public`;

    return NextResponse.json({
      success: true,
      result: {
        id: uploadResult.result.id,
        variants: [imageUrl]
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function để tạo FormData
function createFormData(buffer: Buffer, filename: string, id: string) {
  const formData = new FormData();
  
  // Tạo Blob từ buffer
  const blob = new Blob([buffer]);
  
  // Thêm file vào FormData
  formData.append('file', blob, filename);
  
  // Thêm metadata
  formData.append('id', id);
  formData.append('metadata', JSON.stringify({
    uploadedFrom: '92lottery-admin'
  }));
  
  return formData;
}
