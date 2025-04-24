// Hàm này sẽ tạo ra các tham số tĩnh cho trang
export function generateStaticParams() {
  // Tạo một mảng các ID mẫu để tạo trang tĩnh
  return [
    { id: 'sample-post-1' },
    { id: 'sample-post-2' },
    { id: 'sample-post-3' }
  ];
}
