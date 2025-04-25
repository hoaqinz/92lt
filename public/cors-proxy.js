// CORS Proxy cho Cloudflare API
(function() {
  // Lưu trữ fetch gốc
  const originalFetch = window.fetch;

  // Ghi đè fetch để xử lý CORS
  window.fetch = function(input, init) {
    // Kiểm tra nếu đang gọi đến Cloudflare API
    if (typeof input === 'string' && input.includes('api.cloudflare.com')) {
      console.log('Intercepting Cloudflare API request:', input);
      
      // Thay đổi URL để sử dụng CORS proxy
      const proxyUrl = 'https://corsproxy.io/?';
      const targetUrl = input;
      
      console.log('Using CORS proxy for:', targetUrl);
      
      // Gọi fetch gốc với URL proxy
      return originalFetch.call(this, proxyUrl + encodeURIComponent(targetUrl), init);
    }
    
    // Nếu không phải Cloudflare API, sử dụng fetch gốc
    return originalFetch.apply(this, arguments);
  };
  
  console.log('CORS proxy initialized for Cloudflare API');
})();
