export async function onRequest(context) {
  // Xử lý CORS
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Chỉ chấp nhận phương thức GET
  if (context.request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    // Lấy thông tin xác thực từ biến môi trường
    const accountId = context.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = context.env.CLOUDFLARE_API_TOKEN;
    
    if (!accountId || !apiToken) {
      console.error('Thiếu thông tin xác thực Cloudflare');
      return new Response(JSON.stringify({ 
        error: 'Lỗi cấu hình server',
        details: {
          accountId: !!accountId,
          apiToken: !!apiToken
        }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

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
            source: 'cloudflare_function'
          }
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Lỗi khi lấy URL tải lên trực tiếp:', result);
      return new Response(JSON.stringify({ 
        error: 'Lỗi khi lấy URL tải lên trực tiếp', 
        details: result 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Trả về URL tải lên trực tiếp
    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Lỗi xử lý:', error);
    return new Response(JSON.stringify({ 
      error: 'Lỗi server', 
      message: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
