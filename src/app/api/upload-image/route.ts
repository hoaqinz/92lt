import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-static';

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

    // Tạo FormData mới cho request
    const formDataForUpload = new FormData();
    formDataForUpload.append('file', new Blob([buffer]), file.name);
    formDataForUpload.append('id', imageId);
    formDataForUpload.append('metadata', JSON.stringify({
      uploadedFrom: '92lottery-admin'
    }));
    
    // Gửi request đến Cloudflare Images API
    const uploadResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
        body: formDataForUpload,
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

// Thêm API endpoint để lấy thông tin Cloudflare
export async function GET() {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const accountHash = process.env.CLOUDFLARE_ACCOUNT_HASH || '';
    
    if (!accountId || !accountHash) {
      return NextResponse.json(
        { error: 'Cloudflare credentials not configured' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      result: {
        deliveryUrl: `https://imagedelivery.net/${accountHash}`,
        accountId
      }
    });
  } catch (error) {
    console.error('Error getting Cloudflare info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
