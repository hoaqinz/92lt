/**
 * Hàm tải ảnh lên Cloudflare Images trực tiếp từ client
 * @param {File} file - File ảnh cần tải lên
 * @param {string} accountId - Cloudflare Account ID
 * @param {string} apiToken - Cloudflare API Token
 * @returns {Promise<{success: boolean, url: string, id: string}>}
 */
async function uploadToCloudflareImages(file, accountId, apiToken) {
  console.log('Bắt đầu tải ảnh lên Cloudflare Images...');
  
  // Kiểm tra tham số
  if (!file || !accountId || !apiToken) {
    console.error('Thiếu tham số cần thiết', { file: !!file, accountId: !!accountId, apiToken: !!apiToken });
    throw new Error('Thiếu tham số cần thiết');
  }
  
  // Kiểm tra loại file
  if (!file.type.startsWith('image/')) {
    throw new Error('File phải là hình ảnh');
  }
  
  // Kiểm tra kích thước file (tối đa 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Kích thước file không được vượt quá 10MB');
  }
  
  try {
    // Tạo FormData để gửi file
    const formData = new FormData();
    formData.append('file', file);
    
    // Gửi request đến Cloudflare Images API
    console.log('Gửi request đến Cloudflare Images API...');
    
    // Sử dụng CORS proxy khi ở môi trường development
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiUrl = isLocalhost
      ? `https://cors-anywhere.herokuapp.com/https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`
      : `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        // Thêm header cho CORS proxy
        ...(isLocalhost ? { 'X-Requested-With': 'XMLHttpRequest' } : {})
      },
      body: formData
    });
    
    console.log('Nhận phản hồi từ Cloudflare Images API:', {
      status: response.status,
      statusText: response.statusText
    });
    
    // Kiểm tra response
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Lỗi từ Cloudflare API:', errorData);
      throw new Error(`Lỗi từ Cloudflare API: ${errorData.errors?.[0]?.message || 'Không xác định'}`);
    }
    
    // Parse response
    const data = await response.json();
    console.log('Dữ liệu phản hồi từ Cloudflare Images API:', data);
    
    if (!data.success || !data.result) {
      throw new Error('Phản hồi không hợp lệ từ Cloudflare API');
    }
    
    // Lấy URL của ảnh
    const imageId = data.result.id;
    const variants = data.result.variants;
    
    if (!variants || variants.length === 0) {
      throw new Error('Không có URL ảnh được trả về');
    }
    
    const imageUrl = variants[0];
    console.log('Tải ảnh lên thành công:', { id: imageId, url: imageUrl });
    
    return {
      success: true,
      url: imageUrl,
      id: imageId
    };
  } catch (error) {
    console.error('Lỗi khi tải ảnh lên Cloudflare Images:', error);
    throw error;
  }
}

// Thêm hàm vào window object để có thể gọi từ bất kỳ đâu
window.uploadToCloudflareImages = uploadToCloudflareImages;
