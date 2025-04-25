export async function onRequest(context) {
  // Xử lý CORS
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Chỉ chấp nhận phương thức POST
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    // Nhận form data từ request
    const formData = await context.request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'Không tìm thấy file' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'File phải là hình ảnh' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Kiểm tra kích thước file (tối đa 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'Kích thước file không được vượt quá 10MB' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Tạo form data mới để gửi đến Cloudflare Images API
    const cloudflareFormData = new FormData();
    cloudflareFormData.append('file', file);
    
    // Lấy thông tin xác thực từ biến môi trường
    const accountId = context.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = context.env.CLOUDFLARE_API_TOKEN;
    
    if (!accountId || !apiToken) {
      console.error('Thiếu thông tin xác thực Cloudflare');
      return new Response(JSON.stringify({ error: 'Lỗi cấu hình server' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
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
      return new Response(JSON.stringify({ error: 'Lỗi khi tải ảnh lên', details: uploadResult }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Trả về URL của ảnh đã tải lên
    return new Response(JSON.stringify({
      success: true,
      url: uploadResult.result.variants[0],
      id: uploadResult.result.id
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Lỗi xử lý tải ảnh lên:', error);
    return new Response(JSON.stringify({ error: 'Lỗi server', message: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
