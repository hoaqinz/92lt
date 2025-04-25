// Script để xử lý các lỗi 404 từ các yêu cầu prefetch
(function() {
  // Lưu trữ fetch gốc
  const originalFetch = window.fetch;

  // Ghi đè fetch để chặn các yêu cầu không cần thiết
  window.fetch = function(input, init) {
    // Kiểm tra nếu yêu cầu là cho tệp .txt hoặc có tham số _rsc
    if (typeof input === 'string' && 
        (input.endsWith('.txt') || 
         input.includes('_rsc=') || 
         input.includes('/index.txt'))) {
      console.log('Intercepted fetch request:', input);
      
      // Trả về phản hồi trống với mã trạng thái 200
      return Promise.resolve(new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    
    // Nếu không, sử dụng fetch gốc
    return originalFetch.apply(this, arguments);
  };

  // Xử lý các lỗi không bắt được bởi fetch
  window.addEventListener('error', function(event) {
    // Kiểm tra nếu lỗi liên quan đến tệp .txt hoặc _rsc
    if (event.filename && 
        (event.filename.endsWith('.txt') || 
         event.filename.includes('_rsc=') || 
         event.filename.includes('/index.txt'))) {
      // Ngăn chặn lỗi hiển thị trong console
      event.preventDefault();
      return true;
    }
  }, true);

  console.log('404 error handler initialized');
})();
