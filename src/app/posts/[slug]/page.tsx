import PostClient from './PostClient';

// Dữ liệu mẫu cho các bài viết
const samplePosts = [
  {
    id: 1,
    title: 'Hướng dẫn cách chơi Win Go hiệu quả nhất',
    slug: 'huong-dan-choi-win-go',
    content: '<p>Win Go là một trong những trò chơi xổ số phổ biến nhất tại 92LOTTERY...</p>',
    excerpt: 'Tìm hiểu các chiến thuật và mẹo chơi Win Go để tăng cơ hội chiến thắng của bạn.',
    featuredImage: 'https://via.placeholder.com/1200x600/1a1a1a/ff0000?text=Win+Go+Guide',
    category: 'Hướng dẫn',
    author: 'Admin',
    createdAt: '2023-07-15T00:00:00Z',
    updatedAt: '2023-07-15T00:00:00Z',
    status: 'published'
  },
  {
    id: 2,
    title: 'Top 10 game Slots được yêu thích nhất tháng 7/2023',
    slug: 'top-10-game-slots',
    content: '<p>Slots là một trong những thể loại game casino phổ biến nhất tại 92LOTTERY...</p>',
    excerpt: 'Khám phá những game Slots hot nhất và được người chơi yêu thích trong tháng này.',
    featuredImage: 'https://via.placeholder.com/1200x600/1a1a1a/ffcc00?text=Top+Slots',
    category: 'Tin tức',
    author: 'Admin',
    createdAt: '2023-07-10T00:00:00Z',
    updatedAt: '2023-07-10T00:00:00Z',
    status: 'published'
  },
  {
    id: 3,
    title: 'Bài viết 1',
    slug: 'bai-viet-1',
    content: '<p>Nội dung bài viết 1...</p>',
    excerpt: 'Tóm tắt bài viết 1',
    featuredImage: 'https://via.placeholder.com/1200x600/1a1a1a/ff0000?text=Bai+Viet+1',
    category: 'Tin tức',
    author: 'Admin',
    createdAt: '2023-08-01T00:00:00Z',
    updatedAt: '2023-08-01T00:00:00Z',
    status: 'published'
  },
  {
    id: 4,
    title: 'Bài viết 2',
    slug: 'bai-viet-2',
    content: '<p>Nội dung bài viết 2...</p>',
    excerpt: 'Tóm tắt bài viết 2',
    featuredImage: 'https://via.placeholder.com/1200x600/1a1a1a/ff0000?text=Bai+Viet+2',
    category: 'Hướng dẫn',
    author: 'Admin',
    createdAt: '2023-08-02T00:00:00Z',
    updatedAt: '2023-08-02T00:00:00Z',
    status: 'published'
  },
  {
    id: 5,
    title: 'Bài viết 3',
    slug: 'bai-viet-3',
    content: '<p>Nội dung bài viết 3...</p>',
    excerpt: 'Tóm tắt bài viết 3',
    featuredImage: 'https://via.placeholder.com/1200x600/1a1a1a/ff0000?text=Bai+Viet+3',
    category: 'Khuyến mãi',
    author: 'Admin',
    createdAt: '2023-08-03T00:00:00Z',
    updatedAt: '2023-08-03T00:00:00Z',
    status: 'published'
  }
];

// Hàm này cần thiết cho static export với dynamic routes
export function generateStaticParams() {
  // Trong môi trường static export, chúng ta cần cung cấp danh sách các slug cố định
  return [
    { slug: 'huong-dan-choi-win-go' },
    { slug: 'top-10-game-slots' },
    { slug: 'bai-viet-1' },
    { slug: 'bai-viet-2' },
    { slug: 'bai-viet-3' },
    { slug: 'bai-viet-4' },
    { slug: 'bai-viet-5' },
    { slug: 'bai-viet-moi-nhat' },
    { slug: 'huong-dan-su-dung' },
    { slug: 'gioi-thieu' },
    { slug: 'lien-he' },
    { slug: 'chinh-sach-bao-mat' },
    { slug: 'dieu-khoan-su-dung' },
  ];
}

// Hàm này sẽ được gọi khi trang được render
export default function PostPage({ params }: { params: { slug: string } }) {
  // Truyền params xuống client component
  return <PostClient slug={params.slug} />;
}
