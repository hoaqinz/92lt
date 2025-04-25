// CORS Proxy cho Cloudflare API
(function() {
  // Lưu trữ fetch gốc
  const originalFetch = window.fetch;

  // Ghi đè fetch để xử lý CORS
  window.fetch = function(input, init) {
    // Kiểm tra nếu đang gọi đến Cloudflare API
    if (typeof input === 'string' && input.includes('api.cloudflare.com')) {
      console.log('Intercepting Cloudflare API request:', input);
      
      // Sử dụng CORS proxy khi ở môi trường development
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isLocalhost) {
        // Sử dụng CORS Anywhere proxy
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = input;
        
        console.log('Using CORS proxy for:', targetUrl);
        
        // Thêm header cho CORS proxy
        const newInit = {
          ...init,
          headers: {
            ...init?.headers,
            'X-Requested-With': 'XMLHttpRequest'
          }
        };
        
        // Gọi fetch gốc với URL proxy
        return originalFetch.call(this, proxyUrl + targetUrl, newInit);
      }
    }
    
    // Nếu không phải Cloudflare API hoặc không phải localhost, sử dụng fetch gốc
    return originalFetch.apply(this, arguments);
  };
  
  console.log('CORS proxy initialized for Cloudflare API');
})();
