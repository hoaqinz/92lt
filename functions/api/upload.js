// Hàm để log thông tin
function logInfo(message, data) {
  console.log(`[INFO] ${message}`, data);
}

// Hàm để log lỗi
function logError(message, error) {
  console.error(`[ERROR] ${message}`, error);
}

export async function onRequest(context) {
  // Log thông tin request
  logInfo('Received upload request', {
    method: context.request.method,
    url: context.request.url,
  });

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
    logInfo('Parsing form data', {});
    let formData;
    try {
      formData = await context.request.formData();
      logInfo('Form data parsed successfully', {});
    } catch (error) {
      logError('Error parsing form data', error);
      return new Response(JSON.stringify({ error: 'Lỗi khi xử lý form data', details: error.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    const file = formData.get('file');
    logInfo('File from form data', { 
      exists: !!file, 
      type: file ? file.type : 'unknown',
      size: file ? file.size : 0
    });
    
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
    
    logInfo('Cloudflare credentials', { 
      accountId: accountId ? 'Found' : 'Not found',
      apiToken: apiToken ? 'Found' : 'Not found'
    });
    
    if (!accountId || !apiToken) {
      logError('Thiếu thông tin xác thực Cloudflare', { 
        accountId: !!accountId,
        apiToken: !!apiToken
      });
      return new Response(JSON.stringify({ 
        error: 'Lỗi cấu hình server', 
        details: 'Thiếu thông tin xác thực Cloudflare'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Gửi request đến Cloudflare Images API
    logInfo('Sending request to Cloudflare Images API', {
      url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`
    });
    
    let uploadResponse;
    try {
      uploadResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`
          },
          body: cloudflareFormData
        }
      );
      
      logInfo('Cloudflare API response received', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText
      });
    } catch (error) {
      logError('Error sending request to Cloudflare API', error);
      return new Response(JSON.stringify({ 
        error: 'Lỗi kết nối đến Cloudflare API', 
        details: error.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    let uploadResult;
    try {
      const responseText = await uploadResponse.text();
      logInfo('Response text from Cloudflare API', { text: responseText.substring(0, 200) + '...' });
      uploadResult = JSON.parse(responseText);
    } catch (error) {
      logError('Error parsing Cloudflare API response', error);
      return new Response(JSON.stringify({ 
        error: 'Lỗi khi xử lý phản hồi từ Cloudflare API', 
        details: error.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (!uploadResponse.ok) {
      logError('Cloudflare API returned error', uploadResult);
      return new Response(JSON.stringify({ 
        error: 'Lỗi khi tải ảnh lên', 
        details: uploadResult 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Kiểm tra kết quả từ Cloudflare API
    if (!uploadResult.success || !uploadResult.result) {
      logError('Cloudflare API returned success=false or missing result', uploadResult);
      return new Response(JSON.stringify({
        error: 'Lỗi khi tải ảnh lên',
        details: 'API trả về kết quả không hợp lệ',
        response: uploadResult
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    // Kiểm tra variants
    if (!uploadResult.result.variants || uploadResult.result.variants.length === 0) {
      logError('Cloudflare API returned no variants', uploadResult);
      return new Response(JSON.stringify({
        error: 'Lỗi khi tải ảnh lên',
        details: 'Không có URL ảnh được trả về',
        response: uploadResult
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    // Trả về URL của ảnh đã tải lên
    const imageUrl = uploadResult.result.variants[0];
    const imageId = uploadResult.result.id;
    
    logInfo('Upload successful', {
      url: imageUrl,
      id: imageId
    });
    
    return new Response(JSON.stringify({
      success: true,
      url: imageUrl,
      id: imageId
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    logError('Lỗi xử lý tải ảnh lên', error);
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
